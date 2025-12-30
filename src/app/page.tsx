import GravityZone from "@/components/GravityZone";
import { resources } from "@/data/resources";

export default function Home() {
  return (
    <main className="w-full h-screen relative overflow-hidden">
      <GravityZone resources={resources} />
    </main>
  );
}
