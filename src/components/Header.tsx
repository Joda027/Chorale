import Link from "next/link";
import { auth } from "@/auth";
import { estMembreDuBureau } from "@/lib/rbac";
import { SignOutButton } from "@/components/SignOutButton";

export async function Header() {
  const session = await auth();
  const roles = session?.user?.roles ?? [];

  const liens = [
    { href: "/", label: "Accueil" },
    { href: "/repertoire", label: "Répertoire" },
    { href: "/choristes", label: "Choristes" },
    { href: "/activites", label: "Activités" },
    { href: "/prestations", label: "Prestations" },
  ];

  if (estMembreDuBureau(roles)) {
    liens.push({ href: "/bureau", label: "Bureau" });
  }

  return (
    <header className="bg-sky-700 text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="font-semibold tracking-tight">
          Chorale Saint Patrick
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm">
          {liens.map((lien) => (
            <Link key={lien.href} href={lien.href} className="hover:underline">
              {lien.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-white/90">{session.user.name}</span>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/connexion" className="hover:underline">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
