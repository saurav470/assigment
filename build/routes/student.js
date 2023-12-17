"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the required modules
const express_1 = __importDefault(require("express"));
const Users_1 = require("../controllers/Users");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/tasks', auth_1.auth, auth_1.isStudent, Users_1.studentController.viewTasks);
router.patch('/completeTask/:taskId', auth_1.auth, auth_1.isStudent, Users_1.studentController.completeTask);
exports.default = router;
