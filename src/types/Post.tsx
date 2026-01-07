import Topic from "./Topic";

type Post = {
  username: string;
  topic: Topic;
  heading: string;
  content: string;
  timestamp: string;
};

export default Post;
