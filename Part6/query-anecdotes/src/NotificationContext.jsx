import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "SET":
            return action.payload;
        case "REMOVE":
            return "";
        default:
            return state;
    }
};

const NotificationContext = createContext();

export const useNotificationValue = ()=>{
    const notifAndDispatch = useContext(NotificationContext);
    return notifAndDispatch[0];
};

export const useNotificationDispatch = ()=>{
    const notifAndDispatch = useContext(NotificationContext);
    return notifAndDispatch[1];
};

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, "");

    //DISPATCH TO REMOVE NOTIF AFTER 5 SECONDS OF IT BEING ADDED, POSSIBLY USEEFFECT

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
};

export default NotificationContext;