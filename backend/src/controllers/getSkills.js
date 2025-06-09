// controllers/skillController.js
import Skill from "../models/skillmodel.js";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";

const getSkills = async (request, res) => {
  try {
    // Extract user info (if needed for auth/logging)
    const token = request.cookies.token || ""
    

    if(request.params?.userId){
      const userId = request.params.userId
      const skillsData = await Skill.findOne({user: userId})
      console.log("hit")
      console.log(userId)
      if(!skillsData){
        return res.json({
          message: "Skill not found",
          success: false
          
        })
      }
console.log("hit")
      return res.status(200).json({
        success: true,
        data: skillsData,
      });
    }

    if(token==null || token==""){
        return res.json({
            message : "user not logged in",
            success : false
        })
    }

    const user = await getUserDetailsFromToken(token)
    if(user.logout){
      return {
          message: "User not found",
          success: false
        };
  }

    // Get all skills, populate associated user details (optional)
    const skills = await Skill.find({ user: user._id })
    //console.log(skills)

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve skills",
      error: error.message,
    });
  }
};

export default getSkills