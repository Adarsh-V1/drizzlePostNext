import { createAuthClient } from "better-auth/react";

import { publicEnv } from "@/lib/env";

export const { signIn, signOut, useSession, signUp } = createAuthClient({
  baseURL: publicEnv.NEXT_PUBLIC_APP_URL,
});
