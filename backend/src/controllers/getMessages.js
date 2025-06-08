import { ConversationModel } from "../models/chatmodel.js";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";

export const getMessages = async (req, res) => {
  try {
    // 🔐 Get current user from token
    const currentUser = await getUserDetailsFromToken(req.cookies.token);
    const userId = req.params.userId;
    console.log(req)

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 📩 Find conversation between current user and target user
    const conversation = await ConversationModel.findOne({
      $or: [
        { sender: currentUser._id, receiver: userId },
        { sender: userId, receiver: currentUser._id }
      ]
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      messages: conversation?.messages || []
    });

  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
