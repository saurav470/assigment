"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    description: { type: String, required: true },
    dueTime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'overdue', 'completed'], default: 'pending' },
}, {
    versionKey: false, // Exclude the __v field
});
exports.Task = mongoose_1.default.model('Task', taskSchema);
