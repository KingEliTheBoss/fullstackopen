import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logOutOfSession } from "../reducers/userReducer";
import { MenuDiv, GeneralButton } from "../assets/Components.styled";

const Menu = ({ user }) => {
    const dispatch = useDispatch();

    const handleLogout = (event) => {
        event.preventDefault();
        dispatch(logOutOfSession());
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