import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
export const app=express()

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests without origin (Postman, mobile apps)
        if (!origin) return callback(null, true)

        // Return the requesting origin
        callback(null, origin)
    },
    credentials: true
}))
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true,limit:"10mb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routers/user.router.js"
app.use("/api/user",userRouter)