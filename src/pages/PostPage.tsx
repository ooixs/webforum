import { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";

import {
  TextField,
  Box,
  Grid,
  IconButton,
  Zoom,
  Button,
  Tooltip,
} from "@mui/material";
import { blue, red, grey } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Post from "../types/Post";
import User from "../types/User";
import Navbar from "../components/Navbar";
import Account from "../components/Account";
import PostItem from "../components/PostItem";

function PostPage() {
  //Redirects the user to the login page if not logged in
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace={true} />;
  }

  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [isExpanded, setExpanded] = useState(false);
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [isHeadingEmpty, setHeadingEmpty] = useState(false);
  const [isContentEmpty, setContentEmpty] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Map<Number, string>>(new Map());
  const [topicName, setTopicName] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isEditing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  //Makes the "Post Item" button area expand to textfields for the user to create their post
  function expand() {
    setExpanded(true);
  }

  //Handles logic to close the heading and content textfields
  function closeTextField() {
    setContent("");
    setHeading("");
    setExpanded(false);
    setEditing(false);
    setEditingId(null);
    setHeadingEmpty(false);
    setContentEmpty(false);
  }

  //Handles logic to add a new post to the database
  async function handleAdd() {
    //Checks whether the heading contains only whitespaces or is empty
    if (heading.trim() === "") {
      setHeadingEmpty(true);
      return;
    }

    //Checks whether the content contains only whitespaces or is empty
    if (content.trim() === "") {
      setHeadingEmpty(false);
      setContentEmpty(true);
      return;
    }
    setHeadingEmpty(false);
    setContentEmpty(false);
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

  //Initiates settings for users to edit a post
  function updatePost(post: Post) {
    setEditing(true);
    setEditingId(post.id);
    setHeading(post.heading);
    setContent(post.content);
    setExpanded(true);
    setHeadingEmpty(false);
    setContentEmpty(false);
  }

  //Handles backend to edit a post
  async function handleUpdate() {
    //Heading or content cannot be empty or only contain whitespaces
    if (heading.trim() === "") {
      setHeadingEmpty(true);
      return;
    }
    if (content.trim() === "") {
      setHeadingEmpty(false);
      setContentEmpty(true);
      return;
    }
    setHeadingEmpty(false);
    setContentEmpty(false);
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

  //Handles backend to delete a post
  async function handleDelete(postId: number) {
    closeTextField();
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

  //Fetches all posts for the selected topic
  //Refreshes every time a post is edited, deleted or added (through refreshCounter), or when the topicId is changed through the navigation sidebar
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

  //Fetches the data of all users who have registered, to be used to match their usernames to the posts they create
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

  //Fetches the selected topic
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
    <>
      {/* Creates the topics navbar button at the top left of the page */}
      <Navbar />
      <Box sx={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Top bar of the posts page, containing the back button and the topic name */}
        <Grid container>
          <Grid
            size={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip title="Back">
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
            </Tooltip>
          </Grid>
          <Grid size={10}>
            <h1>{topicName ? topicName : "Loading Topic..."}</h1>
          </Grid>

          {/* If the window viewport is small, the user icon is also rendered in the top bar instead of sticking to the top right of the screen */}
          <Grid
            size={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
        <hr />

        {/* Render the posts */}
        {posts.length !== 0 ? (
          posts.map((post) => (
            <PostItem
              key={post.id}
              username={users.get(post.user_id) || "Loading Username..."}
              post={post}
              updatePost={updatePost}
              deletePost={handleDelete}
            />
          ))
        ) : (
          <p>No posts yet!</p>
        )}

        {/* Creates the heading and content textfields at the bottom of the page for the user to create a post */}
        <Grid
          container
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            paddingBottom: "20px",
            paddingRight: isExpanded ? "0px" : "20px",
            paddingLeft: "20px",
            backgroundColor: "#181818",
            width: "100%",
            zIndex: 3,
            boxShadow: "0px -10px 30px 10px #181818",
            height: isExpanded
              ? isEditing || isContentEmpty || isHeadingEmpty
                ? "225px"
                : "192.5px"
              : "65px",
          }}
        >
          {/* Displays whether the user is in editing mode, and/or any input errors in the textfields */}
          <Grid container size={12}>
            {isEditing && (
              <Grid size={6}>
                <p
                  style={{
                    textAlign: "left",
                    marginTop: 0,
                    marginBottom: 10,
                    color: grey[500],
                  }}
                >
                  (Editing mode)
                </p>
              </Grid>
            )}
            {isHeadingEmpty ? (
              <Grid size={5}>
                <p
                  style={{
                    color: "red",
                    textAlign: isEditing ? "right" : "left",
                    marginTop: 0,
                    marginBottom: 10,
                  }}
                >
                  Heading cannot be empty!
                </p>
              </Grid>
            ) : (
              isContentEmpty && (
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
              )
            )}
          </Grid>

          {/* Creates the heading and content textfields, and the cancel and post buttons at the side of the textfields */}
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
                    <Tooltip title="Cancel">
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
                    <Tooltip title="Send Post">
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
                    </Tooltip>
                  </Zoom>
                </Box>
              </Grid>
            </Grid>
          ) : (
            //Renders a "New Post" button to expand the textfields for the user to create a post
            <Button onClick={expand} variant="outlined" fullWidth>
              New Post
            </Button>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default PostPage;
