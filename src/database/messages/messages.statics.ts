import { IMessageDocument, IMessageModel } from "./messages.types";

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
    return this.find({fromUserId: userId, "acknowledged.status": status})
}
export async function getByChannelId(
    this: IMessageModel,
    channelId: string[]|string,
    userId: string
): Promise<IMessageDocument[]>{
    return this.find({fromUserId: userId, channelsId: { $in: Array.isArray(channelId)? channelId: [channelId]}})
}
export async function getByDate(
    this: IMessageModel,
    userId: string,
    min?: Date,
    max?: Date,
    exact?: Date
): Promise<IMessageDocument[]>{
    return this.aggregate([{
        $match: {
            $and: [
                {fromUserId: userId},
                {
                    dateOfEntry: {
                    $or: [
                        {$lte: max},
                        {$gte: min},
                        {$match: exact}
                        ]
                    }
                }
            ]}
    }, ])
}
export async function getByDateRange(
    this: IMessageModel,
    userId: string,
    min: Date,
    max: Date,
): Promise<IMessageDocument[]>{
    return this.aggregate([{
        $match: {
            $and: [
                {fromUserId: userId},
                {
                    dateOfEntry: {
                    $and: [
                        {$lte: max},
                        {$gte: min}
                        ]
                    }
                }
            ]}
    }, ])
}
