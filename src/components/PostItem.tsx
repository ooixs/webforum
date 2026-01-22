import { Box, Grid, Tooltip, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Post from "../types/Post";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, yellow, grey } from "@mui/material/colors";
import { useState } from "react";
import Confirmation from "./Confirmation";

type Props = {
  post: Post;
  username: string;
  updatePost: (post: Post) => void;
  deletePost: (postId: number) => Promise<void>;
};

//Creates the template for a post component
function PostItem({ post, username, updatePost, deletePost }: Props) {
  const userId = sessionStorage.getItem("userId");
  const byUser = Number(userId) === post.user_id;

  const [isDeleting, setDeleting] = useState(false);

  //Handles user's choice of whether to delete a post
  function handleYes() {
    setDeleting(false);
    deletePost(post.id);
  }
  function handleNo() {
    setDeleting(false);
  }

  //Triggers when user clicks the delete button on one of their posts
  function handleDelete() {
    setDeleting(true);
  }

  return (
    <Box
      sx={{
        textAlign: "center",
      }}
    >
      {/* Creates delete confirmation popup whenever the user wants to delete a post */}
      {isDeleting && (
        <Confirmation
          type="post deletion"
          handleYes={handleYes}
          handleNo={handleNo}
        />
      )}

      {/* Creates a post item */}
      <Grid
        container
        sx={{
          position: "relative",
          backgroundColor: "#191919",
          backgroundImage: "none",
          borderRadius: "16px",
          "&:hover": {
            backgroundColor: "#242424",
          },
          textAlign: "left",
          paddingLeft: 2,
        }}
      >
        {/* Clicking anywhere on the post would bring them to the respective reply section of the post */}
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
        <Grid size={12}>
          <h2
            style={{
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 6,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.heading}
          </h2>
        </Grid>
        <Grid size={12}>
          <p
            style={{
              marginTop: 5,
              marginBottom: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 6,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.content}
          </p>
        </Grid>
        <Grid size={10.5}>
          <p style={{ color: grey[500], fontFamily: "Lato" }}>
            Posted by <i>{username}</i> on {post.time_created}
            {post.edited ? " (Edited)" : ""}
          </p>
        </Grid>

        {/* Only the posts created by the user has an edit and delete button on the post */}
        <Grid size={1.5}>
          {byUser && (
            <Box sx={{ display: "flex", gap: "5px", marginTop: 1 }}>
              <Tooltip title="Edit Post">
                <IconButton
                  aria-label="Edit Post"
                  sx={{
                    zIndex: 2,
                    position: "relative",
                    backgroundColor: "#303030",
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
              </Tooltip>

              <Tooltip title="Delete Post">
                <IconButton
                  aria-label="Delete Post"
                  sx={{
                    zIndex: 2,
                    position: "relative",
                    backgroundColor: "#303030",
                    color: red[500],
                    "&:hover": {
                      color: red[700],
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Grid>
      </Grid>
      <hr />
    </Box>
  );
}

export default PostItem;
