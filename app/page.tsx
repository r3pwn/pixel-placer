import Canvas from "@/components/Canvas";
import { auth } from "@/providers/edgedb";
// import Link from "next/link";

export default async function Home() {
  const session = auth.getSession();
  const isSignedIn = await session.isSignedIn();

  return (
    <div>
      <Canvas isLoggedIn={isSignedIn} authUrl={auth.getBuiltinUIUrl()} />
    </div>
  );
}
