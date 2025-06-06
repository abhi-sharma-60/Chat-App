import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className="flex flex-col gap-2 rounded-xl border p-4 shadow-sm bg-white dark:bg-[#1e1e1e] dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* Header Row */}
      <div className="flex items-center gap-4">
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          imageUrl={user?.profile_pic}
          userId={user?._id}
        />
        <div>
          <h2 className="font-semibold text-lg text-slate-800 dark:text-white">
            {user?.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Skills */}
      {user?.skills?.length > 0 && (
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Skills:
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {user.skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info List */}
      <ul className="text-sm mt-2 space-y-2 text-slate-600 dark:text-slate-400">
        {user?.college_name && (
          <li>
            🎓 <span className="font-medium">{user.college_name}</span> •{" "}
            {user?.branch}
          </li>
        )}
        {user?.current_year && (
          <li>
            📅 Current Year:{" "}
            <span className="font-medium">{user.current_year}</span>
          </li>
        )}
        {user?.experience && (
          <li>
            🧭 Experience:{" "}
            <span className="font-medium">{user.experience}</span>
          </li>
        )}
      </ul>
    </Link>
  );
};

export default UserSearchCard;
