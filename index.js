import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import {corsOptions} from "./config/cors.js"
import userRoutes from "./routes/userRoute.js";
import adminRoutes from "./routes/adminRoute.js";
dotenv.config();

const app = express();

app.use(cors(corsOptions))
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// database connection
connectDB()


app.use("/admin",adminRoutes)
app.use("/user", userRoutes)




    // server running on corresponding port
app.listen(process.env.PORT,()=>console.log(`server listening on ${process.env.PORT}`))