import {
  TextField,
  Card,
  CardContent,
  Grid,
  Box,
  IconButton,
  Zoom,
  Button,
  Tooltip,
} from "@mui/material";
import { blue, red, grey } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import Reply from "../types/Reply";
import Post from "../types/Post";
import User from "../types/User";
import ReplyItem from "../components/ReplyItem";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../components/Navbar";
import Account from "../components/Account";

function ReplyPage() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace={true} />;
  }

  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [isExpanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [isContentEmpty, setContentEmpty] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [users, setUsers] = useState<Map<Number, string>>(new Map());
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isEditing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  function expand() {
    setExpanded(true);
  }

  function closeTextField() {
    setContent("");
    setExpanded(false);
    setEditing(false);
    setEditingId(null);
    setContentEmpty(false);
  }

  async function handleAdd() {
    if (content.trim() === "") {
      setContentEmpty(true);
      return;
    }
    setContentEmpty(false);
    const res = await fetch("/api/replies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: Number(postId),
        content: content,
        user_id: Number(userId),
      }),
    });
    closeTextField();
    if (!res.ok) {
      const err = await res.text();
      console.error("Error:", res.status, err);
    } else {
      setRefreshCounter(refreshCounter + 1);
    }
  }

  function updateReply(reply: Reply) {
    setEditing(true);
    setEditingId(reply.id);
    setContent(reply.content);
    setExpanded(true);
    setContentEmpty(false);
  }

  async function handleUpdate() {
    if (content.trim() === "") {
      setContentEmpty(true);
      return;
    }
    setContentEmpty(false);
    const res = await fetch("/api/replies/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        content: content,
      }),
    });
    closeTextField();
    if (!res.ok) {
      const err = await res.text();
      console.error("Error:", res.status, err);
    } else {
      setRefreshCounter(refreshCounter + 1);
    }
  }

  async function handleDelete(replyId: number) {
    closeTextField();
    const res = await fetch("/api/replies/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: replyId,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Error:", res.status, err);
    } else {
      setRefreshCounter(refreshCounter + 1);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchReplies() {
      const res = await fetch("/api/replies/" + postId);
      if (!res.ok) {
        const err = await res.text();
        console.error("Error:", res.status, err);
      } else {
        const data = await res.json();
        setReplies(data || []);
      }
    }
    fetchReplies();
  }, [refreshCounter]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const err = await res.text();
        console.error("Error:", res.status, err);
      } else {
        const data = await res.json();
        const userMap = new Map<Number, string>(
          data.map((user: User) => [user.id, user.username]),
        );
        setUsers(userMap || {});
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch("/api/post/" + postId);
      if (!res.ok) {
        const err = await res.text();
        console.error("Error:", res.status, err);
      } else {
        const data = await res.json();
        setPost(data);
      }
    }
    fetchPost();
  }, []);

  return (
    <Box>
      {/* Creates the topics navbar button at the top left of the page */}
      <Navbar />
      <Box
        sx={{
          textAlign: "left",
          width: "100%",
          margin: "0 auto",
          paddingTop: "20px",
          "@media (min-width: 960px)": {
            width: "960px",
          },
        }}
      >
        {/* Renders the post at the top of the page, with the back button rendered beside the post title */}
        <Card
          sx={{
            position: "relative",
            backgroundColor: "#191919",
            backgroundImage: "none",
            color: grey[200],
          }}
        >
          <CardContent>
            <Grid container>
              <Grid size={1}>
                <Tooltip title="Back">
                  <IconButton
                    aria-label="Back"
                    onClick={() =>
                      navigate(post ? "/posts/" + post.topic_id : "/topics")
                    }
                    sx={{
                      backgroundColor: "#303030",
                      color: grey[200],
                      "&:hover": {
                        color: grey[400],
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
              </Grid>

              {/* Renders the post heading */}
              <Grid size={10}>
                <h2
                  style={{ fontSize: "30px", margin: 0, textAlign: "center" }}
                >
                  {post ? post.heading : "Loading Post..."}
                </h2>
              </Grid>

              {/* If the window viewport is small, the user icon is also rendered beside the post title instead of sticking to the top right of the screen */}
              <Grid
                size={1}
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    "@media (min-width:1120px)": {
                      position: "fixed",
                      top: 10,
                      right: 10,
                      zIndex: 1000,
                    },
                  }}
                >
                  <Account />
                </Box>
              </Grid>
            </Grid>

            {/* Renders the post content */}
            {post && (
              <span>
                <p>{post.content}</p>
                <p style={{ color: grey[400], fontFamily: "Lato" }}>
                  Posted by{" "}
                  <i>{users.get(post.user_id) || "Loading Username..."}</i>
                  {" • "}
                  {post.time_created}
                  {post.edited ? " (Edited)" : ""}
                </p>
              </span>
            )}
          </CardContent>
        </Card>
        <hr />

        {/* Render the replies */}
        {replies.length !== 0 ? (
          replies.map((reply) => {
            const isOp = reply.user_id === post?.user_id;

            return (
              <ReplyItem
                key={reply.id}
                username={users.get(reply.user_id) || "Loading Username..."}
                isOp={isOp}
                reply={reply}
                updateReply={updateReply}
                deleteReply={handleDelete}
              />
            );
          })
        ) : (
          <p style={{ textAlign: "center" }}>No replies yet!</p>
        )}

        {/* Creates the content textfield at the bottom of the page for the user to create a post */}
        <Grid
          container
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            backgroundColor: "#181818",
            width: "100%",
            zIndex: 2,
            paddingLeft: "20px",
            paddingRight: isExpanded ? "0px" : "20px",
            paddingBottom: "20px",
            justifyContent: "space-between",
            boxShadow: "0px -10px 30px 10px #181818",
            height: isExpanded
              ? isEditing || isContentEmpty
                ? "160px"
                : "125px"
              : "70px",
          }}
        >
          {/* Displays whether the user is in editing mode, and/or any input errors in the textfield */}
          <Grid container size={12}>
            {isEditing && (
              <Grid size={6}>
                <p
                  style={{ textAlign: "left", marginTop: 0, marginBottom: 10 }}
                >
                  (Editing mode)
                </p>
              </Grid>
            )}
            {isContentEmpty && (
              <Grid size={5}>
                <p
                  style={{
                    color: "red",
                    textAlign: isEditing ? "right" : "left",
                    marginTop: 0,
                    marginBottom: 10,
                  }}
                >
                  Content cannot be empty!
                </p>
              </Grid>
            )}
          </Grid>

          {/* Creates the content textfield, and the cancel and post buttons at the side of the textfield */}
          {isExpanded ? (
            <Grid container size={12}>
              <Grid size={11}>
                <TextField
                  onClick={expand}
                  label="Content"
                  variant="filled"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  multiline
                  fullWidth
                />
              </Grid>
              <Grid size={1}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  {/* As there is no heading textfield for replies, the cancel and send buttons are closer to each other, hence the position of the button tooltips have to be shifted to prevent the tooltips from blocking either button */}
                  <Zoom in={isExpanded}>
                    <Tooltip
                      title="Cancel"
                      placement="top"
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -14],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <IconButton
                        aria-label="Cancel"
                        sx={{
                          backgroundColor: "#303030",
                          color: red[500],
                          "&:hover": {
                            color: red[700],
                          },
                        }}
                        onClick={closeTextField}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </Zoom>
                  <Zoom in={isExpanded}>
                    <Tooltip
                      title="Send Reply"
                      placement="bottom"
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -14],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      <IconButton
                        onClick={isEditing ? handleUpdate : handleAdd}
                        sx={{
                          color: "white",
                          backgroundColor: blue[500],
                          "&:hover": {
                            backgroundColor: blue[700],
                          },
                        }}
                        aria-label="send reply"
                      >
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  </Zoom>
                </Box>
              </Grid>
            </Grid>
          ) : (
            //Renders a "New Reply" button to expand the textfield for the user to create a reply
            <Button onClick={expand} variant="outlined" fullWidth>
              New Reply
            </Button>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default ReplyPage;
