import { Button, TextField } from "@mui/material";

function Register() {
  return (
    <div>
      <h1>Register</h1>
      <TextField label="username" variant="outlined" />
      <br />
      <Button sx={{ mt: 2 }} variant="contained">
        Register
      </Button>
    </div>
  );
}

export default Register;
