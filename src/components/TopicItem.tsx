import { Card, CardContent } from "@mui/material";

type Props = {
  topic: string;
};

function TopicItem({ topic }: Props) {
  return (
    <div>
      <Card>
        <CardContent>
          <h2>{topic}</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default TopicItem;
