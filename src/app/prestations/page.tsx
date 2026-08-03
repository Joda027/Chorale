import { prisma } from "@/lib/prisma";

const LABELS_TYPE: Record<string, string> = {
  MESSE: "Messe",
  MARIAGE: "Mariage",
  FUNERAILLES: "Funérailles",
  CONCERT: "Concert",
  AUTRE: "Autre",
};

export default async function PrestationsPage() {
  const prestations = await prisma.prestation.findMany({
    include: { chants: { include: { chant: true }, orderBy: { ordre: "asc" } } },
    orderBy: { date: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Prestations</h1>
      {prestations.length === 0 ? (
        <p className="text-gray-500">Aucune prestation enregistrée.</p>
      ) : (
        <ul className="space-y-3">
          {prestations.map((prestation) => (
            <li
              key={prestation.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{prestation.titre}</span>
                <span className="text-xs rounded-full bg-sky-100 text-sky-800 px-2 py-1">
                  {LABELS_TYPE[prestation.typeEvenement]}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {prestation.date.toLocaleDateString("fr-FR")}
                {prestation.lieu ? ` — ${prestation.lieu}` : ""}
              </p>
              {prestation.chants.length > 0 && (
                <ol className="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-0.5">
                  {prestation.chants.map((pc) => (
                    <li key={pc.id}>{pc.chant.titre}</li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
