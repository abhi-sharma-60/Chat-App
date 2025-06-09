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

const Sidebar = () => {
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
      socketConnection.emit("sidebar", user?._id); // ✅ fixed typo

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
        console.log("alluser")
        console.log(formattedUsers)
      });

      return () => {
        socketConnection.off("conversation");
      };
    }
  }, [socketConnection, user?._id]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div
      className={`w-full h-full grid grid-cols-[48px,1fr] overflow-hidden   dark:shadow-white  shadow ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white"
      }`}
    >
      {/* Left Icon Bar */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-slate-100"
        } w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between`}
      >
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-slate-300"
              } rounded ${
                isActive && (theme === "dark" ? "bg-gray-700" : "bg-slate-200")
              }`
            }
            title="Chat"
          >
            <IoChatbubbleEllipsesSharp size={20} />
          </NavLink>

          <div
            className={`w-12 h-12 flex justify-center items-center cursor-pointer mt-3 ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-slate-300"
            } rounded`}
            title="Add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </div>


            {/**skills */}
            <NavLink
            to="/skills"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-slate-300"
              } rounded ${
                isActive && (theme === "dark" ? "bg-gray-700" : "bg-slate-200")
              }`
            }
            title="Skills"
          >
            <SlSettings size={20} />
          </NavLink>


        </div>

        {/* Bottom actions */}
        <div className="flex flex-col justify-center items-center gap-2">
          <ThemeToggle />
          <button
            className="mt-3 mb-2"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
              className="mt-2"
            />
          </button>
          <button
            title="Logout"
            className={`w-12 h-12 flex justify-center items-center cursor-pointer ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-slate-300"
            } rounded`}
            onClick={handleLogout}
          >
            <BiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* User List */}
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

        <div className="h-[calc(100vh-65px)] overflow-y-auto scrollbar">
          {allUser.length === 0 ? (
            <div className="mt-12 text-center text-slate-400">
              <div className="flex justify-center items-center mb-4 text-slate-500">
                <GoArrowUpLeft size={50} />
              </div>
              <p>Explore users to start a conversation with.</p>
            </div>
          ) : (
            allUser.map((conv) => (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className={`flex items-center gap-3  ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-slate-100"
                } p-2 m-1 rounded-md cursor-pointer`}
              >
                <Avatar
                  imageUrl={conv?.userDetails?.profile_pic}
                  name={conv?.userDetails?.name}
                  width={55}
                  height={55}
                />
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold capitalize">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <div>
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-2">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-2">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="truncate break-all max-w-[110px]">
  {conv?.lastMsg?.text}
</p>


                  </div>
                </div>
                {conv?.unseenMsg > 0 && (conv?.userDetails?._id!==currentChatUserId) && (conv?.lastMsg?.seen!=true) && (
                  <span className="w-7 h-7 text-xs flex justify-center items-center ml-auto bg-primary text-white font-semibold rounded-full">
                    {conv?.unseenMsg > 99 ? "99+" : conv.unseenMsg}
                  </span>
                )}
              </NavLink>
            ))
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
