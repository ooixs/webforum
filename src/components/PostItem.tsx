import { Card, CardContent } from "@mui/material";

type Props = {
  username: string;
  topic: string;
  heading: string;
  content: string;
};

function PostItem({ username, topic, heading, content }: Props) {
  return (
    <div>
      <Card>
        <CardContent>
          <h2>{topic}</h2>
          <h2>Time now: {new Date().toLocaleTimeString()}</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostItem;
