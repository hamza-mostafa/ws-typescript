export interface receivedMessage {
    body: string,
    channelId:string|boolean|any,
    receiverId: string|boolean,
    broadcast: boolean
}
