import {
  TextField,
  Card,
  CardContent,
  Grid,
  Box,
  IconButton,
  Zoom,
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
    <div>
      <Grid container>
        <Grid
          size={1}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "50px",
          }}
        >
          <IconButton
            aria-label="Back"
            onClick={() => navigate(-1)}
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
          {post ? (
            <Card
              sx={{
                position: "relative",
                backgroundColor: "#191919",
                backgroundImage: "none",
              }}
            >
              <CardContent>
                <h1>{post.heading}</h1>
                <p>{post.content}</p>
                <p>{post.time_created}</p>
                <p>
                  By:{" "}
                  {users.find((user) => user.id === post.user_id)?.username ||
                    "Loading Username..."}
                </p>
                <p>{post.edited ? "(Edited)" : ""}</p>
              </CardContent>
            </Card>
          ) : (
            <h1>Loading Post...</h1>
          )}
        </Grid>
      </Grid>
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
        <p>No replies yet!</p>
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
          paddingBottom: "20px",
          justifyContent: "space-between",
          boxShadow: "0px -5px 30px 10px #181818",
          height: isExpanded ? (isEditing ? "185px" : "130px") : "80px",
        }}
      >
        <Grid size={12}>
          {isEditing && <p style={{ textAlign: "left" }}>(Editing mode)</p>}
        </Grid>
        <Grid size={11}>
          <TextField
            onClick={expand}
            label={isExpanded ? "Content" : "New Reply"}
            variant="filled"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={isExpanded ? 3 : 1}
            multiline={isExpanded}
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
    </div>
  );
}

export default ReplyPage;
