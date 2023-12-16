
import express from "express";
import { user } from "../controllers/Users";
const router = express.Router()


// Routes
router.post('/login', user.login);

export default router;