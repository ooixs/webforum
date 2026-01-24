import { JSX, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import MemoryIcon from "@mui/icons-material/Memory";

import Topic from "../types/Topic";

type IconMapping = Record<string, JSX.Element>;

//Creates a navigation bar on the posts and replies page for the user to navigate to any topic
function Navbar() {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "";
  const iconStyles = { fontSize: "30px" };

  //Defining the icon types for the respective topics
  const iconMap: IconMapping = {
    techIcon: <MemoryIcon sx={iconStyles} />,
    gamesIcon: <SportsEsportsIcon sx={iconStyles} />,
    lifestyleIcon: <SportsHandballIcon sx={iconStyles} />,
    musicIcon: <MusicNoteIcon sx={iconStyles} />,
    automotiveIcon: <DirectionsCarIcon sx={iconStyles} />,
    cultureIcon: <Diversity2Icon sx={iconStyles} />,
  };

  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  //Fetching all topics from the database
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

  //Creates the navigation bar for the topics
  const DrawerList = (
    <Box sx={{ width: 250 }} onClick={() => setOpen(false)}>
      <List>
        <ListItem>
          <h2 style={{ color: "white", marginTop: 0, marginBottom: 3 }}>
            Topics
          </h2>
        </ListItem>
        {topics.length !== 0 ? (
          topics.map((topic) => (
            <Link
              to={`/posts/${topic.id}`}
              style={{ textDecoration: "none", color: "white" }}
              key={topic.id}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{iconMap[topic.topic_icon]}</ListItemIcon>
                  <ListItemText primary={topic.topic} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))
        ) : (
          <ListItem>No topics available!</ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      {/* Creates the button which expands the navigation bar */}
      {/* To prevent component congestion, the button only appears when the width of the page is above 1120px */}
      <Tooltip title="Navigation Menu">
        <IconButton
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            backgroundColor: "#303030",
            "@media (max-width: 1120px)": {
              display: "none",
            },
          }}
          size="large"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>

      {/* Navigation bar for the topics */}
      <Drawer
        slotProps={{
          paper: {
            sx: { backgroundColor: "#222222", backgroundImage: "none" },
          },
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        {DrawerList}
      </Drawer>
    </>
  );
}

export default Navbar;
