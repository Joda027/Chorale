import { Suspense } from "react";
import { ConnexionForm } from "@/components/ConnexionForm";

export default function ConnexionPage() {
  return (
    <main className="page">
      <h1 className="page-title">Connexion</h1>
      <Suspense>
        <ConnexionForm />
      </Suspense>
    </main>
  );
}
