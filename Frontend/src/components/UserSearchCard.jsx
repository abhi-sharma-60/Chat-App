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
      className={`flex items-center gap-4 p-4 mb-2 rounded-xl shadow-sm border border-transparent transition
        ${
          theme === "dark"
            ? "bg-gray-800 hover:bg-gray-700 hover:border-purple-600 text-white"
            : "bg-white/80 hover:bg-purple-50 hover:border-purple-400 text-purple-800"
        }
      `}
    >
      <Avatar
        width={50}
        height={50}
        name={user.name}
        userId={user?._id}
        imageUrl={user?.profile_pic}
      />
      <div className="flex-1">
        <h4 className="font-semibold text-lg truncate capitalize">{user?.name}</h4>
        <p
          className={`${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          } truncate`}
        >
          {user?.email}
        </p>
        {user?.college && (
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } truncate`}
          >
            🎓 {user.college}
          </p>
        )}
        {user?.branch && (
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } truncate`}
          >
            🧭 {user.branch}
          </p>
        )}
        {user?.skills?.length > 0 && (
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } truncate`}
          >
            💡 {user.skills.join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
};

export default UserSearchCard;
