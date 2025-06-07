import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setToken } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAuthCheck = (user) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(logout());
        navigate("/email");
        return;
      }

      try {
        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-skills`;
        const response = await axios.get(URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.token) {
          dispatch(setToken(response.data.token));
          localStorage.setItem("token", response.data.token);
          navigate("/");
        }
      } catch (error) {
        console.error("User validation failed:", error);
        dispatch(logout());
        localStorage.clear();
        navigate("/email");
      }
    };

    if (!user) getUser();
  }, [user, dispatch, navigate]);
};

export default useAuthCheck;
