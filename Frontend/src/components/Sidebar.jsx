import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus, FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { GoArrowUpLeft } from "react-icons/go";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Avatar from "./Avatar";
import Divider from "./Divider";
import EditUserDetails from "./EditUserDetails";
import SearchUser from "./SearchUser";
import ThemeToggle from "./ThemeToggle";
import { logout } from "../redux/userSlice";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const theme = useSelector((state) => state.user.theme);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);
      socketConnection.on("conversation", (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div
      className={`w-full h-full grid grid-cols-[48px,1fr] ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white"
      }`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-slate-100"
        } w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between`}
      >
        <div>
          <NavLink
            to="/"
            title="Chat"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-slate-300"
              } rounded ${
                isActive
                  ? theme === "dark"
                    ? "bg-gray-700"
                    : "bg-slate-200"
                  : ""
              }`
            }
          >
            <IoChatbubbleEllipsesSharp size={20} />
          </NavLink>
          <button
            className={`w-12 h-12 flex justify-center items-center rounded-xl transition mt-3 cursor-pointer ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-slate-200"
            }`}
            title="Add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </button>
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <ThemeToggle />
          <button
            className="mx-auto cursor-pointer"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              imageUrl={user?.profile_pic}
              {...user}
            />
          </button>
          <button
            title="Logout"
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition cursor-pointer ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-slate-200"
            }`}
            onClick={handleLogout}
          >
            <BiLogOut size={20} />
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex justify-center items-center">
          <h2
            className={`text-xl font-bold p-4 h-16 ${
              theme === "dark" ? "text-white" : "text-slate-800"
            }`}
          >
            Messages
          </h2>
        </div>

        <Divider />

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <GoArrowUpLeft size={50} />
              </div>
              <p
                className={`text-lg text-center ${
                  theme === "dark" ? "text-gray-400" : "text-slate-400"
                }`}
              >
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          {allUser.map((conv) => (
            <NavLink
              to={"/" + conv?.userDetails?._id}
              key={conv?._id}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 m-1 rounded-md cursor-pointer ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-slate-100"
                } ${
                  isActive
                    ? theme === "dark"
                      ? "bg-gray-700"
                      : "bg-slate-200"
                    : ""
                }`
              }
            >
              <div>
                <Avatar
                  imageUrl={conv?.userDetails?.profile_pic}
                  name={conv?.userDetails?.name}
                  width={55}
                  height={55}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-ellipsis line-clamp-1 font-semibold text-base capitalize">
                  {conv?.userDetails?.name}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <div className="flex items-center gap-2">
                    {conv?.lastMsg?.imageUrl && (
                      <>
                        <FaImage />
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <>
                        <FaVideo />
                        {!conv?.lastMsg?.text && <span>Video</span>}
                      </>
                    )}
                  </div>
                  <p className="text-ellipsis line-clamp-1">
                    {conv?.lastMsg?.text}
                  </p>
                </div>
              </div>
              {conv?.unseenMsg > 0 && (
                <p className="w-7 h-7 text-xs flex justify-center items-center ml-auto bg-primary text-white font-semibold rounded-full">
                  {conv?.unseenMsg > 99 ? "99+" : conv.unseenMsg}
                </p>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
