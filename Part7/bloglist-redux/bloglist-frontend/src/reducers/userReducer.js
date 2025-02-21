import { createSlice, current } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";

const loginSlice = createSlice({
    name: "login",
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload;
        }
    }
});

export const { setUser, unsetUser } = loginSlice.actions;

export const logInToSession = (username, password) => {
    return async dispatch => {
        const user = await loginService.login({ username, password });
        localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
        blogService.setToken(user.token);
        dispatch(setUser(user));
    }
};

export const verifyUser = () => {
    return async dispatch => {
        const loggedUserJSON = localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            dispatch(setUser(user));
            blogService.setToken(user.token);
        }
    }
};

export const logOutOfSession = () => {
    return async dispatch => {
        localStorage.removeItem("loggedBlogappUser");
        dispatch(setUser(null));
    }
};

export default loginSlice.reducer;