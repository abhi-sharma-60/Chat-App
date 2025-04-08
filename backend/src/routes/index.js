import express from "express"
import registerUser from "../controllers/registerUser.js"
import checkEmail from "../controllers/checkEmail.js"
import checkPassword from "../controllers/checkPassword.js"
import userDetails from "../controllers/userDetails.js"
import logout from "../controllers/logout.js"
import updateUserDetails from "../controllers/updateUserDetails.js"
import searchUser from "../controllers/searchUser.js"

const router = express.Router()

router.post("/register",registerUser)
router.post("/email",checkEmail)
router.post("/password",checkPassword)
router.get("/user-details",userDetails)
router.get("/logout",logout)
router.post("/update-user",updateUserDetails)
router.post("/search-user",searchUser)


export default router