import { createSlice, current } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",
    initialState: "",
    reducers: {
        showNotification(state, action) {
            return `you voted ${action.payload}`;
        },
        removeNotification(state, action) {
            return "";
        }
    }
});

export const { showNotification, removeNotification } = notificationSlice.actions;

export const setNotification = (notif, seconds) => {
    return async dispatch => {
        dispatch(showNotification(notif));
        setTimeout(() => {
            dispatch(removeNotification());
        }, seconds * 1000);
    };
};

export default notificationSlice.reducer;