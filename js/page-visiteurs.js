async function chargerPresentation() {
  const bloc = document.getElementById("bloc-presentation");
  const { data: infos, error } = await supabaseClient
    .from("infos_publiques")
    .select("texte_presentation, contact_email, contact_telephone, adresse")
    .eq("id", 1)
    .single();

  if (error || !infos) {
    bloc.innerHTML = `<p class="etat-vide">Informations indisponibles pour le moment.</p>`;
    return;
  }

  const coordonnees = [infos.contact_email, infos.contact_telephone, infos.adresse]
    .filter(Boolean)
    .map((v) => `<p class="carte-info">${v}</p>`)
    .join("");

  bloc.innerHTML = `
    <p>${(infos.texte_presentation || "").replace(/\n/g, "<br />")}</p>
    ${coordonnees}
  `;
}

async function chargerPhotos() {
  const galerie = document.getElementById("galerie-photos");

  const { data: photos, error } = await supabaseClient
    .from("photos")
    .select("id, url, legende")
    .order("ordre", { ascending: true });

  if (error) {
    galerie.innerHTML = `<p class="etat-vide">Erreur de chargement des photos.</p>`;
    console.error(error);
    return;
  }

  if (!photos || photos.length === 0) {
    galerie.innerHTML = `<p class="etat-vide">Aucune photo pour le moment.</p>`;
    return;
  }

  galerie.innerHTML = photos
    .map(
      (p) => `
        <div class="photo-admin">
          <img src="${p.url}" alt="${p.legende ?? "Photo de la chorale"}" />
          ${p.legende ? `<div class="photo-admin-info"><span>${p.legende}</span></div>` : ""}
        </div>`,
    )
    .join("");
}

async function chargerMusiques() {
  const liste = document.getElementById("liste-musiques");

  const { data: musiques, error } = await supabaseClient
    .from("musiques")
    .select("id, titre, chemin_fichier")
    .order("titre", { ascending: true });

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement des musiques.</p>`;
    console.error(error);
    return;
  }

  if (!musiques || musiques.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucune musique disponible.</p>`;
    return;
  }

  liste.innerHTML = musiques
    .map(
      (m) => `
        <li class="carte">
          <div class="fichier-ligne">
            <span class="carte-titre">${m.titre}</span>
            <a href="${m.chemin_fichier}" download class="bouton-secondaire">Télécharger</a>
          </div>
          <audio controls src="${m.chemin_fichier}" style="margin-top: 0.5rem; width: 100%;"></audio>
        </li>`,
    )
    .join("");
}

async function chargerPartitions() {
  const liste = document.getElementById("liste-partitions");

  const { data: partitions, error } = await supabaseClient
    .from("partitions_publiques")
    .select("id, titre, protegee, chemin_fichier")
    .order("titre", { ascending: true });

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement des partitions.</p>`;
    console.error(error);
    return;
  }

  if (!partitions || partitions.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucune partition disponible.</p>`;
    return;
  }

  liste.innerHTML = partitions
    .map((p) => {
      if (!p.protegee) {
        return `
          <li class="carte fichier-ligne">
            <span class="carte-titre">${p.titre}</span>
            <a href="${p.chemin_fichier}" download class="bouton-secondaire">Télécharger</a>
          </li>`;
      }

      return `
        <li class="carte" data-partition-id="${p.id}">
          <div class="fichier-ligne">
            <div>
              <span class="carte-titre">🔒 ${p.titre}</span>
              <p class="fichier-verrou">Partition protégée — code d'accès requis</p>
            </div>
          </div>
          <form class="fichier-code-formulaire" data-action="deverrouiller">
            <input type="text" placeholder="Code à 6 chiffres" maxlength="6" required class="saisie" />
            <button type="submit" class="bouton-secondaire">Déverrouiller</button>
          </form>
          <p class="erreur" hidden></p>
        </li>`;
    })
    .join("");

  liste.querySelectorAll('form[data-action="deverrouiller"]').forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const li = form.closest("li");
      const code = form.querySelector("input").value.trim();
      const messageErreur = li.querySelector(".erreur");
      messageErreur.hidden = true;

      const { data: chemin, error: erreurRpc } = await supabaseClient.rpc("verifier_code_partition", {
        p_id: li.dataset.partitionId,
        p_code: code,
      });

      if (erreurRpc || !chemin) {
        messageErreur.textContent = "Code incorrect.";
        messageErreur.hidden = false;
        return;
      }

      form.outerHTML = `<a href="${chemin}" download class="bouton-secondaire">Télécharger</a>`;
    });
  });
}

chargerPresentation();
chargerPhotos();
chargerMusiques();
chargerPartitions();
