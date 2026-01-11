import { Card, CardContent, Box } from "@mui/material";
import Reply from "../types/Reply";
import User from "../types/User";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, yellow } from "@mui/material/colors";

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
    <Box>
      <Card>
        <CardContent>
          <p>{reply.content}</p>
          <p>{reply.time_created}</p>
          <p>By: {user.username}</p>
          {byUser && (
            <div>
              <IconButton
                aria-label="Edit Reply"
                sx={{
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
                  color: red[500],
                  "&:hover": {
                    color: red[700],
                  },
                }}
                onClick={() => deleteReply(reply.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </CardContent>
      </Card>
      <hr />
    </Box>
  );
}

export default ReplyItem;
