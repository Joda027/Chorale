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
    <main className="page">
      <h1 className="page-title">Activités</h1>
      {activites.length === 0 ? (
        <p className="etat-vide">Aucune activité enregistrée.</p>
      ) : (
        <ul className="liste">
          {activites.map((activite) => (
            <li key={activite.id} className="carte">
              <div className="carte-ligne">
                <span className="carte-titre">{activite.titre}</span>
                <span className="badge badge-bleu">
                  {LABELS_TYPE[activite.type]}
                </span>
              </div>
              <p className="carte-info">
                {activite.dateDebut.toLocaleDateString("fr-FR")}
                {activite.lieu ? ` — ${activite.lieu}` : ""}
              </p>
              {activite.description && (
                <p className="carte-description">{activite.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
