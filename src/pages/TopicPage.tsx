import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { Box, Grid } from "@mui/material";

import Topic from "../types/Topic";
import TopicItem from "../components/TopicItem";
import Account from "../components/Account";

function TopicPage() {
  //Redirects the user to the login page if not logged in
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace={true} />;
  }

  const API_URL = import.meta.env.VITE_API_BASE_URL || "";

  const [topics, setTopics] = useState<Topic[]>([]);

  //Fetches all topics from the database
  useEffect(() => {
    async function fetchTopics() {
      const res = await fetch(`${API_URL}/api/topics`);
      if (!res.ok) {
        const err = await res.text();
        console.error("Error:", res.status, err);
      } else {
        const data = await res.json();
        setTopics(data || []);
      }
    }
    fetchTopics();
  }, []);

  return (
    <>
      {/* Creates the user icon on the top-right of the page */}
      <Box
        sx={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        <Account />
      </Box>

      {/* Creates the topics menu */}
      <Box
        sx={{
          paddingTop: 5,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1>Topics</h1>
        <Grid container spacing={1}>
          {topics.length !== 0 ? (
            topics.map((topic) => <TopicItem key={topic.id} topic={topic} />)
          ) : (
            <p>No topics available!</p>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default TopicPage;
