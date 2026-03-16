import { env } from "@/lib/env";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.username === env.ADMIN_USERNAME &&
          credentials?.password === env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "AI News Admin" };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET
};
