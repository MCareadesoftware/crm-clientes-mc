import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-toastify"
export const userSlice = createSlice({
  name: "user",

  initialState: {
    token: null,
    user: null,
    profile: null,
    permissions:null
  },

  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", JSON.stringify(state.token));
      localStorage.setItem("user", JSON.stringify(state.user));

      toast.success("Autenticado", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },

    setProfile: (state, action) => {
      state.profile = action.payload.profile;
      localStorage.setItem("profile", JSON.stringify(state.profile));
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload.permissions;
    },

    clearUser: (state) => {
      state.token = null;
      state.user = null;
      state.profile=null,
      localStorage.setItem("profile", JSON.stringify(state.profile));

      localStorage.setItem("token", JSON.stringify(state.token));
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    initializeUserState: (state, action) => {
      if (action.payload.token) state.token = action.payload.token;

      if (action.payload.user) state.user = action.payload.user;
      if (action.payload.profile) state.profile = action.payload.profile;
    },
  },
});

export const { setProfile, setUser, clearUser,setPermissions, initializeUserState } =
  userSlice.actions;

export default userSlice.reducer;
