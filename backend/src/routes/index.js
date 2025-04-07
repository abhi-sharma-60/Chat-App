import express from "express"
import registerUser from "../controllers/registerUser.js"
import checkEmail from "../controllers/checkEmail.js"
import checkPassword from "../controllers/checkPassword.js"
import userDetails from "../controllers/userDetails.js"
import logout from "../controllers/logout.js"
import updateUserDetails from "../controllers/updateUserDetails.js"

const router = express.Router()

router.post("/register",registerUser)
router.post("/email",checkEmail)
router.post("/password",checkPassword)
router.get("/user-details",userDetails)
router.post("/logout",logout)
router.post("/update-user",updateUserDetails)

export default router