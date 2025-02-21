import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Notification from "./Notification";
import { logInToSession } from "../reducers/userReducer";
import { setNotification } from "../reducers/notificationReducer";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleLogin = (event) => {
        event.preventDefault();

        try {
            dispatch(logInToSession(username, password));
        } catch (exception) {
            dispatch(setNotification({
                notif: "Wrong credentials",
                type: "error",
            }, 5));
        }
        setUsername("");
        setPassword("");
    };

    return (
        <div>
            <h2>Log in to application</h2>
            <Notification />
            <form data-testid="loginForm" onSubmit={handleLogin}>
                <div>
                    username
                    <input data-testid="username" type="text" value={username} name="Username"
                        onChange={({ target }) => setUsername(target.value)}>
                    </input>
                </div>
                <div>
                    password
                    <input data-testid="password" type="password" value={password} name="Password"
                        onChange={({ target }) => setPassword(target.value)}>
                    </input>
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    logInToApp: PropTypes.func.isRequired
};

export default LoginForm;