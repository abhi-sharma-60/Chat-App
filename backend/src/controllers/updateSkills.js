// controllers/updateSkills.js
import Skill from "../models/Skill.js";
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

    const user = await getUserDetailsFromToken(token);

    const { languages, roles, description, github } = req.body;

    // Find and update the skill by user ID
    const updatedSkill = await Skill.findOneAndUpdate(
      { user: user._id },
      {
        ...(languages && { languages }),
        ...(roles && { roles }),
        ...(description && { description }),
        ...(github && { github }),
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
