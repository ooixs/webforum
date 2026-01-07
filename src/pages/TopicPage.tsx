import { useEffect, useState } from "react";
import Topic from "../types/Topic";
import TopicItem from "../components/TopicItem";

function TopicPage() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    async function fetchTopics() {
      const res = await fetch("/api/topics");
      if (!res.ok) {
        const err = await res.text();
        console.error("Error:", res.status, err);
      } else {
        const data = await res.json();
        setTopics(data);
      }
    }
    fetchTopics();
  }, []);

  return (
    <div>
      <h1>Topics</h1>
      {topics.map((topic) => (
        <TopicItem key={topic.id} topic={topic} />
      ))}
    </div>
  );
}

export default TopicPage;
