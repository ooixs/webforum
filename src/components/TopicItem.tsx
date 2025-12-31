type Props = {
  topic: string;
};

function TopicItem({ topic }: Props) {
  return (
    <div>
      <h2>{topic}</h2>
    </div>
  );
}

export default TopicItem;
