import { UserModel } from "../models/usermodel.js";
import jwt from "jsonwebtoken";

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await UserModel.findById(decoded._id).select("-password");

    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }

    return user;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        message: "Session expired",
        logout: true,
      };
    }

    if (error.name === "JsonWebTokenError") {
      return {
        message: "Invalid token",
        logout: true,
      };
    }

    // Generic fallback for other unexpected errors
    return {
      message: "Authentication failed",
      logout: true,
    };
  }
};

export default getUserDetailsFromToken;
