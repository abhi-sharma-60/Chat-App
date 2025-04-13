import {UserModel} from "../models/usermodel.js"

async function registerUser(request,response){
    try {
        const { name, email , password, profile_pic, googleId } = request.body

        const checkEmail = await UserModel.findOne({ email })
       // const checkGoogleId = await UserModel.findOne({ googleId }) 

        if(checkEmail /*|| checkGoogleId*/){
            return response.status(400).json({
                message : "User already exists",
                error : true,
            })
        }

        const payload = {
            name,
            email,
            profile_pic,
            password,
            //googleId
        }

        const user = new UserModel(payload);
        await user.save();

        return response.status(201).json({
            message : "User created successfully",
            data : user,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

export default registerUser