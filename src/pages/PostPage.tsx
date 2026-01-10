import { TextField, Card, CardContent, IconButton, Zoom } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Post from "../types/Post";
import User from "../types/User";
import PostItem from "../components/PostItem";
import CloseIcon from "@mui/icons-material/Close";

function PostPage() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace={true} />;
  }

  const { topicId } = useParams<{ topicId: string }>();

  const [isExpanded, setExpanded] = useState(false);
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  function expand() {
    setExpanded(true);
  }

  function closeTextField() {
    setContent("");
    setHeading("");
    setExpanded(false);
    setEditing(false);
    setEditingId(null);
  }

  async function handleAdd() {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic_id: Number(topicId),
        heading: heading,
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

  function updatePost(post: Post) {
    setEditing(true);
    setEditingId(post.id);
    setHeading(post.heading);
    setContent(post.content);
    setExpanded(true);
  }

  async function handleUpdate() {
    const res = await fetch("/api/posts/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        heading: heading,
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

  async function handleDelete(postId: number) {
    const res = await fetch("/api/posts/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: postId,
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
    async function fetchPosts() {
      const res = await fetch("/api/posts/" + topicId);
      if (!res.ok) {
        const err = await res.text();
        console.error("Error:", res.status, err);
      } else {
        const data = await res.json();
        setPosts(data || []);
      }
    }
    fetchPosts();
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
      <h1>Posts</h1>
      {posts.length !== 0 ? (
        posts.map((post) => (
          <PostItem
            key={post.id}
            user={
              users.find((user) => user.id === post.user_id) || {
                id: 0,
                username: "Unknown",
              }
            }
            post={post}
            updatePost={updatePost}
            deletePost={handleDelete}
          />
        ))
      ) : (
        <p>No posts yet!</p>
      )}
      <Card
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          backgroundColor: "black",
          width: "100%",
          zIndex: 3,
        }}
      >
        <CardContent>
          {editing && <p>Editing</p>}
          {isExpanded && (
            <TextField
              label="Heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              variant="filled"
            />
          )}
          <br />
          <TextField
            onClick={expand}
            label={isExpanded ? "Content" : "New Post"}
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
              aria-label="send post"
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

export default PostPage;
