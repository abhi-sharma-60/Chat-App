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
    "bg-blue-200",
    "bg-indigo-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-orange-200",
    "bg-lime-200",
    "bg-rose-200",
    "bg-cyan-200",
    "bg-amber-200",
    "bg-violet-200",
  ];
  const idx = Math.floor(Math.random() * bgColor.length);
  const isOnline = onlineUser.includes(userId);

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className="relative rounded-full overflow-hidden"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : name ? (
        <div
          className={`flex items-center justify-center text-white font-semibold text-xl ${bgColor[idx]} w-full h-full aspect-square rounded-full`}
        >
          {avatarName}
        </div>
      ) : (
        <LuCircleUserRound size={width} className="text-gray-400" />
      )}

      {isOnline && (
        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-600 border-2 border-white rounded-full z-10"></span>
      )}
    </div>
  );
};

export default Avatar;
