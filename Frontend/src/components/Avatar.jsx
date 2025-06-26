import React from "react";
import { LuCircleUserRound } from "react-icons/lu";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, width = 40, height = 40 }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avatarName = "";
  if (name) {
    const splitName = name?.split(" ");
    avatarName =
      splitName.length > 1
        ? splitName[0][0] + splitName[1][0]
        : splitName[0][0];
  }

  const bgColor = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
    "bg-gradient-to-br from-orange-400 to-orange-600",
    "bg-gradient-to-br from-lime-400 to-lime-600",
    "bg-gradient-to-br from-rose-400 to-rose-600",
    "bg-gradient-to-br from-cyan-400 to-cyan-600",
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-violet-400 to-violet-600",
  ];
  const idx = Math.floor(Math.random() * bgColor.length);
  const isOnline = onlineUser.includes(userId);

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className="relative rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300"
        />
      ) : name ? (
        <div
          className={`flex items-center justify-center text-white font-bold text-xl ${bgColor[idx]} w-full h-full aspect-square rounded-full shadow-inner`}
        >
          {avatarName}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-300 to-gray-500 w-full h-full rounded-full flex items-center justify-center">
          <LuCircleUserRound size={width * 0.6} className="text-white" />
        </div>
      )}

      {isOnline && (
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full z-10 pulse-online shadow-lg"></span>
      )}
    </div>
  );
};

export default Avatar;