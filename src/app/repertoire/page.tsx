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
    <main className="page">
      <h1 className="page-title">Répertoire de chants</h1>
      {chants.length === 0 ? (
        <p className="etat-vide">Aucun chant enregistré pour le moment.</p>
      ) : (
        <ul className="liste">
          {chants.map((chant) => (
            <li key={chant.id} className="carte">
              <div className="carte-ligne">
                <span className="carte-titre">{chant.titre}</span>
                {chant.pupitreCible && (
                  <span className="badge badge-bleu">
                    {LABELS_PUPITRE[chant.pupitreCible]}
                  </span>
                )}
              </div>
              {chant.compositeur && (
                <p className="carte-info">{chant.compositeur}</p>
              )}
              {chant.tags.length > 0 && (
                <div className="etiquette-groupe">
                  {chant.tags.map((tag) => (
                    <span key={tag.id} className="etiquette">
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
