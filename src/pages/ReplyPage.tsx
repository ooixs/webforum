import {
  TextField,
  Card,
  CardContent,
  Grid,
  Box,
  IconButton,
  Zoom,
  Button,
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
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
  }

  async function handleAdd() {
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
  }

  async function handleUpdate() {
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
        setUsers(data || []);
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
      <Navbar />
      <Account />
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
              </Grid>
              <Grid size={10}>
                <h2
                  style={{ fontSize: "30px", margin: 0, textAlign: "center" }}
                >
                  {post ? post.heading : "Loading Post..."}
                </h2>
              </Grid>
            </Grid>
            {post && (
              <span>
                <p>{post.content}</p>
                <p style={{ color: grey[500], fontFamily: "Lato" }}>
                  Posted by{" "}
                  <i>
                    {users.find((user) => user.id === post.user_id)?.username ||
                      "Loading Username..."}
                  </i>{" "}
                  on {post.time_created}
                  {post.edited ? " (Edited)" : ""}
                </p>
              </span>
            )}
          </CardContent>
        </Card>

        <hr />
        {replies.length !== 0 ? (
          replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              user={
                users.find((user) => user.id === reply.user_id) || {
                  id: 0,
                  username: "Loading Username...",
                }
              }
              reply={reply}
              updateReply={updateReply}
              deleteReply={handleDelete}
            />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No replies yet!</p>
        )}
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
            paddingRight: "20px",
            paddingBottom: "20px",
            justifyContent: "space-between",
            boxShadow: "0px -5px 30px 10px #181818",
            height: isExpanded ? (isEditing ? "185px" : "130px") : "80px",
          }}
        >
          <Grid size={12}>
            {isEditing && <p style={{ textAlign: "left" }}>(Editing mode)</p>}
          </Grid>
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
                  <Zoom in={isExpanded}>
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
                  </Zoom>
                  <Zoom in={isExpanded}>
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
                  </Zoom>
                </Box>
              </Grid>
            </Grid>
          ) : (
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
