import mongoose from "mongoose";
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import { configDotenv } from "dotenv";
configDotenv()
const Userschema = new  mongoose.Schema({
    fullName:{
        firstname:{
            type:String,
            required:true,
            trim:true
        },
        lastname:{
            type:String,
            trim:true
        }
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    socketId:{
        type:String
    }
},{timestamps:true})



Userschema.pre('save',async function(next){
    const user =this
    if(!this.isModified('password')) return next()
    try {
        const salt=await bcrypt.genSalt(10)
        const hash=await bcrypt.hash(user.password,salt)
        user.password=hash
        return next()
    } catch (error) {
        throw error
    }
})

Userschema.methods.Comparepassword=async function(userPassword) {
    try {
        const isMatch=await bcrypt.compare(userPassword,this.password)
        return isMatch
    } catch (error) {
        throw error
    }
}
userSchema.methods.generateAccessToken=async function() {
  return await JWT.sign(
        {
            _id:this._id,
            fullName:this.fullName,
            email:this.email
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn:process.env.TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",Userschema)
