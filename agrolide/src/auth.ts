import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Find user
        const userRows = await db.select().from(users).where(eq(users.email, credentials.email as string)).limit(1)
        const user = userRows[0]
        
        if (!user || !user.password_hash) return null
        
        // Verify password
        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password_hash)
        if (passwordsMatch) return user
        
        return null
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
})
