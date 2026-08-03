import { prisma } from "@/lib/prisma";

const LABELS_PUPITRE: Record<string, string> = {
  SOPRANO: "Soprano",
  ALTO: "Alto",
  TENOR: "Ténor",
  BASSE: "Basse",
};

export default async function RepertoirePage() {
  const chants = await prisma.chant.findMany({
    include: { tags: true },
    orderBy: { titre: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Répertoire de chants</h1>
      {chants.length === 0 ? (
        <p className="text-gray-500">Aucun chant enregistré pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {chants.map((chant) => (
            <li
              key={chant.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{chant.titre}</span>
                {chant.pupitreCible && (
                  <span className="text-xs rounded-full bg-sky-100 text-sky-800 px-2 py-1">
                    {LABELS_PUPITRE[chant.pupitreCible]}
                  </span>
                )}
              </div>
              {chant.compositeur && (
                <p className="text-sm text-gray-500 mt-1">
                  {chant.compositeur}
                </p>
              )}
              {chant.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {chant.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs rounded bg-gray-100 text-gray-600 px-2 py-0.5"
                    >
                      {tag.nom}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
