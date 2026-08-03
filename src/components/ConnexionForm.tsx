"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./ConnexionForm.module.css";

export function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    startTransition(async () => {
      const resultat = await signIn("credentials", {
        email,
        motDePasse,
        redirect: false,
      });

      if (resultat?.error) {
        setErreur("Identifiants incorrects.");
        return;
      }

      router.push(searchParams.get("callbackUrl") ?? "/");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formulaire}>
      <div>
        <label htmlFor="email" className={styles.champ}>
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.saisie}
        />
      </div>
      <div>
        <label htmlFor="motDePasse" className={styles.champ}>
          Mot de passe
        </label>
        <input
          id="motDePasse"
          type="password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className={styles.saisie}
        />
      </div>
      {erreur && <p className={styles.erreur}>{erreur}</p>}
      <button type="submit" disabled={isPending} className={styles.bouton}>
        {isPending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
