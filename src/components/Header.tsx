import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { estMembreDuBureau } from "@/lib/rbac";
import { SignOutButton } from "@/components/SignOutButton";
import styles from "./Header.module.css";

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
    <header className={styles.entete}>
      <div className={styles.conteneur}>
        <Link href="/" className={styles.marque}>
          <Image
            src="/logo.png"
            alt="Logo de la Chorale Saint Patrick"
            width={36}
            height={36}
            className={styles.logo}
          />
          Chorale Saint Patrick
        </Link>
        <nav className={styles.nav}>
          {liens.map((lien) => (
            <Link key={lien.href} href={lien.href}>
              {lien.label}
            </Link>
          ))}
        </nav>
        <div className={styles.compte}>
          {session?.user ? (
            <div className={styles.compteConnecte}>
              <span className={styles.nomUtilisateur}>
                {session.user.name}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/connexion" className={styles.lienConnexion}>
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
