async function chargerAccueil() {
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
