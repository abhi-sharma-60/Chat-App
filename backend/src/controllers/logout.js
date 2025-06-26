async function logout(request,response){
    try {
        const cookieOptions = {
            httpOnly : true,
            secure : true,
            sameSite: "None"
        }

        return response.clearCookie("token", cookieOptions).status(200).json({
            message : "session out",
            success : true
    })
    } catch (error) {
        console.log("error")
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

export default logout