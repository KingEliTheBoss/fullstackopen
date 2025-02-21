import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { initializeUsers } from "../reducers/usersReducer";
import { BlogsDiv } from "../assets/Components.styled";

const Users = () => {
    const users = useSelector(({ users }) => users);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeUsers());
    }, []);

    if(!users){
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