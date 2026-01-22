import { Box, Button, Card, CardContent, Grid } from "@mui/material";
import { blue, red } from "@mui/material/colors";

type Props = {
  type: string;
  handleYes: () => void;
  handleNo: () => void;
};

//Popup with yes and no buttons to confirm or cancel actions of {type} (types include logout/deleting posts or replies)
function Confirmation({ type, handleYes, handleNo }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Card
        sx={{
          width: "80%",
          maxWidth: "400px",
          backgroundColor: "#191919",
          backgroundImage: "none",
          padding: 2,
        }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={12} sx={{ textAlign: "center" }}>
              <h2>Confirm {type}?</h2>
            </Grid>
            <Grid size={6}>
              <Button
                variant="contained"
                onClick={handleYes}
                sx={{
                  backgroundColor: red[500],
                  "&:hover": { backgroundColor: red[700] },
                }}
              >
                Yes
              </Button>
            </Grid>
            <Grid size={6}>
              <Button
                variant="outlined"
                onClick={handleNo}
                sx={{
                  color: blue[500],
                  "&:hover": { color: blue[700] },
                }}
              >
                No
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Confirmation;
