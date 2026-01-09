import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import Post from "../types/Post";
import User from "../types/User";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, yellow } from "@mui/material/colors";

type Props = {
  post: Post;
  user: User;
  updatePost: (post: Post) => void;
  deletePost: (postId: number) => Promise<void>;
};

function PostItem({ post, user, updatePost, deletePost }: Props) {
  const userId = sessionStorage.getItem("userId");
  const byUser = Number(userId) === post.user_id;

  return (
    <Link to={`/replies/${post.id}`} style={{ textDecoration: "none" }}>
      <Card>
        <CardContent>
          <h2>{post.heading}</h2>
          <p>{post.content}</p>
          <p>{post.time_created}</p>
          <p>By: {user.username}</p>
          {byUser && (
            <div>
              <IconButton
                aria-label="Edit Post"
                sx={{
                  color: yellow[500],
                  "&:hover": {
                    color: yellow[700],
                  },
                }}
                onClick={() => updatePost(post)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="Delete Post"
                sx={{
                  color: red[500],
                  "&:hover": {
                    color: red[700],
                  },
                }}
                onClick={() => deletePost(post.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default PostItem;
