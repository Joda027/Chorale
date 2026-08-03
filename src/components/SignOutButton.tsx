"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/connexion" })}
      className="text-sm text-white/80 hover:text-white underline"
    >
      Se déconnecter
    </button>
  );
}
