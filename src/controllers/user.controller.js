import { ApiError } from "../utils/ApiError.utils.js"
import {User} from "./../models/user.model.js"
import {Apiresponse} from "./../utils/ApiResponse.utils.js"
import { validationResult } from "express-validator"
const registerUser=async(req,res)=>{
    try {
        const error=validationResult(req)

        if(!error?.isEmpty()){
            throw new ApiError(400,"All fields are required")
        }
        const {firstname,lastname,email,password}=req.body;

        const user = await User.create({
            fullName:{
                firstname,
                lastname:lastname || ""
            },
            email,
            password
        })

        return res.status(201).json(
            new Apiresponse(201,user,"user created!")
        )
    } catch (error) {
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500,error?.message||"Internal server error")
        )
    }
}


export {registerUser}