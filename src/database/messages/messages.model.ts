import * as Mongoose from "mongoose";
import {IMessageDocument, IMessageModel} from "./messages.types";
import MessageSchema from "./messages.schema";
export const MessageModel = Mongoose.model<IMessageDocument>("message", MessageSchema) as IMessageModel;
