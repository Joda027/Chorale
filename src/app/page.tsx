import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Accueil() {
  const [prochainesPrestations, chantsCount, membresCount] =
    await Promise.all([
      prisma.prestation.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 3,
      }),
      prisma.chant.count(),
      prisma.membre.count({ where: { statut: "ACTIF" } }),
    ]);

  return (
    <main className="page">
      <section className="section">
        <h1 className="accueil-titre">Chorale Saint Patrick</h1>
        <p className="accueil-sous-titre">
          Paroisse Saint-Cyprien — Archidiocèse de Conakry
        </p>
      </section>

      <section className="section grille-stats">
        <div className="carte">
          <p className="stat-libelle">Choristes actifs</p>
          <p className="stat-valeur">{membresCount}</p>
        </div>
        <div className="carte">
          <p className="stat-libelle">Chants au répertoire</p>
          <p className="stat-valeur">{chantsCount}</p>
        </div>
        <div className="carte">
          <p className="stat-libelle">Prestations à venir</p>
          <p className="stat-valeur">{prochainesPrestations.length}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Prochaines prestations</h2>
        {prochainesPrestations.length === 0 ? (
          <p className="etat-vide">Aucune prestation programmée.</p>
        ) : (
          <ul className="liste-serree">
            {prochainesPrestations.map((prestation) => (
              <li key={prestation.id} className="carte carte-ligne">
                <span className="carte-titre">{prestation.titre}</span>
                <span className="texte-attenue">
                  {prestation.date.toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/prestations" className="lien-suite">
          Voir toutes les prestations →
        </Link>
      </section>
    </main>
  );
}
