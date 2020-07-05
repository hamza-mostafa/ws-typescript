"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const Mongoose = require("mongoose");
const messages_schema_1 = require("./messages.schema");
exports.MessageModel = Mongoose.model("message", messages_schema_1.default);
//# sourceMappingURL=messages.model.js.map