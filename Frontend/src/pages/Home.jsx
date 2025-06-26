import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import io from "socket.io-client";
import { useState } from "react";

const Home = () => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.user.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname === "/";
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  useEffect(() => {
    if (location.pathname === "/") {
      setSidebarRefreshKey(prev => prev + 1);
    }
  }, [location.pathname]);

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response?.data?.data));
      if (response?.data?.data?.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const socketconnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketconnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });
    dispatch(setSocketConnection(socketconnection));
    return () => {
      socketconnection.disconnect();
    };
  }, []);

  return (
    <div className="grid lg:grid-cols-[320px,1fr] h-screen max-h-screen">
      <section className={`${!basePath && "hidden"} lg:block`}>
        <Sidebar refreshKey={sidebarRefreshKey} />
      </section>
      
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      
      <div
        className={`flex-col justify-center items-center gap-8 hidden ${
          !basePath ? "hidden" : "lg:flex"
        } ${
          theme === "dark" 
            ? "bg-gradient-to-br from-gray-900 to-gray-800" 
            : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
        }`}
      >
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <img src="logo.png" alt="logo" width={80} className="filter brightness-0 invert" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Welcome to BaatCheet
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            Select a conversation to start chatting
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;