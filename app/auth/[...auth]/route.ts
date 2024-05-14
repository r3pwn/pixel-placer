import { redirect } from "next/navigation";
import { client, auth } from "@/providers/edgedb";
import e from "@/dbschema/edgeql-js";

export const { GET, POST } = auth.createAuthRouteHandlers({
  async onBuiltinUICallback({ error, tokenData, isSignUp }) {
    if (isSignUp && tokenData) {
      await e
        .insert(e.User, {
          name: "",
          identity: e.assert_exists(
            e.select(e.ext.auth.Identity, (identity) => ({
              filter_single: { id: tokenData.identity_id },
            }))
          ),
          bank: e.insert(e.PixelBank, {
            currentPixels: 1,
            last_awarded_at: new Date(),
          }),
        })
        .run(client);
    }
    redirect("/");
  },
  onSignout() {
    redirect("/");
  },
});
