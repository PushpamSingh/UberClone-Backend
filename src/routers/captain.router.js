import express from "express"
import { createCaptain, getCaptain, loginCaptain, logoutCaptain } from "../controllers/captain.controller.js"
import { verifyCaptain } from "../middlewares/authuser.middleware.js"


const router = express.Router()

router.route("/create-captain").post(createCaptain)

router.route("/login-captain").post(loginCaptain)

router.route("/logout-captain").post(verifyCaptain,logoutCaptain)

router.route("/get-capatin").get(verifyCaptain,getCaptain)

export default router