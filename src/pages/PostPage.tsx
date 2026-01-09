import { TextField, Card, CardContent, IconButton, Zoom } from "@mui/material";
import { blue } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Post from "../types/Post";
import User from "../types/User";
import PostItem from "../components/PostItem";

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
  const [newestPostId, setNewestPostId] = useState<number | null>(null);

  function expand() {
    setExpanded(true);
  }

  async function handleClick() {
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
    setContent("");
    setHeading("");
    setExpanded(false);
    if (!res.ok) {
      const err = await res.text();
      console.error("Error:", res.status, err);
    } else {
      const data = await res.json();
      setNewestPostId(data);
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
  }, [newestPostId]);

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
            username={
              users.find((user) => user.id === post.user_id)?.username ||
              "Unknown"
            }
            post={post}
          />
        ))
      ) : (
        <p>No posts yet!</p>
      )}
      <Card
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          backgroundColor: "black",
          width: "100%",
        }}
      >
        <CardContent>
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
              onClick={handleClick}
              sx={{
                color: "white",
                bgcolor: blue[500],
                "&:hover": {
                  bgcolor: blue[700],
                },
              }}
              aria-label="send post"
              component="span"
            >
              <SendIcon />
            </IconButton>
          </Zoom>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostPage;
