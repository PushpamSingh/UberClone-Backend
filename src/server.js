import {app} from "./app.js"
import dotenv from "dotenv"
dotenv.config()
import https from "https"
import {connectDb} from "./db/db.js"
const port = process.env.PORT

const server = https.createServer(app)
if(!port){
    throw new Error("port is rquired")
}
connectDb().then(()=>{
server.listen(port,()=>{
    console.log("server is running on port ",port);
})
}).catch((err)=>{
    console.log(err?.message);
})
