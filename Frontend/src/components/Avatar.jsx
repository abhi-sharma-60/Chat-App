import React from "react";
import { LuCircleUserRound } from "react-icons/lu";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avatarName = "";
  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
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
  console.log("Online users:", onlineUser);
  console.log("Current userId:", userId);
  console.log("Is online?", onlineUser.includes(userId));

  return (
    <div
      style={{ width: width + "px", height: height + "px" }}
      className={`text-slate-800 rounded-full font-bold relative`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden rounded-full "
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={`overflow-hidden rounded-full flex justify-center items-center text-4xl ${bgColor[idx]}  `}
        >
          {avatarName}
        </div>
      ) : (
        <LuCircleUserRound size={width} />
      )}

      {isOnline && (
        <div className="bg-green-500 w-3 h-3 rounded-full absolute bottom-0 right-0 z-10 border-2 border-white"></div>
      )}
    </div>
  );
};

export default Avatar;
