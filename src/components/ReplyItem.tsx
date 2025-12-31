import Post from "../types/Post";

type Props = {
  username: string;
  post: Post;
  content: string;
};

function ReplyItem({ username, post, content }: Props) {
  return (
    <div>
      <h3>Reply by: {username}</h3>
      <p>{content}</p>
      <p>In response to post titled: {post.heading}</p>
    </div>
  );
}

export default ReplyItem;
