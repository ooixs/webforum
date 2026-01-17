import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { Navigate } from "react-router-dom";
import Topic from "../types/Topic";
import TopicItem from "../components/TopicItem";

function TopicPage() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace={true} />;
  }
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    async function fetchTopics() {
      const res = await fetch("/api/topics");
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
  );
}

export default TopicPage;
