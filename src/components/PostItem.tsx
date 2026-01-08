import { Card, CardContent } from "@mui/material";
import Post from "../types/Post";

type Props = {
  post: Post;
};

function PostItem({ post }: Props) {
  return (
    <div>
      <Card>
        <CardContent>
          <h2>{post.heading}</h2>
          <p>{post.content}</p>
          <p>{post.time_created}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostItem;
