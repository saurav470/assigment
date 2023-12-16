"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const student_1 = __importDefault(require("./routes/student"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 8001;
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
//database connect
(0, database_1.connect)();
app.get("/health", (req, res) => {
    return res.status(200).json({ health: "server is healthy" });
});
app.use("/api/v1/admin", admin_1.default);
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/student", student_1.default);
app.listen(PORT, () => {
    console.log(`server is up and running on port ${PORT}`);
});
