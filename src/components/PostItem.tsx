import { Card, CardContent } from "@mui/material";
import Post from "../types/Post";

type Props = {
  post: Post;
  username: string;
};

function PostItem({ post, username }: Props) {
  return (
    <div>
      <Card>
        <CardContent>
          <h2>{post.heading}</h2>
          <p>{post.content}</p>
          <p>{post.time_created}</p>
          <p>By: {username}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostItem;
