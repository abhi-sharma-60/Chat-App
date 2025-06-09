import express from "express"
import registerUser from "../controllers/registerUser.js"
import checkEmail from "../controllers/checkEmail.js"
import checkPassword from "../controllers/checkPassword.js"
import userDetails from "../controllers/userDetails.js"
import logout from "../controllers/logout.js"
import updateUserDetails from "../controllers/updateUserDetails.js"
import searchUser from "../controllers/searchUser.js"
import updateSkills from "../controllers/updateSkills.js"
import { getMessages } from "../controllers/getMessages.js"
import getSkills from "../controllers/getSkills.js"

const router = express.Router()

router.post("/register",registerUser)
router.post("/email",checkEmail)
router.post("/password",checkPassword)
router.get("/user-details",userDetails)
router.get("/logout",logout)
router.post("/update-user",updateUserDetails)
router.post("/search-user",searchUser)
router.post("/update-skills",updateSkills)
router.get("/messages/:userId",getMessages)
router.get("/get-skills",getSkills)


export default router