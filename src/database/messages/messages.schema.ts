import { Schema } from "mongoose";
import { setLastUpdated } from "./messages.methods";
import {getChannels, findByChannel, findByUserId, findByEmail} from "./messages.statics"
import { MessageType, actionStatus} from "./messages.types";

const MessageSchema = new Schema({
    fromUserId: String,
    toUserIds: Array,
    channelsId: Array,
    body: String,
    type: {
        type: String,
        enum : ['text','voice','video'],
        default: 'text'
    },
    seen: {id: String, status: Boolean},
    acknowledged: {id: String, status: Boolean},
    dateOfEntry: {
        type: Date,
        default: new Date()
    },
    lastUpdated: {
        type: Date,
        default: new Date()
    },
});


export default MessageSchema;
