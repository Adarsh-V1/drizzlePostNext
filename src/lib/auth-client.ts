import { createAuthClient } from "better-auth/react"

export const {
    signIn,
    signOut,
    useSession,
    signUp,
} = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL!,
})