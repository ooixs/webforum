import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  //User can only log in if the username exists, setting to true will ensure error only comes out if username does not exist
  const [taken, setTaken] = useState(true);

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
      <Button sx={{ mt: 2 }} variant="contained">
        Login
      </Button>
      <br />
      <p style={{ color: "red" }}>
        {taken ? "" : "Username does not exist. Please register instead."}
      </p>
      <p>
        First time user? <Link to="/register">Register</Link> here instead.
      </p>
    </div>
  );
}

export default Login;
