import { NextResponse } from "next/server";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

export async function GET() {
  const client = createClient();

  const posts = await e
    .select(e.BlogPost, () => ({
      id: true,
      title: true,
      content: true,
    }))
    .run(client);

  if (!posts) {
    return NextResponse.json(
      { message: "No posts available" },
      { status: 404 }
    );
  }

  return NextResponse.json(posts, { status: 200 });
}
