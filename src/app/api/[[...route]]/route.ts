import {Hono} from 'hono'

import { handle } from "hono/vercel"

export const runtime = "nodejs"

import users from "./users"

const app = new Hono().basePath('/api')

const apiRoutes = app
    .route("/users/", users)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

export type AppType = typeof apiRoutes;
