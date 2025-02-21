import { createSlice, current } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",
    initialState: "",
    reducers: {
        showNotification(state, action) {
            return action.payload;
        },
        removeNotification(state, action) {
            return "";
        }
    }
});

export const { showNotification, removeNotification } = notificationSlice.actions;

export const setNotification = (notification, seconds) => {
    return async dispatch => {
        dispatch(showNotification(notification));
        setTimeout(() => {
            dispatch(removeNotification());
        }, seconds * 1000);
    };
};

export default notificationSlice.reducer;