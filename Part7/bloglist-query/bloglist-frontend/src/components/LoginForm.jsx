import { useState } from "react";
import PropTypes from "prop-types";
import Notification from "./Notification";
import { useUserDispatch } from "../contexts/UserContext";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import blogService from "../services/blogs";
import loginService from "../services/login";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const userDispatch = useUserDispatch();
    const notifDispatch = useNotificationDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username, password
            });

            localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
            userDispatch({ type: "SETUSER", payload: user });
            blogService.setToken(user.token);
        } catch (exception) {
            notifDispatch({ type: "SET", payload: { type: "error", message: "Wrong credentials" } });
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