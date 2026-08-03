const LABELS_STATUT = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

const CLASSES_STATUT = {
  A_FAIRE: "badge-attente",
  EN_COURS: "badge-en-cours",
  TERMINE: "badge-termine",
  ANNULE: "badge-annule",
};

async function chargerPlanAction() {
  const acces = await exigerBureau();
  if (!acces) return;

  const liste = document.getElementById("liste-actions");

  const { data: actions, error } = await supabaseClient
    .from("plan_action")
    .select(
      "id, titre, description, date_echeance, statut, responsable:profils(prenom, nom)",
    )
    .order("date_echeance", { ascending: true });

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement du plan d'action.</p>`;
    console.error(error);
    return;
  }

  if (!actions || actions.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucune action planifiée.</p>`;
    return;
  }

  liste.innerHTML = actions
    .map((action) => {
      const responsable = action.responsable
        ? `Responsable : ${action.responsable.prenom} ${action.responsable.nom}`
        : "Responsable non assigné";
      const echeance = action.date_echeance
        ? ` — échéance ${new Date(action.date_echeance).toLocaleDateString("fr-FR")}`
        : "";

      return `
        <li class="carte">
          <div class="carte-ligne">
            <span class="carte-titre">${action.titre}</span>
            <span class="badge ${CLASSES_STATUT[action.statut] ?? "badge-gris"}">${LABELS_STATUT[action.statut] ?? action.statut}</span>
          </div>
          ${action.description ? `<p class="carte-info">${action.description}</p>` : ""}
          <p class="carte-description">${responsable}${echeance}</p>
        </li>`;
    })
    .join("");
}

chargerPlanAction();
