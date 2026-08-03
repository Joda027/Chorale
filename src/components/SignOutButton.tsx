"use client";

import { signOut } from "next-auth/react";
import styles from "./SignOutButton.module.css";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/connexion" })}
      className={styles.bouton}
    >
      Se déconnecter
    </button>
  );
}
