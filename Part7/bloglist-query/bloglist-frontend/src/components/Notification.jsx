import { useNotificationValue } from "../contexts/NotificationContext";

const Notification = () => {
    const notif = useNotificationValue();

    if(notif.message === null){
        return null;
    }

    return (
        <div className={notif.type}>
            {notif.message}
        </div>
    );
};

export default Notification;