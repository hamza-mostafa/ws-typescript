import * as n from "net";

export interface receivedMessage {
    body: string,
    channelId:string|boolean|any,
    receiverId: string|boolean,
    broadcast: boolean
}

export const SocMap = new WeakMap<n.Socket, string>();
