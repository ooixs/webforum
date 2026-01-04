import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <TextField label="username" variant="outlined" />
      <br />
      <Button sx={{ mt: 2 }} variant="contained">
        Login
      </Button>
      <br />
      <p>
        First time user? <Link to="/register">Register</Link> here instead.
      </p>
    </div>
  );
}

export default Login;
