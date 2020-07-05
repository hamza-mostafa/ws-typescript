import { Schema } from "mongoose";
import { setLastUpdated } from "./users.methods";
import {getChannels, findByChannel, findByUserId, findByEmail} from "./users.statics"

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    channelsId: Array,
    userId: String,
    dateOfEntry: {
        type: Date,
        default: new Date()
    },
    lastUpdated: {
        type: Date,
        default: new Date()
    }
});

UserSchema.statics.findByChannel = findByChannel;
UserSchema.statics.findByUserId = findByUserId;
UserSchema.statics.findByEmail = findByEmail;
UserSchema.statics.getChannels = getChannels;

UserSchema.methods.setLastUpdated = setLastUpdated;

export default UserSchema;
