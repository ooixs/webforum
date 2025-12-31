import Post from "./Post";

type Reply = {
  username: string;
  post: Post;
  content: string;
  timestamp: string;
};

export default Reply;
