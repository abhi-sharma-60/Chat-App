import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import { FaImage, FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { logout } from "../redux/userSlice";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const theme = useSelector((state) => state.user.theme);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._i);
      socketConnection.on("conversation", (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
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
    <div className={`w-full h-full grid grid-cols-[48px,1fr] ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-slate-100'} w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between`}>
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-slate-300'
              } rounded ${isActive && (theme === 'dark' ? 'bg-gray-700' : 'bg-slate-200')}`
            }
            title="Chat"
          >
            <IoChatbubbleEllipsesSharp size={20} />
          </NavLink>
          <div
            className={`w-12 h-12 flex justify-center items-center cursor-pointer ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-300'
            } rounded`}
            title="Add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          <ThemeToggle />
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title="Logout"
            className={`w-12 h-12 flex justify-center items-center cursor-pointer ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-slate-300'
            } rounded`}
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex justify-center items-center">
          <h2 className={`text-xl font-bold p-4 h-16 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
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
              <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>
                Explore users to start a conversation with.
              </p>
            </div>
          )}

          {allUser.map((conv) => (
            <NavLink
              to={"/" + conv?.userDetails?._id}
              key={conv?._id}
              className={`flex items-center gap-3 ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-slate-100'
              } p-2 m-1 rounded-md cursor-pointer`}
            >
              <div>
                <Avatar
                  imageUrl={conv?.userDetails?.profile_pic}
                  name={conv?.userDetails?.name}
                  width={55}
                  height={55}
                />
              </div>
              <div>
                <h3 className="text-ellipsis line-clamp-1 font-semibold text-base capitalize">
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