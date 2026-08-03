async function chargerCarrousel() {
  const conteneur = document.getElementById("carrousel-photos");
  const { data: photos } = await supabaseClient
    .from("photos")
    .select("id, url, legende")
    .order("ordre", { ascending: true });

  if (!photos || photos.length === 0) {
    conteneur.remove();
    return;
  }

  conteneur.innerHTML = photos
    .map(
      (p, i) => `
        <img
          src="${p.url}"
          alt="${p.legende ?? "Photo de la chorale"}"
          class="carrousel-image${i === 0 ? " actif" : ""}"
          data-index="${i}"
        />`,
    )
    .join("") + `<div class="carrousel-legende" id="carrousel-legende">${photos[0].legende ?? ""}</div>`;

  const images = conteneur.querySelectorAll(".carrousel-image");
  const legende = document.getElementById("carrousel-legende");
  let indexActuel = 0;

  setInterval(() => {
    images[indexActuel].classList.remove("actif");
    indexActuel = (indexActuel + 1) % images.length;
    images[indexActuel].classList.add("actif");
    legende.textContent = photos[indexActuel].legende ?? "";
  }, 4000);
}

async function chargerAccueil() {
  const session = await exigerConnexion();
  if (!session) return;

  chargerCarrousel();

  const maintenant = new Date().toISOString();

  const [{ count: nbChoristes }, { count: nbChants }, { count: nbPrestations }, { data: prochaines }] =
    await Promise.all([
      supabaseClient
        .from("profils")
        .select("*", { count: "exact", head: true })
        .eq("statut", "ACTIF"),
      supabaseClient.from("chants").select("*", { count: "exact", head: true }),
      supabaseClient
        .from("prestations")
        .select("*", { count: "exact", head: true })
        .gte("date", maintenant),
      supabaseClient
        .from("prestations")
        .select("id, titre, date")
        .gte("date", maintenant)
        .order("date", { ascending: true })
        .limit(3),
    ]);

  document.getElementById("stat-choristes").textContent = nbChoristes ?? 0;
  document.getElementById("stat-chants").textContent = nbChants ?? 0;
  document.getElementById("stat-prestations").textContent = nbPrestations ?? 0;

  const liste = document.getElementById("liste-prochaines-prestations");
  if (!prochaines || prochaines.length === 0) {
    liste.innerHTML = '<p class="etat-vide">Aucune prestation programmée.</p>';
    return;
  }

  liste.innerHTML = prochaines
    .map(
      (p) => `
        <li class="carte carte-ligne">
          <span class="carte-titre">${p.titre}</span>
          <span class="texte-attenue">${new Date(p.date).toLocaleDateString("fr-FR")}</span>
        </li>`,
    )
    .join("");
}

chargerAccueil();
