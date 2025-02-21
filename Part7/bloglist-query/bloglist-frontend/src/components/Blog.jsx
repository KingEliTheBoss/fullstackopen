import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useUserValue } from "../contexts/UserContext";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import { useCommentsValue, useCommentsDispatch } from "../contexts/CommentsContext";
import blogService from "../services/blogs";
import commentsService from "../services/comments";
import { BlogDiv, CommentsDiv, GeneralButton } from "../assets/Components.styled";

const Blog = ({ blogs }) => {
  const [newComment, setNewComment] = useState("");

  const queryClient = useQueryClient();
  const user = useUserValue();
  const navigate = useNavigate();
  const match = useMatch("/blogs/:id");
  const notifDispatch = useNotificationDispatch();
  const commentsDispatch = useCommentsDispatch();
  const comments = useCommentsValue();

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      notifDispatch({ type: "SET", payload: { type: "good", message: "Blog deleted" } });
    },
    onError: () => {
      notifDispatch({ type: "SET", payload: { type: "error", message: "Could not delete blog" } });
    }
  });
  const updateBlogMutation = useMutation({
    mutationFn: blogService.edit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: () => {
      notifDispatch({ type: "SET", payload: { type: "error", message: "Could not update blog" } });
    }
  });

  const blog = blogs.find(blog => blog.id === match.params.id);

  useEffect(() => {
    const fetchData = async () => {
      const comms = await commentsService.getAll();
      commentsDispatch({ type: "SETCOMMENTS", payload: comms });
    };
    fetchData();
  }, []);

  if (!comments) {
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

    try {
      updateBlogMutation.mutate({
        updatedObject: {
          user: blog.user.id,
          likes: newLikes,
          title: blog.title,
          author: blog.author,
          url: blog.url
        }, blogId: blog.id
      });
    } catch (e) {
      notifDispatch({ type: "SET", payload: { type: "error", message: "Could not update blog" } });
    }

  };

  const handleDeleteBlog = (event) => {
    event.preventDefault();

    const decision = window.confirm(`Do you want to remove blog: "${blog.title}" by ${blog.author}?`);
    if (decision) {
      deleteBlogMutation.mutate(blog.id);
      queryClient.setQueryData(["blogs"], blogs.filter(b => b.id !== blog.id));
      navigate("/");
    }
  };

  const handleCommentAdd = async (event)=>{
    event.preventDefault();
    const newComm = await commentsService.create({content: newComment}, match.params.id);
    commentsDispatch({ type: "APPENDCOMMENT", payload: newComm });
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
      <button id="removeButton" onClick={handleDeleteBlog}>remove</button>

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