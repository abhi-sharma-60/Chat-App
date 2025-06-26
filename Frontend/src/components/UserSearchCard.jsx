import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserSearchCard = ({ user, onClose }) => {
  const theme = useSelector((state) => state.user.theme);

  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className={`flex items-center gap-6 p-6 rounded-2xl shadow-lg border transition-all duration-300 hover-lift card-hover
        ${
          theme === "dark"
            ? "bg-gray-800/80 hover:bg-gray-700/80 border-gray-700 hover:border-purple-500 text-white"
            : "bg-white/90 hover:bg-purple-50/90 border-gray-200 hover:border-purple-300 text-gray-800"
        }
      `}
    >
      <Avatar
        width={64}
        height={64}
        name={user.name}
        userId={user?._id}
        imageUrl={user?.profile_pic}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xl truncate capitalize mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {user?.name}
        </h4>
        <div className="space-y-2">
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            } truncate flex items-center gap-2`}
          >
            <span className="text-purple-500">✉️</span>
            {user?.email}
          </p>
          {user?.college && (
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } truncate flex items-center gap-2`}
            >
              <span className="text-blue-500">🎓</span>
              {user.college}
            </p>
          )}
          {user?.branch && (
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } truncate flex items-center gap-2`}
            >
              <span className="text-green-500">🧭</span>
              {user.branch}
            </p>
          )}
          {user?.skills?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-orange-500">💡</span>
              <div className="flex flex-wrap gap-1">
                {user.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      theme === "dark"
                        ? "bg-purple-900/50 text-purple-300"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
                {user.skills.length > 3 && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    +{user.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
        <span className="text-lg">💬</span>
      </div>
    </Link>
  );
};

export default UserSearchCard;