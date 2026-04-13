import express from "express"
import {authUser, loginUser, logoutUser, registerUser} from "./../controllers/user.controller.js"
import { verifyAuthuser } from "../middlewares/authuser.middleware.js"
const router = express.Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyAuthuser,logoutUser)
router.route("/get-me").get(verifyAuthuser,authUser)

export default router