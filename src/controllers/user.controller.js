import { BlackListedToken } from "../models/blacklistedtoken.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import { User } from "./../models/user.model.js"
import { Apiresponse } from "./../utils/ApiResponse.utils.js"
import { validationResult } from "express-validator"
const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        if ([firstname, email, password].some((feild) => (feild === "" || feild === undefined))) {
            throw new ApiError(400, "All feilds are required")
        }
        const existUser = await User.findOne({ email })

        if (existUser) {
            throw new ApiError(400, "user already exist!")
        }

        const user = await User.create({
            fullName: {
                firstname,
                lastname: lastname || ""
            },
            email,
            password
        })

        return res.status(201).json(
            new Apiresponse(201, user, "user created!")
        )
    } catch (error) {
        console.log("Error  in register user:: ",error);
        
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500, error?.message || "Internal server error")
        )
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if ([email, password].some((feild) => (feild === "" || feild === undefined))) {
            throw new ApiError(400, "All feilds are required")
        }
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            throw new ApiError(401, "Invalid username or password")
        }

        const isPasswordmatch = await user.Comparepassword(password)

        if (!isPasswordmatch) {
            throw new ApiError(401, "Invalid username or password")
        }
        const token = await user.generateToken()
        const option = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: '/'
        }   
        res.cookie("token", token, option)
        
        return res.status(200).json(
            new Apiresponse(200, {user,token}, "user logged in!")
        )
    } catch (error) {
         console.log("Error  in login user:: ",error);
        
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500, error?.message || "Internal server error")
        )
    }
}

const authUser = async (req, res) => {
    try {
        const user = req.user

        if (!user) {
            throw new ApiError(401, "Unauthorize!")
        }

        return res.status(200).json(
            new Apiresponse(200, user, "user fetched!")
        )
    } catch (error) {
         console.log("Error  in get auth user:: ",error);
        
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500, error?.message || "Internal server error")
        )
    }
}

const logoutUser = async (req, res) => {
    try {
        const user = req.user

        if (!user) {
            throw new ApiError(401, "Unauthorized!")
        }
        const token = req?.cookies?.token || req?.headers?.authorization?.replace("Bearer ", "")

        await BlackListedToken.create({ token })

        const option = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: '/'
        }
        res.clearCookie("token", option)

        return res.status(200).json(
            new Apiresponse(200, null, "user logged out!")
        )

    } catch (error) {
         console.log("Error  in logout user:: ",error);
        
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500, error?.message || "Internal server error")
        )
    }
}
export { registerUser, loginUser, authUser, logoutUser }