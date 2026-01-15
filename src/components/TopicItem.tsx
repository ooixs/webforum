import { Card, CardContent, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import Topic from "../types/Topic";

type Props = {
  topic: Topic;
};

function TopicItem({ topic }: Props) {
  return (
    <Grid size={4}>
      <Link to={`/posts/${topic.id}`} style={{ textDecoration: "none" }}>
        <Card
          sx={{
            "&:hover": {
              backgroundColor: "#242424",
            },
          }}
        >
          <CardContent>
            <h2>{topic.topic}</h2>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default TopicItem;
