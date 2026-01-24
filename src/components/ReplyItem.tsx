import { useState } from "react";

import { Grid, Box, Tooltip, IconButton } from "@mui/material";
import { red, yellow, grey, blue } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Reply from "../types/Reply";
import Confirmation from "./Confirmation";

type Props = {
  reply: Reply;
  username: string;
  isOp: boolean;
  updateReply: (reply: Reply) => void;
  deleteReply: (replyId: number) => Promise<void>;
};

//Creates the template for a reply component
function ReplyItem({ reply, username, isOp, updateReply, deleteReply }: Props) {
  const userId = sessionStorage.getItem("userId");
  const byUser = Number(userId) === reply.user_id;

  const [isDeleting, setDeleting] = useState(false);

  //Handles user's choice of whether to delete a reply
  function handleYes() {
    setDeleting(false);
    deleteReply(reply.id);
  }
  function handleNo() {
    setDeleting(false);
  }

  //Triggers when user clicks the delete button on one of their replies
  function handleDelete() {
    setDeleting(true);
  }

  return (
    <Box
      sx={{
        paddingLeft: 2,
      }}
    >
      {/* Creates delete confirmation popup whenever the user wants to delete a reply */}
      {isDeleting && (
        <Confirmation
          type="reply deletion"
          handleYes={handleYes}
          handleNo={handleNo}
        />
      )}

      {/* Creates a reply item */}
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
              fontSize: "15px",
              marginTop: 5,
              marginBottom: 0,
            }}
          >
            {reply.content}
          </p>
        </Grid>
        <Grid size={10.5}>
          <p style={{ color: grey[400], fontFamily: "Lato" }}>
            Replied by <i>{username}</i>{" "}
            {isOp && (
              <Box
                component="span"
                sx={{
                  color: blue[600],
                  fontWeight: "bold",
                  fontSize: "0.85em",
                }}
              >
                [OP]
              </Box>
            )}
            {" • "}
            {reply.time_created}
            {reply.time_edited && " (Edited " + reply.time_edited + ")"}
          </p>
        </Grid>

        {/* Only the replies by the user has an edit and delete button on the post */}
        <Grid size={1.5}>
          {byUser && (
            <Box sx={{ display: "flex", gap: "5px", marginTop: 1 }}>
              <Tooltip title="Edit Reply">
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
              </Tooltip>
              <Tooltip title="Delete Reply">
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
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Grid>
      </Grid>
      <hr />
    </Box>
  );
}

export default ReplyItem;
