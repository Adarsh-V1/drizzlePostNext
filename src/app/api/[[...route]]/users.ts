
import { Hono } from 'hono'
import { db } from '@/db/drizzle'



const app = new Hono()
    .post(
        "/users",
    )



export default app;