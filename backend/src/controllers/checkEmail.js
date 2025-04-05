import { UserModel } from "../models/usermodel.js"

async function checkEmail(request,response){
    try {
        const { email } = request.body

        const checkEmail = await UserModel.findOne({email})

        if(!checkEmail){
            return response.status(400).json({
                message : "User does not exist",
                error : true
            })
        }

        return response.status(200).json({
            message : "Email Verified",
            success : true,
            data : checkEmail
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

export default checkEmail