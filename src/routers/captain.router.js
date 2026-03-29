import express from "express"
import { body } from "express-validator"
import { createCaptain, getCaptain, loginCaptain, logoutCaptain } from "../controllers/captain.controller.js"
import { verifyCaptain } from "../middlewares/authuser.middleware.js"


const router = express.Router()

router.route("/create-captain").post([
    body('fullName.firstname').isEmpty().withMessage('firstname is required!'),
    body('email').isEmail().withMessage('invalid email!'),
    body('password').isLength({ min: 6 }).withMessage('password must be at least 6 length'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('color must be at least 3 character'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('number plate must be at least 3 character'),
    body('vehicle.capicity').isLength({ min: 1 }).withMessage('capicity must be at least one'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('invalid vehicle type')
], createCaptain)

router.route("/login-captain").post([
    body('email').isEmail().withMessage('invalid email!'),
    body('password').isLength({ min: 6 }).withMessage('password must be at least 6 length')
],loginCaptain)

router.route("/logout-captain").post(verifyCaptain,logoutCaptain)

router.route("/get-capatin").get(verifyCaptain,getCaptain)

export default router