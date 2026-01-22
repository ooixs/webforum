import { Card, CardContent, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import Topic from "../types/Topic";
import { JSX } from "react";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import MemoryIcon from "@mui/icons-material/Memory";
import { blue } from "@mui/material/colors";

type Props = {
  topic: Topic;
};
type IconMapping = Record<string, JSX.Element>;

//Creates the template for a topic component
function TopicItem({ topic }: Props) {
  const iconStyles = { fontSize: "60px", color: blue[500] };

  //Defining the icon types for the respective topics
  const iconMap: IconMapping = {
    techIcon: <MemoryIcon sx={iconStyles} />,
    gamesIcon: <SportsEsportsIcon sx={iconStyles} />,
    lifestyleIcon: <SportsHandballIcon sx={iconStyles} />,
    musicIcon: <MusicNoteIcon sx={iconStyles} />,
    automotiveIcon: <DirectionsCarIcon sx={iconStyles} />,
    cultureIcon: <Diversity2Icon sx={iconStyles} />,
  };

  return (
    <Grid size={4}>
      {/* Clicking anywhere on the topic component would bring them to the respective post section of the topic */}
      <Link to={`/posts/${topic.id}`} style={{ textDecoration: "none" }}>
        <Card
          sx={{
            "&:hover": {
              backgroundColor: "#242424",
            },
          }}
        >
          <CardContent>
            {iconMap[topic.topic_icon]}
            <h2 style={{ marginBottom: 0 }}>{topic.topic}</h2>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

export default TopicItem;
