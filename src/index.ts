// tslint:disable:no-console

// I. Imports
import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import { Subscription } from "@google-cloud/pubsub";
import { Server } from "ws";
import * as testMethods from './testMethods';
import {listenForMessages, terminateMessageListener, messageHandler} from './pubsub';
import {handleError, handleClose} from './websocket';
import bodyParser from "body-parser";
import { WebSocketContainer } from "./model";

// II. Environment Configuration
dotenv.config();
const apiPort = process.env.SERVER_PORT;
const wsPort = process.env.WS_PORT;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// III. Launch & Configure WebSocket Server
const wsServer: Server = new Server({port: Number(wsPort)});
console.log(`Websocket server is listening on port ${wsPort}`);

export let wsClients: WebSocketContainer[] = [];
let count = 1000;
wsServer.on('connection', (_wsClient: WebSocket) => {
    const webSocketContainer: WebSocketContainer = {
        id: count,
        wsClient: _wsClient
    }
    webSocketContainer.wsClient.onerror = (ev) => handleError(ev, webSocketContainer);
    webSocketContainer.wsClient.onclose = (ev) => handleClose(ev, webSocketContainer);
    wsClients.push(webSocketContainer)
    console.log(`New connection - id=${count} - # subscribers = ${wsClients.length}`);
    count++;
});

// IV. Launch PubSub Listener
let subscription: Subscription;
listenForMessages().then((_sub) => {
    console.log(`Connected to PubSub... listening for Messages`);
    subscription = _sub;
    subscription.on('message', (msg) => messageHandler(msg, wsClients));
});

// V. (Temp) Test Routes
app.get('/', testMethods.method1);
app.get('/help', testMethods.method2);
app.post('/msg', (req: Request, res: Response) => {
    console.log('msg hit. wsClient - ');
    testMethods.postMsg(req, res, wsClients);
    return;
})

// VI. Launch REST Server
const server = app.listen( apiPort, () => {
    console.log( `server started at http://localhost:${ apiPort }` );
} );

// VII. Garbage Collection -
server.on('close', () => {
    terminateMessageListener(subscription);
})
