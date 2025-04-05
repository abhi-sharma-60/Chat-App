import { UserModel } from "../models/usermodel.js"
import jwt from "jsonwebtoken"

const getUserDetailsFromToken = async(token)=>{
    
    if(!token){
        return {
            message : "session out",
            logout : true,
        }
    }

    const decode = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await UserModel.findById(decode._id).select('-password')

    return user
}

export default getUserDetailsFromToken