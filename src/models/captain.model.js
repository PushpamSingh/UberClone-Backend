import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv()
const captainSchema= new mongoose.Schema({
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
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String
    },
    isAvailable:{
        type:Boolean,
        default:false
    },
    vehicle:{
        color:{
            type:String,
            required:true
        },
        plate:{
            type:String,
            required:true
        },
        capicity:{
            type:Number,
            required:true
        },
        vehicleType:{
            type:String,
            enum:['car','motorcycle','auto'],
            required:true
        }
    },
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:String,
        }
    }
},{timestamps:true})

captainSchema.pre('save',async function(next){
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

captainSchema.methods.Comparepassword=async function(captainPassword) {
    try {
        const isMatch=await bcrypt.compare(captainPassword,this.password)
        return isMatch
    } catch (error) {
        throw error
    }
}
captainSchema.methods.generateToken=async function() {
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

export const Captain=mongoose.model('Captain',captainSchema)