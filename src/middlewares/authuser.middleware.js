import { BlackListedToken } from "../models/blacklistedtoken.model.js"
import { Captain } from "../models/captain.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.utils.js"
import JWT from "jsonwebtoken"
export const verifyAuthuser = async (req, _, next) => {
    try {
        const token = req?.cookies?.token || req?.headers?.authorization?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(404, "token not found!")
        }
        const isBlacklisted = await BlackListedToken.findOne({ token })
        if (isBlacklisted) {
            throw new ApiError(401, "invalid token!")
        }
        const decode = await JWT.verify(token, process.env.TOKEN_SECRET)
        const user = await User.findOne({ _id: decode?._id })

        if (!user) {
            throw new ApiError(401, "Unauthorize User!")
        }

        req.user = user
        return next()
    } catch (error) {
        return next(error)
    }
}

export const verifyCaptain = async (req, res, next) => {
    try {
        const token = req?.cookies?.token || req?.headers?.authorization?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(404, "token not found!")
        }
        const isBlacklisted = await BlackListedToken.findOne({ token })
        if (isBlacklisted) {
            throw new ApiError(401, "invalid token!")
        }
        const decode = await JWT.verify(token, process.env.TOKEN_SECRET)

        const captain = await Captain.findOne({ _id: decode?._id, email: decode?.email })

        if (!captain) {
            throw new ApiError(401, "Unauthorize Captain!")
        }
        req.captain = captain
        return next()
    } catch (error) {
        return next(error)
    }
}