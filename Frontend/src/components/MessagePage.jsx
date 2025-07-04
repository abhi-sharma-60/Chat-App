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
import useAuthCheck from "../helper/useAuthCheck";


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

  const [skill,setSkill] = useState({
    rating: 0,
    languages: [],
    roles: [],
    tools: "",
    github: "",
    description: "",
  })

  // useEffect(() => {
  //   if(!user) useAuthCheck(user);
  // },[])

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

  // useEffect(() => {
  //   if (socketConnection && params?.userId !== user?._id) {
  //     socketConnection.emit("message-page", params?.userId);
  //     socketConnection.emit("seen", params?.userId);
  //     socketConnection.on("message-user", (data) => setDataUser(data));
  //     socketConnection.on("message", (data) => setAllMessage(data));
  //   }
  // },[])


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for user:", params.userId);
        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/messages/${params.userId}`
        const res = await axios.get(URL, {
          withCredentials: true
        });
        setAllMessage(res.data.messages);
        console.log(allMessage)
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };


    const fetchSkills = async () => {
      try {
        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/get-profile-skills/${params.userId}`;
        const res = await axios.get(URL,{
          withCredentials: true,
        });
  

        if (!res.data.success || !res.data.data) {
          // User has no skills: reset the skill state
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
        // console.log("skills")
        // console.log(fetched);
  
        setSkill({
          languages: (fetched.languages || []).map((lang) =>
            languageOptions.find((opt) => opt.value === lang)
          ).filter(Boolean),
  
          roles: (fetched.roles || []).map((role) =>
            roleOptions.find((opt) => opt.value === role)
          ).filter(Boolean),
  
          description: fetched.description || "",
          rating: fetched.rating[0]|| "N/A",
          github: fetched.github || "",
          tools: (fetched.tools || []).join(", "),
        });
        
      } catch (err) {
        console.error("Error fetching skills:", err);
        toast.error("Failed to fetch skills.");
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
        socketConnection.emit("sidebar",user?._id)
      }

    // Listen only to messages from the current chat partner
    const eventName = `message:${params?.userId}`;
    socketConnection.on(eventName, messageHandler);

    return () => {
      socketConnection.off(eventName, messageHandler); // Clean up
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
          ? "bg-gray-800 border-gray-700 border-l-2"
          : "bg-gradient-to-tr from-indigo-100 via-purple-100 border-l-2 to-pink-100 text-black"
      }`}
    >
      <div
        className={`relative flex flex-col w-full max-w-full h-[98vh] rounded-3xl shadow-xl border backdrop-blur-md overflow-hidden ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white/90 border-purple-200 text-black"
        }`}
      >
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-3 border-b border-purple-200 relative">
          <div className="flex items-center gap-3">
            <Link to="/" className="lg:hidden">
              <FiArrowLeft size={24} />
            </Link>
            <Avatar
              height={48}
              width={48}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser._id}
            />
            <div>
              <h3 className="font-semibold text-lg">{dataUser?.name}</h3>
              <p className="text-sm">
                {dataUser?.online ? (
                  <span className="text-green-500">online</span>
                ) : (
                  "offline"
                )}
              </p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowDropdown((prev) => !prev)}>
              <HiOutlineDotsVertical size={20} />
            </button>
            {showDropdown && (
              <div
                className={`absolute right-0 mt-2 w-40 z-50 shadow-md rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-purple-200"
                }`}
              >
                <button
                  onClick={() => {
                    setShowUserDetails(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-purple-100 dark:hover:bg-gray-600"
                >
                  View User Details
                </button>
              </div>
            )}
          </div>
        </header>

        {/* User Detail Side Panel */}
{showUserDetails && (
  <div
    className={`absolute top-0 right-0 h-full w-80 z-50 transition-all shadow-xl border-l ${
      theme === "dark"
        ? "bg-gray-900 border-gray-700 text-white"
        : "bg-white border-gray-300 text-black"
    }`}
  >
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-lg font-semibold">User Details</h2>
      <button
        onClick={() => setShowUserDetails(false)}
        className="text-red-500"
      >
        <IoClose size={24} />
      </button>
    </div>

    <div className="flex flex-col items-center gap-4 p-4">
      <img
        src={dataUser?.profile_pic}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover shadow-md"
      />
      <h3 className="text-xl font-bold">{dataUser?.name}</h3>
      <p className="text-sm text-gray-500">{dataUser?.email}</p>
      <p
        className={`text-sm font-medium ${
          dataUser?.online ? "text-green-500" : "text-gray-400"
        }`}
      >
        {dataUser?.online ? "Online" : "Offline"}
      </p>

      {/* Skills Section */}
      <div className="w-full mt-4 text-sm text-left space-y-2">
        <h4 className="font-semibold text-base mb-1">Skills</h4>

        <div>
          <span className="font-medium">Languages:</span>{" "}
          {skill.languages.length > 0
            ? skill.languages.map((lang) => lang?.label).join(", ")
            : "N/A"}
        </div>

        <div>
          <span className="font-medium">Roles:</span>{" "}
          {skill.roles.length > 0
            ? skill.roles.map((role) => role?.label).join(", ")
            : "N/A"}
        </div>

        <div>
          <span className="font-medium">Tools:</span> {skill.tools || "N/A"}
        </div>

        <div>
          <span className="font-medium">GitHub:</span>{" "}
          {skill.github ? (
            <a
              href={skill.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {skill.github}
            </a>
          ) : (
            "N/A"
          )}
        </div>

        <div>
          <span className="font-medium">Rating:</span> {skill.rating || "N/A"}
        </div>


        <div>
          <span className="font-medium">Description:</span>{" "}
          {skill.description || "N/A"}
        </div>
      </div>
    </div>
  </div>
)}


        {/* Chat Body */}
        <section
          className="flex-1 overflow-y-auto px-4 py-3 overflow-x-hidden max-w-full"
          ref={currentMessage}
        >
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              <div className="flex justify-center my-2">
                <span
                  className={`text-sm px-4 py-1 rounded-full ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-purple-100 text-purple-700"
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
                className={`rounded-xl px-4 py-2 w-fit max-w-[320px] mb-2 shadow ${
                  user._id === msg.msgByUserId
                    ? theme === "dark"
                      ? "ml-auto bg-gray-200 text-black"
                      : "ml-auto bg-purple-600 text-white"
                    : theme === "dark"
                    ? "bg-gray-700"
                    : "bg-purple-100 text-black"
                }`}
              >
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="shared-img"
                    className="w-full max-h-60 object-contain rounded-lg mb-2 cursor-pointer"

                  />
                )}
                {msg.videoUrl && (
                  <video
                    src={msg.videoUrl}
                    className="w-full max-h-60 object-contain rounded-lg mb-2 cursor-pointer"

                    controls
                  />
                )}
                <p className="break-words whitespace-pre-wrap">{msg.text}</p>
              
                <p className="text-xs text-right opacity-70 mt-1">
                  {moment(msg.createdAt).format("HH:mm")}
                </p>
              </div>
              
              ))}
            </div>
          ))}
          {loading && (
            <div className="text-center py-3">
              <Loading size={40} />
            </div>
          )}
        </section>

        
        {/* Media Preview */}
{(message.imageUrl || message.videoUrl) && (
  <div className="w-full h-fit flex items-center justify-center z-[1000] px-4 py-4 overflow-y-auto">
    <div className="relative bg-white rounded-xl p-4 max-w-[90vw] sm:max-w-md overflow-hidden">
      <button
        onClick={
          message.imageUrl
            ? () => setMessage((prev) => ({ ...prev, imageUrl: "" }))
            : () => setMessage((prev) => ({ ...prev, videoUrl: "" }))
        }
        className="absolute top-2 right-2 text-red-600"
      >
        <IoClose size={24} />
      </button>

      {message.imageUrl && (
        <img
          src={message.imageUrl}
          className="w-full h-auto rounded-lg object-contain"
          alt="Preview"
        />
      )}
      {message.videoUrl && (
        <video
          src={message.videoUrl}
          className="w-full h-auto rounded-lg object-contain"
          controls
          autoPlay
          muted
        />
      )}
    </div>
  </div>
)}


        {/* Footer */}
        <footer className="border-t px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpenImageVideoUpload((prev) => !prev)}
              className={`p-2 rounded-full ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-purple-100 text-purple-700"
              } hover:scale-105 transition`}
            >
              <IoMdAdd size={20} />
            </button>
            {openImageVideoUpload && (
              <div
                className={`absolute bottom-14 left-0 rounded-lg shadow-md w-36 py-2 ${
                  theme === "dark" ? "bg-gray-800 outline" : "bg-white outline"
                }`}
              >
                <label
                  htmlFor="uploadImage"
                  className="flex items-center px-3 py-2 hover:bg-purple-200 dark:hover:text-black cursor-pointer gap-2"
                >
                  <FaImage className="text-purple-600" />
                  <span>Image</span>
                </label>
                <hr />
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center px-3 py-2 hover:bg-purple-200 dark:hover:text-black cursor-pointer gap-2"
                >
                  <FaVideo className="text-purple-600" />
                  <span>Video</span>
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
            className="flex-1 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={message.text}
              onChange={(e) =>
                setMessage((prev) => ({ ...prev, text: e.target.value }))
              }
              placeholder="Type a message..."
              className={`flex-1 px-4 py-2 rounded-full border focus:outline-none ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white border-purple-300"
              }`}
            />

            <button
              type="submit"
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
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
