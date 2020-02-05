// tslint:disable:no-console
import { WebSocketContainer } from "./model";
import { wsClients } from './index';

export const handleMessage = (msg: any) => {
    console.log(`handleMessage - msg=${msg}`);
}

export const sendMessage = (wsClient: WebSocket, msg: any) => {
    wsClient.send(msg);
}

export const handleError = (event: any, wsClient: WebSocketContainer) => {
    console.log(`error - event=${event} - id = ${wsClient.id}`);
    removeElement(wsClient);
}

export const handleClose = (event: any, wsClient: WebSocketContainer) => {
    console.log(`close - event=${event} - id = ${wsClient.id}`);
    removeElement(wsClient);
}

export const removeElement = (wsClient: WebSocketContainer) => {
    const index = wsClients.findIndex((ws: WebSocketContainer ) => ws.id === wsClient.id);
    if (index > -1) {
        wsClients.splice(index, 1);
    };
    console.log(`remove - id=${wsClient.id} - index=${index} - new Size=${wsClients.length}`);
}