import mongoose from "mongoose"
import { configDotenv } from "dotenv"
configDotenv()

export const connectDb=async()=>{
    try {
        const Dbinstance=await mongoose.connect(`${process.env.MONGOOSE_URL}`)
        console.log("db connection on host ",Dbinstance.connection.host);
        
    } catch (error) {
        throw new Error(error?.message)
    }
}