import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";
import { publicEnv } from "@/lib/env";

export const client = hc<AppType>(publicEnv.NEXT_PUBLIC_APP_URL);
