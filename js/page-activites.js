const LABELS_TYPE = {
  REPETITION: "Répétition",
  RETRAITE: "Retraite",
  FORMATION: "Formation",
  AUTRE: "Autre",
};

async function chargerActivites() {
  const session = await exigerConnexion();
  if (!session) return;

  const liste = document.getElementById("liste-activites");

  const { data: activites, error } = await supabaseClient
    .from("activites")
    .select("id, titre, type, date_debut, lieu, description")
    .order("date_debut", { ascending: false });

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement des activités.</p>`;
    console.error(error);
    return;
  }

  if (!activites || activites.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucune activité enregistrée.</p>`;
    return;
  }

  liste.innerHTML = activites
    .map(
      (a) => `
        <li class="carte">
          <div class="carte-ligne">
            <span class="carte-titre">${a.titre}</span>
            <span class="badge badge-bleu">${LABELS_TYPE[a.type] ?? a.type}</span>
          </div>
          <p class="carte-info">
            ${new Date(a.date_debut).toLocaleDateString("fr-FR")}${a.lieu ? ` — ${a.lieu}` : ""}
          </p>
          ${a.description ? `<p class="carte-description">${a.description}</p>` : ""}
        </li>`,
    )
    .join("");
}

chargerActivites();
