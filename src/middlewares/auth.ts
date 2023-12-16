
import { Response, NextFunction } from 'express';
// Importing required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IRequest } from '../types';
import { User } from '../models/User';
// import User from "../models/User";

// Configuring dotenv to load environment variables from .env file
dotenv.config();



// This function is used as middleware to authenticate user requests
export const auth = async (req: IRequest, res: Response, next: NextFunction) => {
	try {
		// Extracting JWT from request cookies, body or header
		const token = req.header("Authorization")?.replace("Bearer ", "");

		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			// Verifying the JWT using the secret key stored in environment variables
			if (!process.env.JWT_SECRET) {
				return res.status(401).json({ success: false, message: 'Token Missing' });
			}
			const decode = jwt.verify(token, process.env.JWT_SECRET);
		
			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
		} catch (error) {
			// If JWT verification fails, return 401 Unauthorized response
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		// If there is an error during the authentication process, return 401 Unauthorized response
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};
export const isStudent = async (req: IRequest, res: Response, next: NextFunction) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		if (!userDetails) {
			return res.status(400).json({ message: "user not found", success: false })
		}
		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({ success: false, message: `User Role Can't be Verified` });
	}
};
export const isAdmin = async (req: IRequest, res: Response, next: NextFunction) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		if (!userDetails) {
			return res.status(400).json({ message: "user not found", success: false })
		}

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
