import { Schema } from "mongoose";
import { setLastUpdated } from "./messages.methods";
import {
    findBySenderId, findByMessageId, getByChannelId,
    getStatus, findByReceivers,getByDate, getByDateRange,
    getUserSeenId, getUserAcknowledgeId
} from "./messages.statics"

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

MessageSchema.statics.findBySenderId = findBySenderId;
MessageSchema.statics.findByMessageId = findByMessageId
MessageSchema.statics.getByChannelId = getByChannelId
MessageSchema.statics.getStatus = getStatus
MessageSchema.statics.findByReceivers = findByReceivers
MessageSchema.statics.getUserSeenId = getUserSeenId
MessageSchema.statics.getUserAcknowledgeId = getUserAcknowledgeId
MessageSchema.statics.getByDateRange = getByDateRange
MessageSchema.statics.getByDate = getByDate

MessageSchema.methods.setLastUpdated = setLastUpdated


export default MessageSchema;
