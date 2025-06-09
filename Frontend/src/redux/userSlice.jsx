// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    return "light";
  }
};

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: null,
  theme: getInitialTheme(), // ✅ set theme once
  college: "",
  branch: "",
  course: "",
  skills: null, //make skills an object,
  studyYear: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      Object.assign(state, action.payload);
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      try {
        localStorage.setItem("theme", state.theme); // ✅ set theme in reducer safely
      } catch (e) {
        console.error("Could not persist theme");
      }
    },
    logout: (state) => {
      Object.assign(state, {
        _id: "",
        name: "",
        email: "",
        profile_pic: "",
        token: "",
        socketConnection: null,
        college: "",
        branch: "",
        course: "",
        skills: [],
        studyYear: "",
      });
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

export const {
  setUser,
  setToken,
  logout,
  setOnlineUser,
  setSocketConnection,
  toggleTheme,
} = userSlice.actions;

export default userSlice.reducer;
