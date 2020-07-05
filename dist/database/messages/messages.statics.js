"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByDateRange = exports.getByDate = exports.getByChannelId = exports.getUserAcknowledgeId = exports.getUserSeenId = exports.findByReceivers = exports.getStatus = exports.findByMessageId = exports.findBySenderId = void 0;
function findBySenderId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.find({ userId: userId });
    });
}
exports.findBySenderId = findBySenderId;
function findByMessageId(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findOne({ messageId: messageId });
    });
}
exports.findByMessageId = findByMessageId;
function getStatus(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findOne({ messageId: messageId }, { seen: 1, acknowledged: 1 });
    });
}
exports.getStatus = getStatus;
function findByReceivers(userIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.find({
            userIds: { $in: Array.isArray(userIds) ? userIds : [userIds]
            }
        });
    });
}
exports.findByReceivers = findByReceivers;
function getUserSeenId(status, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.find({ fromUserId: userId, "seen.status": status });
    });
}
exports.getUserSeenId = getUserSeenId;
function getUserAcknowledgeId(status, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.find({ fromUserId: userId, "acknowledged.status": status });
    });
}
exports.getUserAcknowledgeId = getUserAcknowledgeId;
function getByChannelId(channelId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.find({ fromUserId: userId, channelsId: { $in: Array.isArray(channelId) ? channelId : [channelId] } });
    });
}
exports.getByChannelId = getByChannelId;
function getByDate(userId, min, max, exact) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.aggregate([{
                $match: {
                    $and: [
                        { fromUserId: userId },
                        {
                            dateOfEntry: {
                                $or: [
                                    { $lte: max },
                                    { $gte: min },
                                    { $match: exact }
                                ]
                            }
                        }
                    ]
                }
            },]);
    });
}
exports.getByDate = getByDate;
function getByDateRange(userId, min, max) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.aggregate([{
                $match: {
                    $and: [
                        { fromUserId: userId },
                        {
                            dateOfEntry: {
                                $and: [
                                    { $lte: max },
                                    { $gte: min }
                                ]
                            }
                        }
                    ]
                }
            },]);
    });
}
exports.getByDateRange = getByDateRange;
//# sourceMappingURL=messages.statics.js.map