import { TextField, Card, CardContent, IconButton, Zoom } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Reply from "../types/Reply";
import User from "../types/User";
import ReplyItem from "../components/ReplyItem";
import CloseIcon from "@mui/icons-material/Close";

function ReplyPage() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace={true} />;
  }

  const { postId } = useParams<{ postId: string }>();

  const [isExpanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [editing, setEditing] = useState(false);
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

  return (
    <div>
      <h1>(Add original post here)</h1>
      {replies.length !== 0 ? (
        replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            user={
              users.find((user) => user.id === reply.user_id) || {
                id: 0,
                username: "Unknown",
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
      <Card
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          backgroundColor: "black",
          width: "100%",
        }}
      >
        <CardContent>
          {editing && <p>Editing</p>}
          <br />
          <TextField
            onClick={expand}
            label={isExpanded ? "Content" : "New Reply"}
            variant="filled"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={isExpanded ? 3 : 1}
            multiline={isExpanded}
          />
          <Zoom in={isExpanded}>
            <IconButton
              onClick={editing ? handleUpdate : handleAdd}
              sx={{
                color: "white",
                bgcolor: blue[500],
                "&:hover": {
                  bgcolor: blue[700],
                },
              }}
              aria-label="send reply"
            >
              <SendIcon />
            </IconButton>
          </Zoom>
          <Zoom in={isExpanded}>
            <IconButton
              aria-label="Cancel"
              sx={{
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
        </CardContent>
      </Card>
    </div>
  );
}

export default ReplyPage;
