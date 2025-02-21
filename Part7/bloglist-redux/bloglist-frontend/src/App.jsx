import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { initializeBlogs } from "./reducers/blogReducer";
import { verifyUser } from "./reducers/userReducer";

import Menu from "./components/Menu";
import Blog from "./components/Blog";
import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Users from "./components/Users";
import User from "./components/User";

import { AppDiv } from "./assets/Components.styled";

const App = () => {
  const blogs = useSelector(({ blogs }) => blogs);
  const user = useSelector(({ user }) => user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUser());
    dispatch(initializeBlogs());
  }, []);

  if (!blogs) {
    return null;
  }

  if (user === null) {
    return <LoginForm />
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
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </AppDiv>
  );
};

export default App;