import { Button, TextField, Box } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [taken, setTaken] = useState(false);
  const [hasOtherError, setHasOtherError] = useState(false);
  const [otherError, setOtherError] = useState("");
  const [userId, setUserId] = useState(0);

  async function handleClick() {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    });
    if (!res.ok) {
      const err = await res.text();
      if (err.startsWith("Username already taken")) {
        setTaken(true);
      } else {
        setHasOtherError(true);
        setOtherError(err);
      }
      console.error("Error:", res.status, res.statusText);
    } else {
      const data = await res.json();
      setUserId(data);
      sessionStorage.setItem("userId", data.toString());
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
        <h1>Register</h1>
        <TextField
          label="username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={handleClick} sx={{ mt: 2 }} variant="contained">
          Register
        </Button>
        {userId !== 0 && <Navigate to="/topics" replace={true} />}
        <p style={{ color: "red" }}>
          {taken ? "Username is taken. Please choose another username." : ""}
          {hasOtherError ? otherError : ""}
        </p>
        <p>
          Registered? <Link to="/">Login</Link> here instead.
        </p>
      </Box>
    </Box>
  );
}

export default Register;
