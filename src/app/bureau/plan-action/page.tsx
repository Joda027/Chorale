import { prisma } from "@/lib/prisma";

const LABELS_STATUT: Record<string, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

const COULEURS_STATUT: Record<string, string> = {
  A_FAIRE: "bg-gray-100 text-gray-700",
  EN_COURS: "bg-amber-100 text-amber-800",
  TERMINE: "bg-green-100 text-green-800",
  ANNULE: "bg-red-100 text-red-800",
};

export default async function PlanActionPage() {
  const actions = await prisma.planAction.findMany({
    include: { responsable: true },
    orderBy: { dateEcheance: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Plan d&apos;action</h1>
      {actions.length === 0 ? (
        <p className="text-gray-500">Aucune action planifiée.</p>
      ) : (
        <ul className="space-y-3">
          {actions.map((action) => (
            <li
              key={action.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{action.titre}</span>
                <span
                  className={`text-xs rounded-full px-2 py-1 ${COULEURS_STATUT[action.statut]}`}
                >
                  {LABELS_STATUT[action.statut]}
                </span>
              </div>
              {action.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {action.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
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
