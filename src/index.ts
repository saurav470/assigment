import express, { Request, Response } from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import { connect } from './config/database'
import adminRoutes from './routes/admin'
import userRoutes from './routes/user'
import studentRoutes from './routes/student'


const app = express();

app.use(express.json());
dotenv.config()
const PORT = Number(process.env.PORT) || 8001;
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
)
//database connect
connect();

app.get("/", (req: Request, res: Response) => {



    return res.status(200).json({ health: "server is healthy" })
})

app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/student", studentRoutes)

app.listen(PORT, () => {
    console.log(`server is up and running on port ${PORT}`)
})



