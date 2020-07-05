import { IUserDocument, IUserModel } from "./users.types";

export async function findByUserId(this: IUserModel, userId: string): Promise<IUserDocument|null> {
    return this.findOne({ userId });
}

export async function findByEmail(
    this: IUserModel,
    email: string
): Promise<IUserDocument|null> {
    return this.findOne({ email });
}

export async function findByChannel(
    this: IUserModel,
    channelId: string,
): Promise<IUserDocument[]> {
    return this.find({ "channelsId": channelId });
}
export async function getChannels(
    this: IUserModel,
    userId: string
): Promise<IUserDocument[]> {
    return this.find({ "userId": userId });
}
