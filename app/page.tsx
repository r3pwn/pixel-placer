import Canvas from "@/components/Canvas";

export default async function Home() {
  return (
    <div className="container mx-auto p-4 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Canvas</h1>
      <Canvas />
    </div>
  );
}
