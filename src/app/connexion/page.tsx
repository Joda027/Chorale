import { Suspense } from "react";
import { ConnexionForm } from "@/components/ConnexionForm";

export default function ConnexionPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Connexion</h1>
      <Suspense>
        <ConnexionForm />
      </Suspense>
    </main>
  );
}
