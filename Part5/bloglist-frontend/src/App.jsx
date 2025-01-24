import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from "./services/login";
import Notification from "./components/Notification";
import CreateBlogForm from './components/CreateBlogForm';
import LoginForm from "./components/LoginForm";
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notifMessage, setNotifMessage] = useState(null);
  const [notifType, setNotifType] = useState(null);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogs = await blogService.getAll();
        blogs.sort((a, b) => b.likes - a.likes);
        setBlogs(blogs);
      } catch (exception) {
        if (exception.message === "Request failed with status code 401") {
          setUser(null);
        }
      }
    };
    fetchData();
  }, []);

  const createBlogFormRef = useRef();

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      });

      localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);

      const blogs = await blogService.getAll();
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);

    } catch (exception) {
      setNotifMessage("Wrong credentials");
      setNotifType("error");
      setTimeout(() => {
        setNotifMessage(null);
        setNotifType(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const handleCreateBlog = async (blogObject) => {
    try {
      await blogService.create(blogObject);

      const blogs = await blogService.getAll();
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);

      createBlogFormRef.current.toggleVisibility();

      setNotifMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`);
      setNotifType("good");
      setTimeout(() => {
        setNotifMessage(null);
        setNotifType(null);
      }, 5000);
    } catch (exception) {
      setNotifMessage("Could not create blog");
      setNotifType("error");
      setTimeout(() => {
        setNotifMessage(null);
        setNotifType(null);
      }, 5000);
    }
  };

  const handleEditBlog = async (blogObject, blogId) => {
    try {
      await blogService.edit(blogObject, blogId);

      const blogs = await blogService.getAll();
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    } catch (exception) {
      setNotifMessage("Could not update blog");
      setNotifType("error");
      setTimeout(() => {
        setNotifMessage(null);
        setNotifType(null);
      }, 5000);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await blogService.remove(blogId);

      const blogs = await blogService.getAll();
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    } catch (exception) {
      setNotifMessage("Could not delete blog");
      setNotifType("error");
      setTimeout(() => {
        setNotifMessage(null);
        setNotifType(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <Notification message={notifMessage} type={notifType} />
      <LoginForm logInToApp={handleLogin} />
    </div>
  );

  const blogsDiv = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={notifMessage} type={notifType} />
      <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
      <br /><br />
      <Togglable buttonLabel="new blog" ref={createBlogFormRef}>
        <CreateBlogForm createBlog={handleCreateBlog} />
      </Togglable>
      <br />
      {blogs.map(blog => <Blog key={blog.id} blog={blog} user={user}
        updateBlog={handleEditBlog} deleteBlog={handleDeleteBlog} />)}
    </div>
  );

  if (user === null) {
    return loginForm();
  }
  return blogsDiv();
};

export default App;