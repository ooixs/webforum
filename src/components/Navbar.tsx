import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import Topic from "../types/Topic";
import { Link } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import MemoryIcon from "@mui/icons-material/Memory";
import { red } from "@mui/material/colors";

type IconMapping = Record<string, JSX.Element>;

function Navbar() {
  const iconStyles = { fontSize: "30px" };
  const iconMap: IconMapping = {
    techIcon: <MemoryIcon sx={iconStyles} />,
    gamesIcon: <SportsEsportsIcon sx={iconStyles} />,
    lifestyleIcon: <SportsHandballIcon sx={iconStyles} />,
    musicIcon: <MusicNoteIcon sx={iconStyles} />,
    automotiveIcon: <DirectionsCarIcon sx={iconStyles} />,
    cultureIcon: <Diversity2Icon sx={iconStyles} />,
  };
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  function logout() {
    sessionStorage.removeItem("userId");
    navigate("/", { replace: true });
  }

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
            >
              <ListItem key={topic.id} disablePadding>
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
      <List sx={{ position: "absolute", bottom: 0 }}>
        <ListItem>
          <Button
            variant="contained"
            sx={{
              backgroundColor: red[600],
              "&:hover": {
                backgroundColor: red[800],
              },
              width: "218px",
              color: "white",
            }}
            onClick={logout}
          >
            Logout
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box>
      <IconButton
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          backgroundColor: "#303030",
        }}
        size="large"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>
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
    </Box>
  );
}

export default Navbar;
