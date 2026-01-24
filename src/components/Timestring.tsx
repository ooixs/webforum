import { Box } from '@mui/material';

type Props = {
  time: string;
};

//Formats a timestamp into a more readable format
function Timestring({ time }: Props) {
  const date = new Date(time);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <Box component="span">
      {formattedDate} at {formattedTime}
    </Box>
  );
}

export default Timestring;
