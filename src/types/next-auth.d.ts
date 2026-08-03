import type { DefaultSession } from "next-auth";
import type { Role } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface User {
    roles?: Role[];
    pupitre?: string;
  }

  interface Session {
    user: {
      id: string;
      roles: Role[];
      pupitre?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: Role[];
    pupitre?: string;
  }
}
