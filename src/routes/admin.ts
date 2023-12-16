// Import the required modules
import express from "express";
import { adminController } from "../controllers/Users";
import { auth, isAdmin } from "../middlewares/auth";
const router = express.Router()


// Routes

router.post('/addStudent', auth, isAdmin, adminController.addStudent);
router.post('/assignTask', auth, isAdmin, adminController.assignTask);


export default router;