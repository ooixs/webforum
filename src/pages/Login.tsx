import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  //User can only log in if the username exists, setting to true will ensure error only comes out if username does not exist
  const [taken, setTaken] = useState(true);
  const [hasOtherError, setHasOtherError] = useState(false);
  const [otherError, setOtherError] = useState("");

  async function handleClick() {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    });
    if (!res.ok) {
      const err = await res.text();
      if (err.startsWith("User not found")) {
        setTaken(false);
      } else {
        setHasOtherError(true);
        setOtherError(err);
      }
      console.error("Error:", res.status, res.statusText);
    } else {
      setTaken(true);
      const data = await res.json();
      console.log(data);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <TextField
        label="username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <Button onClick={handleClick} sx={{ mt: 2 }} variant="contained">
        Login
      </Button>
      <br />
      <p style={{ color: "red" }}>
        {taken ? "" : "Username does not exist. Please register instead."}
        {hasOtherError ? otherError : ""}
      </p>
      <p>
        First time user? <Link to="/register">Register</Link> here instead.
      </p>
    </div>
  );
}

export default Login;
