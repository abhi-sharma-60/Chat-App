import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js"
import { UserModel } from "../models/usermodel.js"

async function updateUserDetails(request,response){
    try {
        const token = request.cookies.token || ""

        if(token==null || token==""){
            return response.json({
                message : "user not logged in",
                success : false
            })
        }

        const user = await getUserDetailsFromToken(token)

        const { name, profile_pic } = request.body

        const updateUser = await UserModel.updateOne({ _id : user._id },{
            name,
            profile_pic
        })

        const userInformation = await UserModel.findById(user._id)

        return response.json({
            message : "user update successfully",
            data : userInformation,
            success : true
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

export default updateUserDetails