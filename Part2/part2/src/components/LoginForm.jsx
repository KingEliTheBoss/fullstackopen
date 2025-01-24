import { useState } from "react";
import PropTypes from "prop-types";

const LoginForm = ({ logInToApp }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();

        logInToApp(username, password);
        setUsername("");
        setPassword("");
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
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