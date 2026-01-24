import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { Box, Button, TextField } from "@mui/material";

function Login() {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "";

  const [username, setUsername] = useState("");
  //User can only log in if the username exists, setting to true will ensure error only comes out if username does not exist
  const [taken, setTaken] = useState(true);
  const [hasOtherError, setHasOtherError] = useState(false);
  const [otherError, setOtherError] = useState("");
  const [userId, setUserId] = useState(0);

  //Handles login logic
  async function handleClick() {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    });
    if (!res.ok) {
      const err = await res.text();
      //If error thrown is user not found, then the username is not registered yet
      if (err.startsWith("User not found")) {
        setTaken(false);
      } else {
        setHasOtherError(true);
        setOtherError(err);
      }
      console.error("Error:", res.status, res.statusText);
    } else {
      const data = await res.json();
      setUserId(data.id);
      sessionStorage.setItem("userId", data.id.toString());
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          padding: "40px",
          backgroundColor: "#242424",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          margin: "auto",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        <h1>Login</h1>
        <TextField
          label="username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={handleClick} sx={{ mt: 2 }} variant="contained">
          Login
        </Button>
        {userId !== 0 && <Navigate to="/topics" replace={true} />}
        {taken || (
          <p style={{ color: "red" }}>
            Username does not exist. Please register instead.
          </p>
        )}
        {hasOtherError && <p style={{ color: "red" }}>{otherError}</p>}
        <p>
          First time user? <Link to="/register">Register</Link> here instead.
        </p>
      </Box>
    </Box>
  );
}

export default Login;
