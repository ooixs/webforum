import { Grid, Box } from "@mui/material";
import Reply from "../types/Reply";
import User from "../types/User";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, yellow, grey } from "@mui/material/colors";

type Props = {
  reply: Reply;
  user: User;
  updateReply: (reply: Reply) => void;
  deleteReply: (replyId: number) => Promise<void>;
};

function ReplyItem({ reply, user, updateReply, deleteReply }: Props) {
  const userId = sessionStorage.getItem("userId");
  const byUser = Number(userId) === reply.user_id;

  return (
    <Box
      sx={{
        paddingLeft: 2,
      }}
    >
      <Grid
        container
        sx={{
          position: "relative",
          backgroundColor: "#191919",
          backgroundImage: "none",
          textAlign: "left",
          paddingLeft: 3,
          borderLeft: "2px solid #555555",
        }}
      >
        <Grid size={12}>
          <p
            style={{
              color: grey[300],
              fontSize: "15px",
              marginTop: 5,
              marginBottom: 0,
            }}
          >
            {reply.content}
          </p>
        </Grid>
        <Grid size={10.5}>
          <p style={{ color: grey[500], fontFamily: "Lato" }}>
            Replied by <i>{user.username}</i> on {reply.time_created}
            {reply.edited ? " (Edited)" : ""}
          </p>
        </Grid>
        <Grid size={1.5}>
          {byUser && (
            <Box sx={{ display: "flex", gap: "5px", marginTop: 1 }}>
              <IconButton
                aria-label="Edit Reply"
                sx={{
                  zIndex: 1,
                  position: "relative",
                  backgroundColor: "#303030",
                  color: yellow[500],
                  "&:hover": {
                    color: yellow[700],
                  },
                }}
                onClick={() => updateReply(reply)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="Delete Reply"
                sx={{
                  zIndex: 1,
                  position: "relative",
                  backgroundColor: "#303030",
                  color: red[500],
                  "&:hover": {
                    color: red[700],
                  },
                }}
                onClick={() => deleteReply(reply.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Grid>
      </Grid>
      <hr />
    </Box>
  );
}

export default ReplyItem;
