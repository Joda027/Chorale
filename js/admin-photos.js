const formulaire = document.getElementById("formulaire-photo");
const messageErreur = document.getElementById("message-erreur");
const boutonAjouter = document.getElementById("bouton-ajouter");

async function chargerPhotos() {
  const grille = document.getElementById("grille-photos");

  const { data: photos, error } = await supabaseClient
    .from("photos")
    .select("id, url, legende, ordre")
    .order("ordre", { ascending: true });

  if (error) {
    grille.innerHTML = `<p class="etat-vide">Erreur de chargement.</p>`;
    console.error(error);
    return;
  }

  if (!photos || photos.length === 0) {
    grille.innerHTML = `<p class="etat-vide">Aucune photo pour le moment.</p>`;
    return;
  }

  grille.innerHTML = photos
    .map(
      (p) => `
        <div class="photo-admin">
          <img src="${p.url}" alt="${p.legende ?? ""}" />
          <div class="photo-admin-info">
            <span>${p.legende ?? "Sans légende"}</span>
            <button class="bouton-danger" data-id="${p.id}" data-action="supprimer">✕</button>
          </div>
        </div>`,
    )
    .join("");

  grille.querySelectorAll('[data-action="supprimer"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Supprimer cette photo ?")) return;
      const { error: erreurSuppr } = await supabaseClient.from("photos").delete().eq("id", btn.dataset.id);
      if (erreurSuppr) {
        alert("Erreur lors de la suppression : " + erreurSuppr.message);
        return;
      }
      chargerPhotos();
    });
  });
}

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageErreur.hidden = true;
  boutonAjouter.disabled = true;
  boutonAjouter.textContent = "Envoi en cours...";

  const legende = document.getElementById("photo-legende").value || null;
  const ordre = Number(document.getElementById("photo-ordre").value) || 0;
  const fichier = document.getElementById("photo-fichier").files[0];

  try {
    const chemin = `${Date.now()}-${fichier.name}`;
    const { error: erreurUpload } = await supabaseClient.storage.from("photos").upload(chemin, fichier);
    if (erreurUpload) throw erreurUpload;

    const { data: urlPublique } = supabaseClient.storage.from("photos").getPublicUrl(chemin);

    const { error: erreurInsert } = await supabaseClient.from("photos").insert({
      url: urlPublique.publicUrl,
      legende,
      ordre,
    });
    if (erreurInsert) throw erreurInsert;

    formulaire.reset();
    chargerPhotos();
  } catch (err) {
    messageErreur.textContent = err.message;
    messageErreur.hidden = false;
  } finally {
    boutonAjouter.disabled = false;
    boutonAjouter.textContent = "Ajouter";
  }
});

async function initialiser() {
  const acces = await exigerAdmin();
  if (!acces) return;
  chargerPhotos();
}

initialiser();
