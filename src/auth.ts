import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        motDePasse: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const motDePasse = credentials?.motDePasse as string | undefined;
        if (!email || !motDePasse) return null;

        const membre = await prisma.membre.findUnique({
          where: { email },
          include: { roles: true },
        });
        if (!membre || membre.statut !== "ACTIF") return null;

        const motDePasseValide = await bcrypt.compare(
          motDePasse,
          membre.motDePasse,
        );
        if (!motDePasseValide) return null;

        return {
          id: membre.id,
          email: membre.email,
          name: `${membre.prenom} ${membre.nom}`,
          pupitre: membre.pupitre ?? undefined,
          roles: membre.roles
            .filter((r) => !r.dateFin)
            .map((r) => r.role),
        };
      },
    }),
  ],
});
