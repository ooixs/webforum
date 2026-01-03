import React from "react";
import {
  Button,
  Card,
  CardContent,
  Fade,
  Typography,
  TextField,
} from "@mui/material";

function Login() {
  return (
    <div>
      <h1>Login Page</h1>
      <TextField id="user-login" label="username" variant="outlined" />
      <br />
      <Button sx={{ mt: "10px" }} variant="contained">
        Login
      </Button>
    </div>
  );
}

export default Login;
