import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import Confirmation from "./Confirmation";

function AccountMenu() {
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }
  function handleYes() {
    setLoggingOut(false);
    sessionStorage.removeItem("userId");
    navigate("/", { replace: true });
  }
  function handleNo() {
    setLoggingOut(false);
  }
  function handleLogout() {
    setAnchorEl(null);
    setLoggingOut(true);
  }

  useEffect(() => {
    async function fetchTopics() {
      const res = await fetch("/api/user/" + userId);
      if (!res.ok) {
        const err = await res.text();
        console.error("Error:", res.status, err);
      } else {
        const data = await res.json();
        setUser(data.username);
      }
    }
    fetchTopics();
  }, []);

  return (
    <Box>
      {isLoggingOut && (
        <Confirmation type="logout" handleYes={handleYes} handleNo={handleNo} />
      )}
      <Tooltip title="Account info">
        <IconButton
          onClick={handleClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{
              width: 35,
              height: 35,
              backgroundColor: "#1a2952",
              color: "white",
            }}
          >
            {user.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 30,
                height: 30,
                marginLeft: -0.5,
                marginRight: 1.5,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
              minWidth: "150px",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <ListItem sx={{ marginBottom: 1 }}>
          <Avatar /> <ListItemText primary={user} />
        </ListItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default AccountMenu;
