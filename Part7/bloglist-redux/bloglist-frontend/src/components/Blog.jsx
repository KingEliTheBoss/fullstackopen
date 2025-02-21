import { useDispatch, useSelector } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";
import { updateBlog, deleteBlog } from "../reducers/blogReducer";
import { initializeComments, addComment } from "../reducers/commentsReducer";
import { useEffect, useState } from "react";
import { BlogDiv, CommentsDiv, GeneralButton } from "../assets/Components.styled";

const Blog = () => {
  const [newComment, setNewComment] = useState("");

  const user = useSelector(({ user }) => user);
  const blogs = useSelector(({ blogs }) => blogs);
  const comments = useSelector(({ comments }) => comments);

  const dispatch = useDispatch();
  const match = useMatch("/blogs/:id");
  const navigate = useNavigate();

  const blog = blogs.find(blog => blog.id === match.params.id);

  useEffect(() => {
    dispatch(initializeComments(match.params.id));
  }, []);

  if (!blogs || !comments) {
    return null;
  }

  const commentsToShow = comments.filter(comment => comment.blog.id === match.params.id);

  let removeButtonVisibility = { display: "none" };

  if (user.username === blog.user.username) {
    removeButtonVisibility = { display: "" };
  }

  const handleLikeIncrease = (event) => {
    event.preventDefault();
    const newLikes = blog.likes + 1;

    dispatch(updateBlog({
      user: blog.user.id,
      likes: newLikes,
      title: blog.title,
      author: blog.author,
      url: blog.url
    }, blog.id));
  };

  const handleDeleteBlog = (event) => {
    event.preventDefault();

    const decision = window.confirm(`Do you want to remove blog: "${blog.title}" by ${blog.author}?`);
    if (decision) {
      dispatch(deleteBlog(blog.id));
      navigate("/");
    }
  };

  const handleCommentAdd = (event)=>{
    event.preventDefault();
    dispatch(addComment({content: newComment}, match.params.id));
    setNewComment("");
  };

  return (
    <BlogDiv>
      <h1>{blog.title} {blog.author}</h1>
      <div>{blog.url}</div>
      <div>
        <span data-testid="likesAmount">likes {blog.likes}</span>
        <GeneralButton data-testid="likeButton" className="likeButton" onClick={handleLikeIncrease}>like</GeneralButton>
      </div>
      <div>added by {blog.user.name}</div>
      <button id="removeButton" style={removeButtonVisibility} onClick={handleDeleteBlog}>remove</button>

      <CommentsDiv>
        <h3>comments</h3>
        <form onSubmit={handleCommentAdd}>
          <div>
            <input type="text" value={newComment} onChange={(event) => setNewComment(event.target.value)}></input>
            <GeneralButton id="submitBtnComment" type="submit">add comment</GeneralButton>
          </div>
        </form>
        <ul>
          {commentsToShow.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </CommentsDiv>
    </BlogDiv>
  );
};

export default Blog;