import ReadingList from "@/components/ReadingList";
import { resources } from "@/data/resources";

export default function Home() {
  return <ReadingList resources={resources} />;
}
