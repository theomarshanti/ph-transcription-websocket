// tslint:disable:no-console

import { Request, Response } from 'express';
import { sendMessage } from "./websocket";
import { WebSocketContainer } from "./model";

export const method1 = (req: Request, res: Response) => {
    console.log('method1 - ');
    console.log(req);
    res.send('Hello World!');
}

export const method2 = (req: Request, res: Response) => {
    console.log('method2 - ');
    console.log(req);
    res.send('Hello Route!');
}

export const postMsg = (req: Request, res: Response, wsClients: WebSocketContainer[]) => {
    for(const wsClient of wsClients) {
        sendMessage(wsClient.wsClient, JSON.stringify(req.body));
    }
    res.send();
}