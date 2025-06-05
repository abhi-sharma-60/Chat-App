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

  // 🛑 Prevent self-chat via route
  useEffect(() => {
    if (params.userId === user?._id) {
      navigate("/"); // redirect to homepage or another page
    }
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
      socketConnection.on("message", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    setMessage((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedText = message.text.trim();

    // 🛑 Prevent sending to self
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

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FiArrowLeft size={25} />
          </Link>
          <div className="mt-2">
            <Avatar
              height={50}
              width={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser?.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-500">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiOutlineDotsVertical />
          </button>
        </div>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-30">
        <div
          className="flex flex-col gap-2 py-2 ml-3 mr-7"
          ref={currentMessage}
        >
          {allMessage.map((msg, index) => (
            <div
              key={index}
              className={`bg-white p-1 py-2 rounded-md w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                user._id === msg.msgByUserId ? "ml-auto" : ""
              }`}
              style={
                user._id === msg.msgByUserId
                  ? { backgroundColor: "#d9fdd2" }
                  : {}
              }
            >
              <div className="w-full">
                {msg?.imageUrl && (
                  <img
                    src={msg?.imageUrl}
                    className="w-full h-full object-scale-down"
                  />
                )}
                {msg?.videoUrl && (
                  <video
                    src={msg?.videoUrl}
                    className="w-full h-full object-scale-down"
                    controls
                  />
                )}
              </div>
              <p className="px-2">{msg.text}</p>
              <p className="text-xs ml-auto w-fit">
                {moment(msg.createdAt).format("hh:mm")}
              </p>
            </div>
          ))}
        </div>

        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex items-center justify-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-500"
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex items-center justify-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-500"
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
            <Loading size={50} />
          </div>
        )}
      </section>

      <section className="h-16 bg-slate-300 flex items-center px-2">
        <div className="relative">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white transition-all duration-200 ease-in-out hover:scale-105"
          >
            <IoMdAdd size={25} />
          </button>

          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center gap-3 p-2 px-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center gap-3 p-2 px-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
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
            className="py-1 px-4 outline-none w-full h-full rounded-full"
            placeholder="type your message"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="flex justify-center items-center w-11 h-11 rounded-full text-primary hover:bg-secondary hover:text-white transition-all duration-200 ease-in-out hover:scale-105">
            <MdSend size={30} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
