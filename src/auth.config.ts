import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/generated/prisma/enums";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.roles = user.roles;
        token.pupitre = user.pupitre;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.roles = (token.roles as Role[]) ?? [];
        session.user.pupitre = token.pupitre as string | undefined;
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
