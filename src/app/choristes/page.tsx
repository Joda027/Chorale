import { prisma } from "@/lib/prisma";

const LABELS_PUPITRE: Record<string, string> = {
  SOPRANO: "Soprano",
  ALTO: "Alto",
  TENOR: "Ténor",
  BASSE: "Basse",
};

const LABELS_ROLE: Record<string, string> = {
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
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Choristes</h1>
      <div className="space-y-8">
        {Object.entries(parPupitre).map(([pupitre, membresGroupe]) => (
          <section key={pupitre}>
            <h2 className="text-lg font-semibold text-sky-800 mb-3">
              {LABELS_PUPITRE[pupitre] ?? "Sans pupitre assigné"}
            </h2>
            <ul className="space-y-2">
              {membresGroupe.map((membre) => (
                <li
                  key={membre.id}
                  className="rounded-lg border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-2"
                >
                  <span>
                    {membre.prenom} {membre.nom}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {membre.roles.map((r) => (
                      <span
                        key={r.id}
                        className="text-xs rounded-full bg-gray-100 text-gray-600 px-2 py-1"
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
          <p className="text-gray-500">Aucun choriste enregistré.</p>
        )}
      </div>
    </main>
  );
}
