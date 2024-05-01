import Canvas from "@/components/Canvas";
import { auth } from "@/providers/edgedb";
import Link from "next/link";

export default async function Home() {
  const session = auth.getSession();
  const isSignedIn = await session.isSignedIn();

  return (
    <div className="container mx-auto p-4 bg-black text-white">
      {!isSignedIn && (
        <Link href={auth.getBuiltinUIUrl()} className="text-blue-500">
          Sign in
        </Link>
      )}
      <h1 className="text-3xl font-bold mb-4">Canvas</h1>
      <Canvas readonly={!isSignedIn} />
    </div>
  );
}
