import express from "express"
import { body } from "express-validator"
import {authUser, loginUser, registerUser} from "./../controllers/user.controller.js"
import { verifyAuthuser } from "../middlewares/authuser.middleware.js"
const router = express.Router()

router.route("/register").post([
    body('fullName.firstname').isEmpty().withMessage('firstname is required!'),
    body('email').isEmail().withMessage('invalid email!'),
    body('password').isLength({min:6}).withMessage('password must be at least 6 length')
],registerUser)

router.route("/login").post([
   body('email').isEmail().withMessage('invalid email!'),
   body('password').isLength({min:6}).withMessage('password must be at least 6 length')
],loginUser)

router.route("/get-me").get(verifyAuthuser,authUser)

export default router