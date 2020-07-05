import { Document, Model } from "mongoose";
export interface IMessage {
    fromUserId: string;
    messageId: string;
    toUserIds: string[]|string;
    channelsId: string[]|boolean;
    body: string;
    type: MessageType;
    seen: actionStatus[];
    acknowledged: actionStatus[];
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IMessageDocument extends IMessage, Document {
    setLastUpdated: (this: IMessageDocument) => Promise<void>;
}
export interface IMessageModel extends Model<IMessageDocument> {
    findBySenderId: (
        this: IMessageModel,
        userId: string
    ) => Promise<IMessageDocument>;
    findByMessageId: (
        this: IMessageModel,
        messageId: string
    ) => Promise<IMessageDocument>;
    getStatus: (
        this: IMessageModel,
        messageId: string,
        seen?: boolean,
        acknowledged?: boolean,
    ) => Promise<IMessageDocument>;
    findByReceivers: (
        this: IMessageModel,
        userIds: string[]|string
    ) => Promise<IMessageDocument[]>;
    getUserSeenId: (
        this: IMessageModel,
        status: string
    ) => Promise<IMessageDocument[]>;
    getUserAcknowledgeId: (
        this: IMessageModel,
        status: string
    ) => Promise<IMessageDocument[]>;
}

export interface actionStatus {
    userId: string;
    status: boolean;
}

export enum MessageType {
    'text'= 'text',
    'voice'= 'voice',
    'video' = 'video'
}
