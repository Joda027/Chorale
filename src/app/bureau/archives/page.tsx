import { prisma } from "@/lib/prisma";

const LABELS_TYPE: Record<string, string> = {
  PV_REUNION: "PV de réunion",
  COMPTE_RENDU: "Compte-rendu",
  COURRIER: "Courrier",
  AUTRE: "Autre",
};

export default async function ArchivesPage() {
  const documents = await prisma.document.findMany({
    include: { uploadePar: true },
    orderBy: { dateDocument: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Archives du bureau</h1>
      {documents.length === 0 ? (
        <p className="text-gray-500">Aucun document archivé.</p>
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="rounded-lg border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-2"
            >
              <div>
                <a
                  href={doc.fichierUrl}
                  className="font-medium text-sky-700 hover:underline"
                >
                  {doc.titre}
                </a>
                <p className="text-sm text-gray-500">
                  {LABELS_TYPE[doc.type]} — déposé par {doc.uploadePar.prenom}{" "}
                  {doc.uploadePar.nom}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {doc.dateDocument.toLocaleDateString("fr-FR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
