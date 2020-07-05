import { Document, Model } from "mongoose";
export interface IUser {
    firstName: string;
    lastName: string;
    channelsId: string[]|boolean;
    email: string;
    userId: string;
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IUserDocument extends IUser, Document {
    setLastUpdated: (this: IUserDocument) => Promise<void>;
}
export interface IUserModel extends Model<IUserDocument> {
    findByUserId: (
        this: IUserModel,
        userId: string
    ) => Promise<IUserDocument>;
    findByEmail: (
        this: IUserModel,
        email: string
    ) => Promise<IUserDocument>;
    findByChannel: (
        this: IUserModel,
        channelId: string
    ) => Promise<IUserDocument[]>;
    getChannels: (
        this: IUserModel,
        userId: string
    ) => Promise<IUserDocument[]>;
}
