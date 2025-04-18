import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout, setUser } from "../redux/userSlice";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("redux user ", user);
  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      
      dispatch(setUser(response?.data?.data));
      if (response?.data?.logout) {
        dispatch(logout());
        navigate("/email");
      }
      console.log("current user ", response);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div>
      Home
      {/* message component  */}
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
