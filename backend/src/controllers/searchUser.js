import Skill from "../models/skillmodel.js";
import { UserModel } from "../models/usermodel.js";

async function searchUser(request, response) {
  try {
    const {
      name,
      email,
      rating,
      languages,
      roles,
      tools,
      college,
      branch
    } = request.body;

    const orFilters = [];

    // 🔍 Name or Email match (case-insensitive)
    if (name || email) {
      const regex = new RegExp(name || email, "i");
      orFilters.push({
        $or: [{ "user.name": regex }, { "user.email": regex }]
      });
    }

    // ⭐ Rating (skill.rating[0] = average rating)
    if (rating !== undefined) {
      orFilters.push({ "rating.0": { $gte: rating } });
    }

    // 💻 Languages (array inside Skill, case-insensitive match)
    if (languages && languages.length > 0) {
      languages.forEach(lang => {
        orFilters.push({
          languages: { $elemMatch: { $regex: new RegExp(`^${lang}$`, "i") } }
        });
      });
    }

    // 🧑‍💻 Roles (array inside Skill, case-insensitive match)
    if (roles && roles.length > 0) {
      roles.forEach(role => {
        orFilters.push({
          roles: { $elemMatch: { $regex: new RegExp(`^${role}$`, "i") } }
        });
      });
    }

    // 🛠️ Tools (case-insensitive inclusion)
    if (tools) {
      const toolsArray = tools.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      if (toolsArray.length > 0) {
        orFilters.push({ tools: { $in: toolsArray } });
      }
    }

    // 🎓 College filter (User)
    if (college) {
      orFilters.push({ "user.college": new RegExp(college, "i") });
    }

    // 🏫 Branch filter (User)
    if (branch) {
      orFilters.push({ "user.branch": new RegExp(branch, "i") });
    }

    // 🔍 Final match condition
    const matchStage = orFilters.length > 0 ? { $or: orFilters } : {};

    // 🧠 Aggregate query: join Skills with Users
    const users = await Skill.aggregate([
      {
        $lookup: {
          from: "users", // collection name in MongoDB (lowercase and plural)
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $match: matchStage
      },
      {
        $project: {
          "user.password": 0 // exclude password
        }
      }
    ]);
    console.log(users)
    return response.json({
      message: "Matching users fetched",
      data: users,
      success: true
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true
    });
  }
}

export default searchUser;
