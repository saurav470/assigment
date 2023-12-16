import { Response } from "express"
// Import Mongoose models
import { User } from '../models/User';
import { Task } from '../models/Task';
import { IRequest } from "../types";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import mongoose from "mongoose";

//User controler

export const user = {
    // signup: async (req: IRequest, res: Response) => {
    //     try {


    //         const { Name, email, accountType, password } = req.body;
    //         var department;
    //         if (accountType === "Student") {


    //             { department } = req.body;
    //             if (!department) {
    //                 return res.status(400).json({ success: false, message: 'all field required' });
    //             }
    //         }
    //         if (!Name || !email || !accountType) {
    //             return res.status(400).json({ success: false, message: 'all field required' });
    //         }
    //         // Check if the email is already registered

    //         const existingUser = await User.findOne({ email });
    //         if (existingUser) {
    //             return res.status(400).json({ success: false, message: 'Email is already registered' });
    //         }
    //         const hashedPassword = await bcrypt.hash(password, 10)
    //         // Create a new user instance
    //         const newUser = accountType === "Student" ? new User({
    //             Name,
    //             email,
    //             password: hashedPassword,
    //             accountType,
    //             department
    //         }) : new User({
    //             Name,
    //             email,
    //             password: hashedPassword,
    //             accountType
    //         });

    //         // Save the user to the database
    //         await newUser.save();

    //         // Return success response
    //         res.json({ success: true, message: 'User registered successfully' });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ success: false, message: 'Internal server error' });
    //     }
    // },
    login: async (req: IRequest, res: Response) => {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Invalid credentials' });
            }
            const user = await User.findOne({ email });

            if (!user) {
                // Return 401 Unauthorized status code with error message
                return res.status(401).json({
                    success: false,
                    message: `User is not Registered with Us Please SignUp to Continue`,
                })
            }


            if (await bcrypt.compare(password, user.password)) {

                const token = jwt.sign(
                    { email: user.email, id: user._id, role: user.accountType },
                    process.env.JWT_SECRET!,
                    {
                        expiresIn: "24h",
                    }
                )


                if (user.accountType === 'Student') {
                    // Populate and return full student details
                    const StudentDetail: any = (await user.populate("tasks")).toObject()
                    delete StudentDetail.password

                    return res.json({ success: true, message: 'student login successful', token, tasks: StudentDetail.tasks, StudentDetail });

                } else {
                    return res.json({ success: true, message: 'Admin login successful', token });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: `Password is incorrect`,
                })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

};

// Admin Controller
export const adminController = {


    addStudent: async (req: IRequest, res: Response) => {
        try {
            const { Name, email, password, accountType, department } = req.body;

            if (!email || !password || !Name || !accountType || !department) {
                return res.status(400).json({ success: false, message: 'all field required' });
            }

            // Check if the student with the same email already exists
            const existingStudent = await User.findOne({ email });
            if (existingStudent) {
                return res.status(400).json({ success: false, message: 'Student with this email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10)


            // Create a new student
            const student = new User({
                Name,
                email,
                password: hashedPassword,
                accountType,
                department,
            });

            // Save the student to the database
            await student.save();

            res.json({ success: true, message: 'Student added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    assignTask: async (req: IRequest, res: Response) => {
        try {
            const { studentId, description, dueTime } = req.body;

            if (!studentId || !description || !dueTime) {
                return res.status(400).json({ success: false, message: 'all field required' });
            }
            // Check if the student exists
            const student = await User.findById(new mongoose.Types.ObjectId(studentId));
            if (!student || student.accountType !== 'Student') {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }

            // Create a new task
            const task = new Task({
                description,
                dueTime,
                status: 'pending',
            });


            // Add the task to the student's tasks array

            (student.tasks as mongoose.Types.ObjectId[]).push(task._id);


            // Save the task and update the student
            await task.save();
            await student.save();

            res.json({ success: true, message: 'Task assigned successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
};

// Student Controller
export const studentController = {

    viewTasks: async (req: IRequest, res: Response) => {
        try {
            const student = await User.findById(new mongoose.Types.ObjectId(req.user.id)).populate("tasks");
            return res.json({ success: true, taskStatus: student?.tasks });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    completeTask: async (req: IRequest, res: Response) => {
        try {
            const { taskId } = req.params;

          
            await Task.findByIdAndUpdate(taskId, { status: 'completed' });

            res.json({ success: true, message: 'Task marked as completed' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
};





