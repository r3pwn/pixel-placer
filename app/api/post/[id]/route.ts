import { NextResponse } from "next/server";
import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  const client = createClient();

  const post = await e
    .select(e.BlogPost, (post) => ({
      id: true,
      title: true,
      content: true,
      filter_single: e.op(post.id, "=", e.uuid(params.id)),
    }))
    .run(client);

  if (!post) {
    return NextResponse.json(
      { message: "No post with the provided ID" },
      { status: 404 }
    );
  }

  return NextResponse.json(post, { status: 200 });
}
