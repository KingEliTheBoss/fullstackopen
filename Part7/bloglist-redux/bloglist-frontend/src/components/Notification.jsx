import {useSelector} from "react-redux";

const Notification = () => {
    const notification = useSelector(({notification})=> notification);

    if (notification.notif === null) {
        return null;
    }


    return (
        <div className={notification.type}>
            {notification.notif}
        </div>
    );
};

export default Notification;