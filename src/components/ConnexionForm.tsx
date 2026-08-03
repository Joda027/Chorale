"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="motDePasse" className="block text-sm font-medium mb-1">
          Mot de passe
        </label>
        <input
          id="motDePasse"
          type="password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
      {erreur && <p className="text-sm text-red-600">{erreur}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-sky-700 text-white py-2 font-medium hover:bg-sky-800 disabled:opacity-60"
      >
        {isPending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
