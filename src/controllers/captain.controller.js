import { ApiError } from "../utils/ApiError.utils.js";
import { Apiresponse } from "../utils/ApiResponse.utils.js";
import { Captain } from "../models/captain.model.js";
import { validationResult } from "express-validator";
import { BlackListedToken } from "../models/blacklistedtoken.model.js";


const createCaptain = async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error?.isEmpty()) {
            throw new ApiError(400, "All fields are required!")
        }

        const { firstname, lastname, email, password, vehicle, location } = req.body

        const existCaptain = await Captain.findOne({ email })
        if (existCaptain) {
            throw new ApiError(400, "captain already exist!")
        }

        const captain = await Captain.create({
            fullName: {
                firstname, lastname
            },
            email,
            password,
            vehicle,
            location
        })

        return res.status(201).json(
            new Apiresponse(201, captain, "captain created successfuly!")
        )
    } catch (error) {
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500, error?.message || "Internal server error")
        )
    }
}

const loginCaptain = async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error?.isEmpty()) {
            throw new ApiError(400, "All fields are required!")
        }

        const { email, password } = req.body

        const captain = await Captain.findOne({ email })

        if (!captain) {
            throw new ApiError(401, "Invalid email or password!")
        }

        const isPasswordmatch = await captain.Comparepassword(password)

        if (!isPasswordmatch) {
            throw new ApiError(401, "Invalid email or password!")
        }

        const token = await captain.generateToken()

        const option = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        }

        res.cookie("token", token, option)

        return res.status(200).json(
            new Apiresponse(200, captain, "captain logged in successfuly")
        )
    } catch (error) {
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500, error?.message || "Internal server error")
        )
    }
}

const logoutCaptain = async (req, res) => {
    try {
        const captain = req.captain

        if (!captain) {
            throw new ApiError(401, "Unauthorize!")
        }
        const token = req?.cookies?.token || req?.headers?.authorization?.replace("Bearer ", "")

        await BlackListedToken.create({ token })

        const option = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        }


        res.clearCookie("token", option)

        return res.status(200).json(
            new Apiresponse(200, null, "captain logged out!")
        )
    } catch (error) {
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500, error?.message || "Internal server error")
        )
    }
}

const getCaptain = async (req, res) => {
    try {
        const captainId = req.captain?._id
        if (!captain) {
            throw new ApiError(401, "Unauthorize!")
        }
        const captain=await Captain.findById(captainId)

        return res.status(200).json(
            new Apiresponse(200, captain,"captain fetched!")
        )
    } catch (error) {
        return res.status(error?.statuscode || 500).json(
            new ApiError(error?.statuscode || 500, error?.message || "Internal server error")
        )
    }
}
export { createCaptain, loginCaptain, logoutCaptain,getCaptain }