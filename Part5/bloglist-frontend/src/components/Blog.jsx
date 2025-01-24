import { useState } from "react";

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };
  let removeButtonVisibility = { display: "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  if (user.username === blog.user.username) {
    removeButtonVisibility = { display: "" };
  }

  const handleLikeIncrease = (event) => {
    event.preventDefault();
    const newLikes = blog.likes + 1;

    updateBlog({
      user: blog.user.id,
      likes: newLikes,
      title: blog.title,
      author: blog.author,
      url: blog.url
    }, blog.id);
  };

  const handleDeleteBlog = (event) => {
    event.preventDefault();

    const decision = window.confirm(`Do you want to remove blog: "${blog.title}" by ${blog.author}?`);
    if (decision) {
      deleteBlog(blog.id);
    }
  };


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  };

  return (
    <div style={blogStyle} className="blogDiv">
      <div style={hideWhenVisible} id="basicInfo" data-testid="basicInfo">
        <li className="blog">
          <span>{blog.title} {blog.author}</span>
          <button onClick={toggleVisibility}>show</button>
        </li>
      </div>
      <div style={showWhenVisible} id="allInfo" data-testid="allInfo">
        <li>
          <span>{blog.title} {blog.author}</span>
          <button onClick={toggleVisibility}>hide</button>
        </li>
        <p>{blog.url}</p>
        <li>
          <span data-testid="likesAmount">likes {blog.likes}</span>
          <button data-testid="likeButton" className="likeButton" onClick={handleLikeIncrease}>like</button>
        </li>
        <p>{blog.user.name}</p>
        <button id="removeButton" style={removeButtonVisibility} onClick={handleDeleteBlog}>remove</button>
      </div>
    </div>
  );
};

export default Blog;