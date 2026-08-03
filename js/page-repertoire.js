const LABELS_PUPITRE = {
  SOPRANO: "Soprano",
  ALTO: "Alto",
  TENOR: "Ténor",
  BASSE: "Basse",
};

async function chargerRepertoire() {
  const liste = document.getElementById("liste-chants");

  const { data: chants, error } = await supabaseClient
    .from("chants")
    .select("id, titre, compositeur, pupitre_cible, chants_tags(tags(nom))")
    .order("titre", { ascending: true });

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement du répertoire.</p>`;
    console.error(error);
    return;
  }

  if (!chants || chants.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucun chant enregistré pour le moment.</p>`;
    return;
  }

  liste.innerHTML = chants
    .map((chant) => {
      const tags = (chant.chants_tags || []).map((ct) => ct.tags?.nom).filter(Boolean);
      return `
        <li class="carte">
          <div class="carte-ligne">
            <span class="carte-titre">${chant.titre}</span>
            ${
              chant.pupitre_cible
                ? `<span class="badge badge-bleu">${LABELS_PUPITRE[chant.pupitre_cible] ?? chant.pupitre_cible}</span>`
                : ""
            }
          </div>
          ${chant.compositeur ? `<p class="carte-info">${chant.compositeur}</p>` : ""}
          ${
            tags.length > 0
              ? `<div class="etiquette-groupe">${tags.map((t) => `<span class="etiquette">${t}</span>`).join("")}</div>`
              : ""
          }
        </li>`;
    })
    .join("");
}

chargerRepertoire();
