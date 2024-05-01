import { createClient } from "edgedb";
import createAuth from "@edgedb/auth-nextjs/app";

export { default as e } from "@/dbschema/edgeql-js";

export const client = createClient({
  // Set tlsSecurity to "insecure" in dev builds due to self-signed certs
  tlsSecurity: process.env.NODE_ENV === "development" ? "insecure" : undefined,
});

export const auth = createAuth(client, {
  baseUrl: process.env.SITE_BASE as string,
});
