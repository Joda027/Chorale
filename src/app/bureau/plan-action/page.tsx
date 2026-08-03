import { prisma } from "@/lib/prisma";

const LABELS_STATUT: Record<string, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

const CLASSES_STATUT: Record<string, string> = {
  A_FAIRE: "badge-attente",
  EN_COURS: "badge-en-cours",
  TERMINE: "badge-termine",
  ANNULE: "badge-annule",
};

export default async function PlanActionPage() {
  const actions = await prisma.planAction.findMany({
    include: { responsable: true },
    orderBy: { dateEcheance: "asc" },
  });

  return (
    <main className="page">
      <h1 className="page-title">Plan d&apos;action</h1>
      {actions.length === 0 ? (
        <p className="etat-vide">Aucune action planifiée.</p>
      ) : (
        <ul className="liste">
          {actions.map((action) => (
            <li key={action.id} className="carte">
              <div className="carte-ligne">
                <span className="carte-titre">{action.titre}</span>
                <span className={`badge ${CLASSES_STATUT[action.statut]}`}>
                  {LABELS_STATUT[action.statut]}
                </span>
              </div>
              {action.description && (
                <p className="carte-info">{action.description}</p>
              )}
              <p className="carte-description">
                {action.responsable
                  ? `Responsable : ${action.responsable.prenom} ${action.responsable.nom}`
                  : "Responsable non assigné"}
                {action.dateEcheance
                  ? ` — échéance ${action.dateEcheance.toLocaleDateString("fr-FR")}`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
