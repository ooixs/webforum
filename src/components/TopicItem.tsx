import { Card, CardContent } from "@mui/material";
import Topic from "../types/Topic";

type Props = {
  topic: Topic;
};

function TopicItem({ topic }: Props) {
  return (
    <div>
      <Card>
        <CardContent>
          <h2>{topic.topic}</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default TopicItem;
