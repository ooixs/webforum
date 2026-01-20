import { TextField, Box, Grid, IconButton, Zoom, Button } from "@mui/material";
import { blue, red, grey } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import Post from "../types/Post";
import User from "../types/User";
import PostItem from "../components/PostItem";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../components/Navbar";
import Account from "../components/Account";

function PostPage() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace={true} />;
  }

  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [isExpanded, setExpanded] = useState(false);
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [topicName, setTopicName] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isEditing, setEditing] = useState(false);
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
    window.scrollTo(0, 0);
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
  }, [refreshCounter, topicId]);

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
    async function fetchTopic() {
      const res = await fetch("/api/topic/" + topicId);
      if (!res.ok) {
        const err = await res.text();
        console.error("Error:", res.status, err);
      } else {
        const data = await res.json();
        setTopicName(data);
      }
    }
    fetchTopic();
  }, [topicId]);

  return (
    <Box>
      <Navbar />
      <Account />
      <Box sx={{ maxWidth: "960px", margin: "0 auto" }}>
        <Grid container>
          <Grid
            size={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              aria-label="Back"
              onClick={() => navigate("/topics")}
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
            <h1>{topicName ? topicName : "Loading Topic..."}</h1>
          </Grid>
          <Grid
            size={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></Grid>
        </Grid>
        <hr />
        {posts.length !== 0 ? (
          posts.map((post) => (
            <PostItem
              key={post.id}
              user={
                users.find((user) => user.id === post.user_id) || {
                  id: 0,
                  username: "Loading Username...",
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
        <Grid
          container
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            paddingBottom: "20px",
            paddingLeft: "20px",
            backgroundColor: "#181818",
            width: "100%",
            zIndex: 3,
            boxShadow: "0px -5px 30px 10px #181818",
            height: isExpanded ? (isEditing ? "255px" : "200px") : "80px",
          }}
        >
          <Grid size={12}>
            {isEditing && <p style={{ textAlign: "left" }}>(Editing mode)</p>}
          </Grid>
          {isExpanded ? (
            <Grid container size={12}>
              <Grid size={11}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    label="Heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    variant="filled"
                    fullWidth
                  />
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
                </Box>
              </Grid>
              <Grid size={1}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "90px",
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
                      aria-label="send post"
                    >
                      <SendIcon />
                    </IconButton>
                  </Zoom>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Button onClick={expand} variant="outlined" fullWidth>
              New Post
            </Button>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default PostPage;
