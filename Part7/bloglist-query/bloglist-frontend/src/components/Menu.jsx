import { useUserDispatch } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { MenuDiv, GeneralButton } from "../assets/Components.styled";

const Menu = ({ user }) => {
    const userDispatch = useUserDispatch();

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem("loggedBlogappUser");
        userDispatch({ type: "SETUSER", payload: null });
    };

    const padding = {
        paddingRight: 5
    };
    
    return (
        <MenuDiv>
            <Link style={padding} to="/">blogs</Link>
            <Link style={padding} to="/users">users</Link>
            {user.name} logged-in <GeneralButton onClick={handleLogout}>logout</GeneralButton>
        </MenuDiv>
    )
};

export default Menu;