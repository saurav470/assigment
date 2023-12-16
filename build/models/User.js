"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// Import the Mongoose library
const mongoose_1 = __importDefault(require("mongoose"));
// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose_1.default.Schema({
    // Define the name field with type String, required, and trimmed
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    // Define the email field with type String, required, and trimmed
    email: {
        type: String,
        required: true,
        trim: true,
    },
    // Define the password field with type String and required
    password: {
        type: String,
        required: true,
    },
    // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
    accountType: {
        type: String,
        enum: ["Admin", "Student"],
        required: true,
    },
    tasks: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "Task",
        }],
    department: {
        type: String,
    }
}, {
    versionKey: false, // Exclude the __v field
});
// Export the Mongoose model for the user schema, using the name "user"
exports.User = mongoose_1.default.model('user', userSchema);
