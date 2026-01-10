import { Box, Card, CardContent } from "@mui/material";
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
    <Card sx={{ position: "relative" }}>
      <CardContent>
        <Link
          to={`/replies/${post.id}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
        <h2>{post.heading}</h2>
        <p>{post.content}</p>
        <p>{post.time_created}</p>
        <p>By: {user.username}</p>
        {byUser && (
          <Box>
            <IconButton
              aria-label="Edit Post"
              sx={{
                zIndex: 2,
                position: "relative",
                color: yellow[500],
                "&:hover": {
                  color: yellow[700],
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                updatePost(post);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Delete Post"
              sx={{
                zIndex: 2,
                position: "relative",
                color: red[500],
                "&:hover": {
                  color: red[700],
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                deletePost(post.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default PostItem;
