import GravityZone from "@/components/GravityZone";
import { resources } from "@/data/resources";

export default function Home() {
  return (
    <main className="w-full h-screen relative">
      <GravityZone resources={resources} />
    </main>
  );
}