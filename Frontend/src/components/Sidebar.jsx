import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus, FaImage, FaVideo } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import { logout } from "../redux/userSlice";
import ThemeToggle from "./ThemeToggle";
import { SlSettings } from "react-icons/sl";
import { useParams } from "react-router-dom";

const Sidebar = (refreshKey) => {
  const { userId: currentChatUserId } = useParams();

  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.user.theme);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection && user?._id) {
      socketConnection.emit("sidebar", user?._id);

      socketConnection.on("conversation", (data) => {
        const formattedUsers = data.map((conversationUser) => {
          const { sender, receiver } = conversationUser;
          const userDetails =
            sender._id === receiver._id
              ? sender
              : receiver._id !== user._id
              ? receiver
              : sender;

          return {
            ...conversationUser,
            userDetails,
          };
        });
        setAllUser(formattedUsers);
      });

      return () => {
        socketConnection.off("conversation");
      };
    }
  }, [socketConnection, user?._id, refreshKey]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div
      className={`w-full h-full grid grid-cols-[64px,1fr] overflow-hidden shadow-2xl ${
        theme === "dark" 
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white" 
          : "bg-gradient-to-b from-white to-gray-50"
      }`}
    >
      {/* Left Icon Bar */}
      <div
        className={`${
          theme === "dark" 
            ? "bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700" 
            : "bg-gradient-to-b from-gray-100 to-gray-200 border-r border-gray-300"
        } w-16 h-full py-6 flex flex-col justify-between items-center shadow-lg`}
      >
        <div className="flex flex-col items-center space-y-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer rounded-xl transition-all duration-300 hover-lift ${
                theme === "dark" 
                  ? "hover:bg-gray-700 hover:shadow-lg" 
                  : "hover:bg-white hover:shadow-md"
              } ${
                isActive 
                  ? theme === "dark" 
                    ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg" 
                    : "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg"
                  : ""
              }`
            }
            title="Chat"
          >
            <IoChatbubbleEllipsesSharp size={22} />
          </NavLink>

          <div
            className={`w-12 h-12 flex justify-center items-center cursor-pointer rounded-xl transition-all duration-300 hover-lift ${
              theme === "dark" 
                ? "hover:bg-gray-700 hover:shadow-lg" 
                : "hover:bg-white hover:shadow-md"
            }`}
            title="Add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </div>

          <NavLink
            to="/skills"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer rounded-xl transition-all duration-300 hover-lift ${
                theme === "dark" 
                  ? "hover:bg-gray-700 hover:shadow-lg" 
                  : "hover:bg-white hover:shadow-md"
              } ${
                isActive 
                  ? theme === "dark" 
                    ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg" 
                    : "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg"
                  : ""
              }`
            }
            title="Skills"
          >
            <SlSettings size={20} />
          </NavLink>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col items-center space-y-4">
          <ThemeToggle />
          <button
            className="hover-lift rounded-full"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={44}
              height={44}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title="Logout"
            className={`w-12 h-12 flex justify-center items-center cursor-pointer rounded-xl transition-all duration-300 hover-lift ${
              theme === "dark" 
                ? "hover:bg-red-600 hover:text-white" 
                : "hover:bg-red-500 hover:text-white"
            }`}
            onClick={handleLogout}
          >
            <BiLogOut size={22} />
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="w-full flex flex-col">
        <div className="h-20 flex justify-center items-center border-b border-gray-200 dark:border-gray-700">
          <h2
            className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}
          >
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto srollbar p-2">
          {allUser.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="flex justify-center items-center mb-6 text-gray-400">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                  <GoArrowUpLeft size={40} />
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                Start exploring users
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Find people to chat with
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {allUser.map((conv) => (
                <NavLink
                  to={"/" + conv?.userDetails?._id}
                  key={conv?._id}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover-lift card-hover ${
                      theme === "dark" 
                        ? isActive 
                          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30" 
                          : "hover:bg-gray-800/50"
                        : isActive 
                          ? "bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200" 
                          : "hover:bg-gray-50"
                    }`
                  }
                >
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={56}
                    height={56}
                    userId={conv?.userDetails?._id}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold capitalize truncate mb-1">
                      {conv?.userDetails?.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        {conv?.lastMsg?.imageUrl && (
                          <div className="flex items-center gap-1 text-blue-500">
                            <FaImage size={12} />
                            {!conv?.lastMsg?.text && <span>Image</span>}
                          </div>
                        )}
                        {conv?.lastMsg?.videoUrl && (
                          <div className="flex items-center gap-1 text-purple-500">
                            <FaVideo size={12} />
                            {!conv?.lastMsg?.text && <span>Video</span>}
                          </div>
                        )}
                      </div>
                      <p className="truncate max-w-[140px] font-medium">
                        {conv?.lastMsg?.text}
                      </p>
                    </div>
                  </div>
                  {conv?.unseenMsg > 0 && 
                   (conv?.userDetails?._id !== currentChatUserId) && 
                   (conv?.lastMsg?.seen !== true) && (
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg pulse-online">
                      {conv?.unseenMsg > 99 ? "99+" : conv.unseenMsg}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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