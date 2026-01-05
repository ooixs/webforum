import Post from "../types/Post";
import { Card, CardContent } from "@mui/material";

type Props = {
  username: string;
  post: Post;
  content: string;
};

function ReplyItem({ username, post, content }: Props) {
  return (
    <div>
      <Card>
        <CardContent>
          <h3>Reply by: {username}</h3>
          <p>{content}</p>
          <p>In response to post titled: {post.heading}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReplyItem;
