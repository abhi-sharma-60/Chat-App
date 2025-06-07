// controllers/updateSkills.js
import Skill from "../models/skillmodel.js";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";

const updateSkills = async (req, res) => {
  try {
    const token = req.cookies.token || "";

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not logged in",
      });
    }
    console.log(token)

    const { languages, roles, description, github, tools } = req.body;


    const userData = await getUserDetailsFromToken(token);
    const exist = await Skill.findOne({user: userData})
    console.log(userData)
    console.log(exist)
    const userId = userData._id

    if(!exist){
      const skills = new Skill({ languages, roles, description, github, user : userId, tools})
      await skills.save()


      return res.status(200).json({
        success: true,
        message: "Skills registered successfully",
        data: skills,
      });
    }
    
    // Find and update the skill by user ID
    const updatedSkill = await Skill.findOneAndUpdate(
      { user: userId },
      {
        ...(languages && { languages }),
        ...(roles && { roles }),
        ...(description && { description }),
        ...(github && { github }),
        ...(tools && {tools})
      },
      { new: true, runValidators: true, upsert:true }
    );

    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skills updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    console.error("Error updating skills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update skills",
      error: error.message,
    });
  }
};

export default updateSkills;
