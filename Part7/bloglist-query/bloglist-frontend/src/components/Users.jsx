import { useUsersValue, useUsersDispatch } from "../contexts/UsersContext";
import { Link } from "react-router-dom";
import { BlogsDiv } from "../assets/Components.styled";

const Users = () => {
    const users = useUsersValue();

    if (!users) {
        return null;
    }

    return (
        <BlogsDiv>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </BlogsDiv>
    )
};

export default Users;