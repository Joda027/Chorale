import { prisma } from "@/lib/prisma";

const LABELS_PUPITRE: Record<string, string> = {
  SOPRANO: "Soprano",
  ALTO: "Alto",
  TENOR: "Ténor",
  BASSE: "Basse",
};

const LABELS_ROLE: Record<string, string> = {
  ADMIN: "Administrateur·rice",
  CHORISTE: "Choriste",
  MAITRE_CHOEUR: "Maître de chœur",
  PRESIDENT: "Président·e",
  SECRETAIRE_GENERAL: "Secrétaire général·e",
  TRESORIER: "Trésorier·ère",
  CHARGE_ORGANISATION: "Chargé·e d'organisation",
  CHARGE_SPIRITUEL: "Chargé·e spirituel·le",
  CHARGE_DISCIPLINE: "Chargé·e de discipline",
};

export default async function ChoristesPage() {
  const membres = await prisma.membre.findMany({
    where: { statut: "ACTIF" },
    include: { roles: { where: { dateFin: null } } },
    orderBy: [{ pupitre: "asc" }, { nom: "asc" }],
  });

  const parPupitre = membres.reduce<Record<string, typeof membres>>(
    (acc, membre) => {
      const cle = membre.pupitre ?? "SANS_PUPITRE";
      acc[cle] = acc[cle] ? [...acc[cle], membre] : [membre];
      return acc;
    },
    {},
  );

  return (
    <main className="page">
      <h1 className="page-title">Choristes</h1>
      <div className="liste-groupes">
        {Object.entries(parPupitre).map(([pupitre, membresGroupe]) => (
          <section key={pupitre}>
            <h2 className="groupe-pupitre-titre">
              {LABELS_PUPITRE[pupitre] ?? "Sans pupitre assigné"}
            </h2>
            <ul className="liste-serree">
              {membresGroupe.map((membre) => (
                <li key={membre.id} className="carte carte-ligne">
                  <span>
                    {membre.prenom} {membre.nom}
                  </span>
                  <div className="badge-groupe">
                    {membre.roles.map((r) => (
                      <span
                        key={r.id}
                        className={`badge ${r.role === "ADMIN" ? "badge-admin" : "badge-gris"}`}
                      >
                        {LABELS_ROLE[r.role]}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {membres.length === 0 && (
          <p className="etat-vide">Aucun choriste enregistré.</p>
        )}
      </div>
    </main>
  );
}
