// const express = require("express");

import express from "express"
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDB } from "./lib/db.js";
import cors from "cors"
import job from "./lib/cron.js"

const app = express();
const PORT = process.env.PORT || 3000

//middleware
job.start()
app.use(express.json({limit: '100mb'}))
app.use(cors())

//routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB();
})
