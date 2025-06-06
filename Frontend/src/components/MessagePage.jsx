import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiArrowLeft } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import uploadFile from "../../helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import backgroundImage from "../assets/wallpaper.png";
import { MdSend } from "react-icons/md";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.user.theme);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef();

  useEffect(() => {
    if (params.userId === user?._id) navigate("/");
  }, [params.userId, user?._id, navigate]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setMessage((prev) => ({ ...prev, imageUrl: uploadPhoto.url }));
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);
    setMessage((prev) => ({ ...prev, videoUrl: uploadVideo.url }));
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: "" }));
  };

  useEffect(() => {
    if (socketConnection && params?.userId !== user?._id) {
      socketConnection.emit("message-page", params?.userId);
      socketConnection.emit("seen", params?.userId);
      socketConnection.on("message-user", (data) => setDataUser(data));
      socketConnection.on("message", (data) => setAllMessage(data));
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    setMessage((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedText = message.text.trim();
    if (user?._id === params?.userId) return;

    if (!trimmedText && !message.imageUrl && !message.videoUrl) {
      setMessage({ text: "", imageUrl: "", videoUrl: "" });
      return;
    }

    if (socketConnection) {
      socketConnection.emit("new message", {
        sender: user?._id,
        receiver: params.userId,
        text: trimmedText,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
        msgByUserId: user?._id,
      });
      setMessage({ text: "", imageUrl: "", videoUrl: "" });
    }
  };

  const groupedMessages = allMessage.reduce((groups, msg) => {
    const date = moment(msg.createdAt).format("YYYY-MM-DD");
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className={`bg-no-repeat bg-cover ${
        theme === "dark" ? "bg-gray-900 text-white" : ""
      }`}
    >
      <header
        className={`sticky top-0 h-16 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } flex justify-between items-center px-4 shadow-md`}
      >
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FiArrowLeft
              size={25}
              className={theme === "dark" ? "text-white" : ""}
            />
          </Link>
          <Avatar
            height={50}
            width={50}
            imageUrl={dataUser?.profile_pic}
            name={dataUser?.name}
            userId={dataUser._id}
          />
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser?.online ? (
                <span className="text-green-500">online</span>
              ) : (
                <span className="text-gray-500">offline</span>
              )}
            </p>
          </div>
        </div>
        <button
          className={`cursor-pointer hover:text-primary ${
            theme === "dark" ? "text-white" : ""
          }`}
        >
          <HiOutlineDotsVertical />
        </button>
      </header>

      <section
        className={`h-[calc(100vh-128px)] overflow-y-scroll scrollbar relative ${
          theme === "dark"
            ? "bg-gray-800 bg-opacity-90"
            : "bg-slate-200 bg-opacity-30"
        }`}
      >
        <div
          className="flex flex-col gap-2 py-2 ml-3 mr-7"
          ref={currentMessage}
        >
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {moment(date).calendar(null, {
                    sameDay: "[Today]",
                    lastDay: "[Yesterday]",
                    lastWeek: "dddd",
                    sameElse: "MMMM D, YYYY",
                  })}
                </span>
              </div>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg w-fit max-w-[280px] md:max-w-sm lg:max-w-md my-2 ${
                    user._id === msg.msgByUserId
                      ? "ml-auto bg-primary text-white"
                      : theme === "dark"
                      ? "bg-gray-700"
                      : "bg-white"
                  }`}
                >
                  <div className="w-full">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-full h-auto max-h-64 object-scale-down rounded-lg mb-2"
                        alt="Shared image"
                      />
                    )}
                    {msg?.videoUrl && (
                      <video
                        src={msg?.videoUrl}
                        className="w-full h-auto max-h-64 object-scale-down rounded-lg mb-2"
                        controls
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <p className="break-words px-2">{msg.text}</p>
                    <p className="text-xs ml-auto mt-1 opacity-75">
                      {moment(msg.createdAt).format("HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {message.imageUrl && (
          <div className="w-full sticky bottom-0 bg-black/50 flex items-center justify-center">
            <div
              className="absolute top-0 right-0 p-2 cursor-pointer hover:text-red-500"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} className="text-white" />
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-3 rounded-lg`}
            >
              <img
                src={message.imageUrl}
                alt="upload"
                className="aspect-square w-full max-w-sm object-scale-down"
              />
            </div>
          </div>
        )}

        {message.videoUrl && (
          <div className="w-full sticky bottom-0 bg-black/50 flex items-center justify-center">
            <div
              className="absolute top-0 right-0 p-2 cursor-pointer hover:text-red-500"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} className="text-white" />
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-3 rounded-lg`}
            >
              <video
                src={message.videoUrl}
                className="aspect-square w-full max-w-sm object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full sticky bottom-0 flex justify-center items-center">
            <Loading size={50} />
          </div>
        )}
      </section>

      <section
        className={`h-16 ${
          theme === "dark" ? "bg-gray-800" : "bg-slate-300"
        } flex items-center px-2`}
      >
        <div className="relative">
          <button
            onClick={handleUploadImageVideoOpen}
            className={`flex justify-center items-center w-11 h-11 rounded-full ${
              theme === "dark"
                ? "hover:bg-gray-700 text-white"
                : "hover:bg-primary hover:text-white"
            } transition-all duration-200 ease-in-out hover:scale-105`}
          >
            <IoMdAdd size={25} />
          </button>

          {openImageVideoUpload && (
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg rounded-lg absolute bottom-14 w-36 p-2`}
            >
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center gap-3 p-2 hover:bg-opacity-10 hover:bg-white cursor-pointer rounded"
                >
                  <FaImage size={18} className="text-primary" />
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center gap-3 p-2 hover:bg-opacity-10 hover:bg-white cursor-pointer rounded"
                >
                  <FaVideo size={18} className="text-purple-500" />
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                  accept="image/*"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                  accept="video/*"
                />
              </form>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="h-3/5 w-full px-2 flex gap-2"
        >
          <input
            type="text"
            className={`py-1 px-4 outline-none w-full h-full rounded-full ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-white"
            }`}
            placeholder="Type your message..."
            value={message.text}
            onChange={handleOnChange}
          />
          <button
            className={`flex justify-center items-center w-11 h-11 rounded-full ${
              theme === "dark"
                ? "text-primary hover:bg-gray-700"
                : "text-primary hover:bg-secondary hover:text-white"
            } transition-all duration-200 ease-in-out hover:scale-105`}
          >
            <MdSend size={30} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
