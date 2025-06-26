import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiArrowLeft } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdSend } from "react-icons/md";
import uploadFile from "../../helpers/uploadFile";
import Loading from "./Loading";
import moment from "moment";
import axios from "axios";

const languageOptions = [
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "kotlin", label: "Kotlin" },
  { value: "javascript", label: "JavaScript" },
  { value: "go", label: "Go Lang" },
  { value: "ruby", label: "Ruby" },
  { value: "r", label: "R" },
];

const roleOptions = [
  { value: "full stack", label: "Full Stack" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
];

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

  const [skill, setSkill] = useState({
    rating: 0,
    languages: [],
    roles: [],
    tools: "",
    github: "",
    description: "",
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentMessage = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/messages/${params.userId}`;
        const res = await axios.get(URL, {
          withCredentials: true
        });
        setAllMessage(res.data.messages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    const fetchSkills = async () => {
      try {
        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/get-profile-skills/${params.userId}`;
        const res = await axios.get(URL, {
          withCredentials: true,
        });

        if (!res.data.success || !res.data.data) {
          setSkill({
            rating: 0,
            languages: [],
            roles: [],
            tools: "",
            github: "",
            description: "",
          });
          return;
        }

        const fetched = res.data.data;

        setSkill({
          languages: (fetched.languages || []).map((lang) =>
            languageOptions.find((opt) => opt.value === lang)
          ).filter(Boolean),

          roles: (fetched.roles || []).map((role) =>
            roleOptions.find((opt) => opt.value === role)
          ).filter(Boolean),

          description: fetched.description || "",
          rating: fetched.rating[0] || "N/A",
          github: fetched.github || "",
          tools: (fetched.tools || []).join(", "),
        });
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };

    if (params?.userId) {
      fetchMessages();
      fetchSkills();
    }
  }, [params?.userId]);

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

  useEffect(() => {
    if (socketConnection && params?.userId !== user?._id) {
      socketConnection.emit("message-page", params?.userId);
      socketConnection.emit("seen", params?.userId);
      socketConnection.on("message-user", (data) => setDataUser(data));
      
      const messageHandler = (data) => {
        setAllMessage(data);
        socketConnection.emit("seen", params?.userId);
        socketConnection.emit("sidebar", user?._id);
      };

      const eventName = `message:${params?.userId}`;
      socketConnection.on(eventName, messageHandler);

      return () => {
        socketConnection.off(eventName, messageHandler);
      };
    }
  }, [socketConnection, params?.userId, user]);

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setMessage((prev) => ({ ...prev, imageUrl: uploadPhoto.url }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setLoading(false);
    setMessage((prev) => ({ ...prev, videoUrl: uploadVideo.url }));
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
        msgToUserId: params.userId,
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

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [params.userId]);

  return (
    <div
      className={`min-h-screen flex justify-center items-center p-4 transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      }`}
    >
      <div
        className={`relative flex flex-col w-full max-w-full h-[98vh] rounded-3xl shadow-2xl border backdrop-blur-xl overflow-hidden ${
          theme === "dark"
            ? "bg-gray-900/90 border-gray-700 text-white glass-effect-dark"
            : "bg-white/90 border-purple-200 text-black glass-effect"
        }`}
      >
        {/* Header */}
        <header className={`flex justify-between items-center px-6 py-4 border-b backdrop-blur-sm ${
          theme === "dark" 
            ? "border-gray-700 bg-gray-800/50" 
            : "border-purple-200 bg-white/50"
        }`}>
          <div className="flex items-center gap-4">
            <Link to="/" className="lg:hidden hover-lift">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <FiArrowLeft size={20} />
              </div>
            </Link>
            <Avatar
              height={52}
              width={52}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser._id}
            />
            <div>
              <h3 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {dataUser?.name}
              </h3>
              <p className="text-sm flex items-center gap-2">
                {dataUser?.online ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full pulse-online"></span>
                    <span className="text-green-500 font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="text-gray-400">Offline</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown((prev) => !prev)}
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover-lift"
            >
              <HiOutlineDotsVertical size={20} />
            </button>
            {showDropdown && (
              <div
                className={`absolute right-0 mt-2 w-48 z-50 shadow-xl rounded-xl border backdrop-blur-sm ${
                  theme === "dark" 
                    ? "bg-gray-800/90 border-gray-600" 
                    : "bg-white/90 border-gray-200"
                }`}
              >
                <button
                  onClick={() => {
                    setShowUserDetails(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-purple-100 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium"
                >
                  View Profile
                </button>
              </div>
            )}
          </div>
        </header>

        {/* User Detail Side Panel */}
        {showUserDetails && (
          <div
            className={`absolute top-0 right-0 h-full w-80 z-50 transition-all shadow-2xl border-l backdrop-blur-xl ${
              theme === "dark"
                ? "bg-gray-900/95 border-gray-700 text-white"
                : "bg-white/95 border-gray-300 text-black"
            }`}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Profile Details
              </h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors hover-lift"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-6 p-6">
              <div className="relative">
                <img
                  src={dataUser?.profile_pic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover shadow-xl ring-4 ring-purple-200 dark:ring-purple-800"
                />
                {dataUser?.online && (
                  <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full pulse-online"></span>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{dataUser?.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{dataUser?.email}</p>
              </div>

              {/* Skills Section */}
              <div className="w-full space-y-4">
                <h4 className="font-bold text-lg mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Skills & Info
                </h4>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Languages:</span>
                    <p className="mt-1">
                      {skill.languages.length > 0
                        ? skill.languages.map((lang) => lang?.label).join(", ")
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Roles:</span>
                    <p className="mt-1">
                      {skill.roles.length > 0
                        ? skill.roles.map((role) => role?.label).join(", ")
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Tools:</span>
                    <p className="mt-1">{skill.tools || "Not specified"}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">GitHub:</span>
                    <p className="mt-1">
                      {skill.github ? (
                        <a
                          href={skill.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 underline break-all"
                        >
                          View Profile
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Rating:</span>
                    <p className="mt-1 flex items-center gap-1">
                      {skill.rating !== "N/A" ? (
                        <>
                          <span className="text-yellow-500">★</span>
                          {skill.rating}
                        </>
                      ) : (
                        "Not rated yet"
                      )}
                    </p>
                  </div>

                  {skill.description && (
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">About:</span>
                      <p className="mt-1">{skill.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Body */}
        <section
          className="flex-1 overflow-y-auto px-6 py-4 srollbar"
          ref={currentMessage}
        >
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <span
                  className={`text-sm px-4 py-2 rounded-full font-medium shadow-sm ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-300 border border-gray-700"
                      : "bg-white text-gray-600 border border-gray-200"
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
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-2xl px-4 py-3 w-fit max-w-[320px] mb-3 shadow-lg message-bubble ${
                    user._id === msg.msgByUserId
                      ? theme === "dark"
                        ? "ml-auto bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                        : "ml-auto bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="shared-img"
                      className="w-full max-h-60 object-contain rounded-xl mb-2 cursor-pointer hover:scale-105 transition-transform"
                    />
                  )}
                  {msg.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      className="w-full max-h-60 object-contain rounded-xl mb-2 cursor-pointer"
                      controls
                    />
                  )}
                  {msg.text && (
                    <p className="break-words whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </p>
                  )}
                  <p className="text-xs text-right opacity-70 mt-2 font-medium">
                    {moment(msg.createdAt).format("HH:mm")}
                  </p>
                </div>
              ))}
            </div>
          ))}
          {loading && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <Loading />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            </div>
          )}
        </section>

        {/* Media Preview */}
        {(message.imageUrl || message.videoUrl) && (
          <div className="w-full flex items-center justify-center px-6 py-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-[90vw] sm:max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
              <button
                onClick={
                  message.imageUrl
                    ? () => setMessage((prev) => ({ ...prev, imageUrl: "" }))
                    : () => setMessage((prev) => ({ ...prev, videoUrl: "" }))
                }
                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg hover-lift"
              >
                <IoClose size={20} />
              </button>

              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  className="w-full h-auto rounded-xl object-contain"
                  alt="Preview"
                />
              )}
              {message.videoUrl && (
                <video
                  src={message.videoUrl}
                  className="w-full h-auto rounded-xl object-contain"
                  controls
                  autoPlay
                  muted
                />
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={`border-t px-6 py-4 flex items-center gap-4 backdrop-blur-sm ${
          theme === "dark" 
            ? "border-gray-700 bg-gray-800/50" 
            : "border-purple-200 bg-white/50"
        }`}>
          <div className="relative">
            <button
              onClick={() => setOpenImageVideoUpload((prev) => !prev)}
              className={`p-3 rounded-full transition-all duration-300 hover-lift ${
                theme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              <IoMdAdd size={22} />
            </button>
            {openImageVideoUpload && (
              <div
                className={`absolute bottom-16 left-0 rounded-xl shadow-2xl w-40 py-2 border backdrop-blur-sm ${
                  theme === "dark" 
                    ? "bg-gray-800/90 border-gray-600" 
                    : "bg-white/90 border-gray-200"
                }`}
              >
                <label
                  htmlFor="uploadImage"
                  className="flex items-center px-4 py-3 hover:bg-purple-100 dark:hover:bg-gray-700 cursor-pointer gap-3 transition-colors"
                >
                  <FaImage className="text-purple-600" />
                  <span className="font-medium">Image</span>
                </label>
                <hr className="border-gray-200 dark:border-gray-600" />
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center px-4 py-3 hover:bg-purple-100 dark:hover:bg-gray-700 cursor-pointer gap-3 transition-colors"
                >
                  <FaVideo className="text-purple-600" />
                  <span className="font-medium">Video</span>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                />
                <input
                  type="file"
                  id="uploadVideo"
                  accept="video/*"
                  className="hidden"
                  onChange={handleUploadVideo}
                />
              </div>
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex-1 flex items-center gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={message.text}
              onChange={(e) =>
                setMessage((prev) => ({ ...prev, text: e.target.value }))
              }
              placeholder="Type your message..."
              className={`flex-1 px-6 py-3 rounded-full border focus:outline-none transition-all duration-300 input-focus ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-600 focus:border-purple-500"
                  : "bg-white border-gray-300 focus:border-purple-500"
              }`}
            />

            <button
              type="submit"
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover-lift"
            >
              <MdSend size={22} />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default MessagePage;