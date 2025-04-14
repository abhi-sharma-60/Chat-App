import {UserModel} from "../models/usermodel.js";


async function checkPassword(request,response){
    try {
        const { password, userId } = request.body

       const user = await UserModel.findById(userId).select("+password");

       if (!user) {
         return response.status(404).json({
           message: "User not found",
           error: true,
         });
       }

       const validPassword = await user.isPasswordCorrect(password);

        if(!validPassword){
            return response.status(400).json({
                message : "Please check password",
                error : true
            })
        }

        const token = await user.generateAccessToken()

        const cookieOptions = {
            httpOnly : true,
            secure : true
        }

        return response.cookie('token',token,cookieOptions).status(200).json({
            message : "Login successfully",
            token : token,
            success :true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

export default checkPassword;
