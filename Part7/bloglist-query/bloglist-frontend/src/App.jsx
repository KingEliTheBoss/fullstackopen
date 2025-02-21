import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { useUserValue, useUserDispatch } from './contexts/UserContext';
import { useUsersDispatch } from "./contexts/UsersContext";
import userService from "./services/users";

import Menu from './components/Menu';
import Blog from './components/Blog';
import Blogs from './components/Blogs';
import blogService from './services/blogs';
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Users from './components/Users';
import User from './components/User';

import { AppDiv } from "./assets/Components.styled";

const App = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();
  const usersDispatch = useUsersDispatch();

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SETUSER", payload: user });
      blogService.setToken(user.token);
    }

    const fetchData = async () => {
      const result = await userService.getAll();
      usersDispatch({ type: "SETUSERS", payload: result });
    };
    fetchData();
  }, []);

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry: 1
  });
  if (result.isLoading) {
    return <div>loading data...</div>
  } else if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }
  const blogs = result.data.sort((a, b) => b.likes - a.likes);

  if (user === null) {
    return <LoginForm />;
  }
  return (
    <AppDiv>
      <Menu user={user} />
      <Notification />
      <h2>blog app</h2>
      <Routes>
        {["/", "/blogs"].map((path, index) =>
          <Route path={path} element={<Blogs blogs={blogs} />} key={index} />
        )}
        <Route path="/blogs/:id" element={<Blog blogs={blogs} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User blogs={blogs} />} />
      </Routes>
    </AppDiv>
  );
};

export default App;