import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import Topic from "../types/Topic";

type Props = {
  topic: Topic;
};

function TopicItem({ topic }: Props) {
  return (
    <Link to={`/posts/${topic.id}`} style={{ textDecoration: "none" }}>
      <Card>
        <CardContent>
          <h2>{topic.topic}</h2>
        </CardContent>
      </Card>
    </Link>
  );
}

export default TopicItem;
