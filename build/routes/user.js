"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Users_1 = require("../controllers/Users");
const router = express_1.default.Router();
// Routes
router.post('/login', Users_1.user.login);
exports.default = router;
