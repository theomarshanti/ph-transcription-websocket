// tslint:disable:no-console
import {PubSub, Subscription} from '@google-cloud/pubsub';
import {subscriptionName} from './constants';
import { sendMessage } from './websocket';
import { WebSocketContainer } from './model';

const pubSubClient = new PubSub();

export async function listenForMessages() {
    const subscription = pubSubClient.subscription(subscriptionName);
    return subscription;
}

export function terminateMessageListener(subscription:Subscription) {
    subscription.removeListener('message', messageHandler)
    return;
}

export const messageHandler = (message: any, wsClients: WebSocketContainer[]) => {
    console.log(`messageHandler - Received message ${message.id}:`);
    console.log(`messageHandler - Data: ${message.data}`);
    console.log(`messageHandler - Sending to ${wsClients.length} subscribers`)
    for(const wsClient of wsClients) {
        sendMessage(wsClient.wsClient, message.data.toString());
    }

    message.ack();
};