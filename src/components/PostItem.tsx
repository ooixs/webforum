import { Card, CardContent } from "@mui/material";
import Topic from "../types/Topic";

type Props = {
  username: string;
  topic: Topic;
  heading: string;
  content: string;
};

function PostItem({ username, topic, heading, content }: Props) {
  return (
    <div>
      <Card>
        <CardContent>
          <h2>{topic.topic}</h2>
          <h2>Time now: {new Date().toLocaleTimeString()}</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostItem;
