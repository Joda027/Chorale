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
    <main className="page">
      <h1 className="page-title">Archives du bureau</h1>
      {documents.length === 0 ? (
        <p className="etat-vide">Aucun document archivé.</p>
      ) : (
        <ul className="liste">
          {documents.map((doc) => (
            <li key={doc.id} className="carte carte-ligne">
              <div>
                <a href={doc.fichierUrl} className="carte-titre lien-texte">
                  {doc.titre}
                </a>
                <p className="carte-info">
                  {LABELS_TYPE[doc.type]} — déposé par {doc.uploadePar.prenom}{" "}
                  {doc.uploadePar.nom}
                </p>
              </div>
              <span className="carte-info">
                {doc.dateDocument.toLocaleDateString("fr-FR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
