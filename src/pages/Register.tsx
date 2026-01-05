import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [taken, setTaken] = useState(false);

  return (
    <div>
      <h1>Register</h1>
      <TextField
        label="username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <Button sx={{ mt: 2 }} variant="contained">
        Register
      </Button>
      <p style={{ color: "red" }}>
        {taken ? "Username is taken. Please choose another username" : ""}
      </p>
      <p>
        Registered? <Link to="/login">Login</Link> here instead.
      </p>
    </div>
  );
}

export default Register;
