const LABELS_TYPE = {
  MESSE: "Messe",
  MARIAGE: "Mariage",
  FUNERAILLES: "Funérailles",
  CONCERT: "Concert",
  AUTRE: "Autre",
};

async function chargerPrestations() {
  const session = await exigerConnexion();
  if (!session) return;

  const liste = document.getElementById("liste-prestations");

  const { data: prestations, error } = await supabaseClient
    .from("prestations")
    .select(
      "id, titre, type_evenement, date, lieu, prestations_chants(ordre, chants(titre))",
    )
    .order("date", { ascending: false });

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement des prestations.</p>`;
    console.error(error);
    return;
  }

  if (!prestations || prestations.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucune prestation enregistrée.</p>`;
    return;
  }

  liste.innerHTML = prestations
    .map((p) => {
      const chants = (p.prestations_chants || [])
        .slice()
        .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

      return `
        <li class="carte">
          <div class="carte-ligne">
            <span class="carte-titre">${p.titre}</span>
            <span class="badge badge-bleu">${LABELS_TYPE[p.type_evenement] ?? p.type_evenement}</span>
          </div>
          <p class="carte-info">
            ${new Date(p.date).toLocaleDateString("fr-FR")}${p.lieu ? ` — ${p.lieu}` : ""}
          </p>
          ${
            chants.length > 0
              ? `<ol class="liste-ordonnee">${chants.map((pc) => `<li>${pc.chants?.titre ?? ""}</li>`).join("")}</ol>`
              : ""
          }
        </li>`;
    })
    .join("");
}

chargerPrestations();
