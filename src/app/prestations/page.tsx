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
    <main className="page">
      <h1 className="page-title">Prestations</h1>
      {prestations.length === 0 ? (
        <p className="etat-vide">Aucune prestation enregistrée.</p>
      ) : (
        <ul className="liste">
          {prestations.map((prestation) => (
            <li key={prestation.id} className="carte">
              <div className="carte-ligne">
                <span className="carte-titre">{prestation.titre}</span>
                <span className="badge badge-bleu">
                  {LABELS_TYPE[prestation.typeEvenement]}
                </span>
              </div>
              <p className="carte-info">
                {prestation.date.toLocaleDateString("fr-FR")}
                {prestation.lieu ? ` — ${prestation.lieu}` : ""}
              </p>
              {prestation.chants.length > 0 && (
                <ol className="liste-ordonnee">
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
