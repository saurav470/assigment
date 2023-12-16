// Import the required modules
import express from "express";
import { studentController } from "../controllers/Users";
import { auth, isStudent } from "../middlewares/auth";
const router = express.Router()



router.get('/tasks', auth, isStudent, studentController.viewTasks);
router.patch('/completeTask/:taskId', auth, isStudent, studentController.completeTask);

export default router;