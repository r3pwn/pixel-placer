import Canvas from "@/components/Canvas";
import { auth } from "@/providers/edgedb";
// import Link from "next/link";

export default async function Home() {
  const session = auth.getSession();
  const isSignedIn = await session.isSignedIn();

  return (
    <div>
      {/*!isSignedIn && (
        <Link href={auth.getBuiltinUIUrl()} className="text-blue-500">
          Sign in
        </Link>
      )*/}
      <Canvas readonly={!isSignedIn} />
    </div>
  );
}
