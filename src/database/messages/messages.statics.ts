import { IMessageDocument, IMessageModel } from "./messages.types";

export async function findByUserId(this: IMessageModel, userId: string): Promise<IMessageDocument|null> {
    return this.findOne({ userId });
}

export async function findByEmail(
    this: IMessageModel,
    email: string
): Promise<IMessageDocument|null> {
    return this.findOne({ email });
}

export async function findByChannel(
    this: IMessageModel,
    channelId: string,
): Promise<IMessageDocument[]> {
    return this.find({ "channelsId": channelId });
}
export async function getChannels(
    this: IMessageModel,
    userId: string
): Promise<IMessageDocument[]> {
    return this.find({ "userId": userId });
}

export async function findBySenderId(
    this: IMessageModel,
    userId: string
): Promise<IMessageDocument[]>{
 return this.find({userId: userId})
}
export async function findByMessageId(
    this: IMessageModel,
    messageId: string
): Promise<IMessageDocument|null>{
 return this.findOne({messageId: messageId})
}
export async function getStatus(
    this: IMessageModel,
    messageId: string
): Promise<IMessageDocument|null>{
 return this.findOne({messageId: messageId},{seen: 1, acknowledged: 1})
}
export async function findByReceivers(
    this: IMessageModel,
    userIds: string[]|string
): Promise<IMessageDocument[]>{
 return this.find({
     userIds: { $in: Array.isArray(userIds)? userIds: [userIds]
     }
 });
}
export async function getUserSeenId(
    this: IMessageModel,
    status: string,
    userId: string
): Promise<IMessageDocument[]>{
 return this.find({fromUserId: userId, "seen.status": status})
}
export async function getUserAcknowledgeId(
    this: IMessageModel,
    status: string,
    userId: string
): Promise<IMessageDocument[]>{
    return this.find({fromUserId: userId, "seen.status": status})
}
