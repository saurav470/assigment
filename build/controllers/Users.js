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
exports.studentController = exports.adminController = exports.user = void 0;
// Import Mongoose models
const User_1 = require("../models/User");
const Task_1 = require("../models/Task");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
//User controler
exports.user = {
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
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Invalid credentials' });
            }
            const user = yield User_1.User.findOne({ email });
            if (!user) {
                // Return 401 Unauthorized status code with error message
                return res.status(401).json({
                    success: false,
                    message: `User is not Registered with Us Please SignUp to Continue`,
                });
            }
            if (yield bcryptjs_1.default.compare(password, user.password)) {
                const token = jsonwebtoken_1.default.sign({ email: user.email, id: user._id, role: user.accountType }, process.env.JWT_SECRET, {
                    expiresIn: "24h",
                });
                if (user.accountType === 'Student') {
                    // Populate and return full student details
                    const StudentDetail = (yield user.populate("tasks")).toObject();
                    delete StudentDetail.password;
                    return res.json({ success: true, message: 'student login successful', token, tasks: StudentDetail.tasks, StudentDetail });
                }
                else {
                    return res.json({ success: true, message: 'Admin login successful', token });
                }
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: `Password is incorrect`,
                });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }),
};
// Admin Controller
exports.adminController = {
    addStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Name, email, password, accountType, department } = req.body;
            if (!email || !password || !Name || !accountType || !department) {
                return res.status(400).json({ success: false, message: 'all field required' });
            }
            // Check if the student with the same email already exists
            const existingStudent = yield User_1.User.findOne({ email });
            if (existingStudent) {
                return res.status(400).json({ success: false, message: 'Student with this email already exists' });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // Create a new student
            const student = new User_1.User({
                Name,
                email,
                password: hashedPassword,
                accountType,
                department,
            });
            // Save the student to the database
            yield student.save();
            res.json({ success: true, message: 'Student added successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }),
    assignTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { studentId, description, dueTime } = req.body;
            if (!studentId || !description || !dueTime) {
                return res.status(400).json({ success: false, message: 'all field required' });
            }
            // Check if the student exists
            const student = yield User_1.User.findById(new mongoose_1.default.Types.ObjectId(studentId));
            if (!student || student.accountType !== 'Student') {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }
            // Create a new task
            const task = new Task_1.Task({
                description,
                dueTime,
                status: 'pending',
            });
            // Add the task to the student's tasks array
            student.tasks.push(task._id);
            // Save the task and update the student
            yield task.save();
            yield student.save();
            res.json({ success: true, message: 'Task assigned successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }),
};
// Student Controller
exports.studentController = {
    viewTasks: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const student = yield User_1.User.findById(new mongoose_1.default.Types.ObjectId(req.user.id)).populate("tasks");
            return res.json({ success: true, taskStatus: student === null || student === void 0 ? void 0 : student.tasks });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }),
    completeTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { taskId } = req.params;
            yield Task_1.Task.findByIdAndUpdate(taskId, { status: 'completed' });
            res.json({ success: true, message: 'Task marked as completed' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }),
};
