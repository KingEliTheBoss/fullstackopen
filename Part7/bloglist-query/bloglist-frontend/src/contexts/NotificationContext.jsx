import { createContext, useReducer, useContext, useEffect } from "react";

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

export const useNotificationValue = () => {
    const notifAndDispatch = useContext(NotificationContext);
    return notifAndDispatch[0];
};
export const useNotificationDispatch = () => {
    const notifAndDispatch = useContext(NotificationContext);
    return notifAndDispatch[1];
};

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, "");

    useEffect(()=>{
        if(notification !== ""){
            setTimeout(() => {
                notificationDispatch({type: "REMOVE"});
            }, 5000);
        }
    }, [notification]);

    return (
        <NotificationContext.Provider value={[notification, notificationDispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
};

export default NotificationContext;