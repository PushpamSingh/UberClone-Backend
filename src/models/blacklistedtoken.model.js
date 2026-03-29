import mongoose from "mongoose";


const blacklistedtokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:7*24*60*60 //? TTL for 7d token expiry
    }
})

export const BlackListedToken=mongoose.model('BlackListedToken',blacklistedtokenSchema)