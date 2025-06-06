import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: null,
  theme: localStorage.getItem("theme") || "light", // ✅ Load persisted theme
  college: "",
  branch: "",
  course: "",
  skills: [],
  studyYear: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
      state.college = action.payload.college;
      state.branch = action.payload.branch;
      state.course = action.payload.course;
      state.skills = action.payload.skills;
      state.studyYear = action.payload.studyYear;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme); // ✅ Persist theme
    },
    logout: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
      state.socketConnection = null;
      state.college = "";
      state.branch = "";
      state.course = "";
      state.skills = [];
      state.studyYear = "";
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
