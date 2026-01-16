type Post = {
  id: number;
  user_id: number;
  topic_id: number;
  heading: string;
  content: string;
  time_created: string;
  edited: boolean;
};

export default Post;
