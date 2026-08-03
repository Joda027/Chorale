const LABELS_PARTIE_MESSE = {
  ENTREE: "Entrée",
  KYRIE: "Kyrie",
  GLOIRE: "Gloire à Dieu",
  PSAUME: "Psaume",
  ACCLAMATION: "Acclamation (Alléluia)",
  OFFERTOIRE: "Offertoire",
  SANCTUS: "Sanctus",
  AGNEAU: "Agneau de Dieu",
  COMMUNION: "Communion",
  SORTIE: "Sortie",
  AUTRE: "Autre",
};

const LABELS_PUPITRE = {
  SOPRANO: "Soprano",
  ALTO: "Alto",
  TENOR: "Ténor",
  BASSE: "Basse",
};

const formulaire = document.getElementById("formulaire-chant");
const titreFormulaire = document.getElementById("titre-formulaire");
const boutonEnregistrer = document.getElementById("bouton-enregistrer");
const boutonAnnuler = document.getElementById("bouton-annuler");
const messageErreur = document.getElementById("message-erreur");

function reinitialiserFormulaire() {
  formulaire.reset();
  document.getElementById("chant-id").value = "";
  titreFormulaire.textContent = "Ajouter un chant";
  boutonEnregistrer.textContent = "Ajouter";
  boutonAnnuler.hidden = true;
}

async function chargerChants() {
  const corps = document.getElementById("corps-tableau-chants");
  const { data: chants, error } = await supabaseClient
    .from("chants")
    .select("id, titre, compositeur, partie_messe, pupitre_cible, paroles")
    .order("titre", { ascending: true });

  if (error) {
    corps.innerHTML = `<tr><td colspan="4">Erreur de chargement.</td></tr>`;
    console.error(error);
    return;
  }

  if (!chants || chants.length === 0) {
    corps.innerHTML = `<tr><td colspan="4">Aucun chant enregistré.</td></tr>`;
    return;
  }

  corps.innerHTML = chants
    .map(
      (c) => `
        <tr>
          <td>${c.titre}</td>
          <td>${LABELS_PARTIE_MESSE[c.partie_messe] ?? ""}</td>
          <td>${LABELS_PUPITRE[c.pupitre_cible] ?? ""}</td>
          <td style="white-space: nowrap;">
            <button class="bouton-secondaire" data-action="modifier" data-id="${c.id}">Modifier</button>
            <button class="bouton-danger" data-action="supprimer" data-id="${c.id}">Supprimer</button>
          </td>
        </tr>`,
    )
    .join("");

  corps.querySelectorAll('[data-action="modifier"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const chant = chants.find((c) => c.id === btn.dataset.id);
      document.getElementById("chant-id").value = chant.id;
      document.getElementById("chant-titre").value = chant.titre;
      document.getElementById("chant-compositeur").value = chant.compositeur ?? "";
      document.getElementById("chant-partie").value = chant.partie_messe ?? "";
      document.getElementById("chant-pupitre").value = chant.pupitre_cible ?? "";
      document.getElementById("chant-paroles").value = chant.paroles ?? "";
      titreFormulaire.textContent = "Modifier le chant";
      boutonEnregistrer.textContent = "Enregistrer les modifications";
      boutonAnnuler.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  corps.querySelectorAll('[data-action="supprimer"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Supprimer ce chant ?")) return;
      const { error: erreurSuppr } = await supabaseClient.from("chants").delete().eq("id", btn.dataset.id);
      if (erreurSuppr) {
        alert("Erreur lors de la suppression : " + erreurSuppr.message);
        return;
      }
      chargerChants();
    });
  });
}

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageErreur.hidden = true;

  const id = document.getElementById("chant-id").value;
  const valeurs = {
    titre: document.getElementById("chant-titre").value,
    compositeur: document.getElementById("chant-compositeur").value || null,
    partie_messe: document.getElementById("chant-partie").value || null,
    pupitre_cible: document.getElementById("chant-pupitre").value || null,
    paroles: document.getElementById("chant-paroles").value || null,
  };

  const requete = id
    ? supabaseClient.from("chants").update(valeurs).eq("id", id)
    : supabaseClient.from("chants").insert(valeurs);

  const { error } = await requete;

  if (error) {
    messageErreur.textContent = error.message;
    messageErreur.hidden = false;
    return;
  }

  reinitialiserFormulaire();
  chargerChants();
});

boutonAnnuler.addEventListener("click", reinitialiserFormulaire);

async function initialiser() {
  const acces = await exigerAdmin();
  if (!acces) return;
  chargerChants();
}

initialiser();
