import { prisma } from "@/lib/prisma";

const LABELS_TYPE: Record<string, string> = {
  REPETITION: "Répétition",
  RETRAITE: "Retraite",
  FORMATION: "Formation",
  AUTRE: "Autre",
};

export default async function ActivitesPage() {
  const activites = await prisma.activite.findMany({
    orderBy: { dateDebut: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Activités</h1>
      {activites.length === 0 ? (
        <p className="text-gray-500">Aucune activité enregistrée.</p>
      ) : (
        <ul className="space-y-3">
          {activites.map((activite) => (
            <li
              key={activite.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{activite.titre}</span>
                <span className="text-xs rounded-full bg-sky-100 text-sky-800 px-2 py-1">
                  {LABELS_TYPE[activite.type]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {activite.dateDebut.toLocaleDateString("fr-FR")}
                {activite.lieu ? ` — ${activite.lieu}` : ""}
              </p>
              {activite.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {activite.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
