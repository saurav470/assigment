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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isStudent = exports.auth = void 0;
// Importing required modules
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
// import User from "../models/User";
// Configuring dotenv to load environment variables from .env file
dotenv_1.default.config();
// This function is used as middleware to authenticate user requests
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extracting JWT from request cookies, body or header
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            return res.status(401).json({ success: false, message: `Token Missing` });
        }
        try {
            // Verifying the JWT using the secret key stored in environment variables
            if (!process.env.JWT_SECRET) {
                return res.status(401).json({ success: false, message: 'Token Missing' });
            }
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Storing the decoded JWT payload in the request object for further use
            req.user = decode;
        }
        catch (error) {
            // If JWT verification fails, return 401 Unauthorized response
            return res
                .status(401)
                .json({ success: false, message: "token is invalid" });
        }
        // If JWT is valid, move on to the next middleware or request handler
        next();
    }
    catch (error) {
        // If there is an error during the authentication process, return 401 Unauthorized response
        return res.status(401).json({
            success: false,
            message: `Something Went Wrong While Validating the Token`,
        });
    }
});
exports.auth = auth;
const isStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = yield User_1.User.findOne({ email: req.user.email });
        if (!userDetails) {
            return res.status(400).json({ message: "user not found", success: false });
        }
        if (userDetails.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Students",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: `User Role Can't be Verified` });
    }
});
exports.isStudent = isStudent;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = yield User_1.User.findOne({ email: req.user.email });
        if (!userDetails) {
            return res.status(400).json({ message: "user not found", success: false });
        }
        if (userDetails.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin",
            });
        }
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
});
exports.isAdmin = isAdmin;
