import { Box, Button, Card, CardContent, Grid } from "@mui/material";
import { blue, red } from "@mui/material/colors";

type Props = {
  type: string;
  handleYes: () => void;
  handleNo: () => void;
};

function Confirmation({ type, handleYes, handleNo }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
    >
      <Card
        sx={{
          position: "fixed",
          top: "40%",
          left: "40%",
          width: "20%",
          height: "20%",
          backgroundColor: "#191919",
          backgroundImage: "none",
        }}
      >
        <CardContent>
          <Grid container>
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
