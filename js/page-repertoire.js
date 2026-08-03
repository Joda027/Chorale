const LABELS_PUPITRE = {
  SOPRANO: "Soprano",
  ALTO: "Alto",
  TENOR: "Ténor",
  BASSE: "Basse",
};

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

const ORDRE_PARTIES = [
  "ENTREE", "KYRIE", "GLOIRE", "PSAUME", "ACCLAMATION",
  "OFFERTOIRE", "SANCTUS", "AGNEAU", "COMMUNION", "SORTIE", "AUTRE",
];

function initOnglets() {
  const onglets = document.querySelectorAll(".onglet");
  onglets.forEach((onglet) => {
    onglet.addEventListener("click", () => {
      onglets.forEach((o) => o.classList.remove("actif"));
      document.querySelectorAll(".onglet-panneau").forEach((p) => p.classList.remove("actif"));
      onglet.classList.add("actif");
      document.getElementById(`panneau-${onglet.dataset.onglet}`).classList.add("actif");
    });
  });
}

async function chargerChants() {
  const conteneur = document.getElementById("groupes-chants");

  const { data: chants, error } = await supabaseClient
    .from("chants")
    .select("id, titre, compositeur, pupitre_cible, partie_messe, chants_tags(tags(nom))")
    .order("titre", { ascending: true });

  if (error) {
    conteneur.innerHTML = `<p class="etat-vide">Erreur de chargement des chants.</p>`;
    console.error(error);
    return;
  }

  if (!chants || chants.length === 0) {
    conteneur.innerHTML = `<p class="etat-vide">Aucun chant enregistré pour le moment.</p>`;
    return;
  }

  const parPartie = {};
  for (const chant of chants) {
    const cle = chant.partie_messe ?? "AUTRE";
    parPartie[cle] = parPartie[cle] || [];
    parPartie[cle].push(chant);
  }

  conteneur.innerHTML = ORDRE_PARTIES.filter((p) => parPartie[p])
    .map((partie) => {
      const items = parPartie[partie]
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

      return `
        <section class="section">
          <h2 class="groupe-pupitre-titre">${LABELS_PARTIE_MESSE[partie] ?? partie}</h2>
          <ul class="liste-serree">${items}</ul>
        </section>`;
    })
    .join("");
}

async function chargerPartitions() {
  const liste = document.getElementById("liste-partitions");

  const [{ data: partitions, error }, { data: chants }] = await Promise.all([
    supabaseClient
      .rpc("obtenir_partitions_publiques")
      .order("titre", { ascending: true }),
    supabaseClient.from("chants").select("id, titre"),
  ]);

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement des partitions.</p>`;
    console.error(error);
    return;
  }

  if (!partitions || partitions.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucune partition disponible.</p>`;
    return;
  }

  const titresChants = Object.fromEntries((chants || []).map((c) => [c.id, c.titre]));

  liste.innerHTML = partitions
    .map((p) => {
      const sousTitre = p.chant_id && titresChants[p.chant_id] ? `<p class="carte-info">${titresChants[p.chant_id]}</p>` : "";

      if (!p.protegee) {
        return `
          <li class="carte fichier-ligne">
            <div>
              <span class="carte-titre">${p.titre}</span>
              ${sousTitre}
            </div>
            <a href="${p.chemin_fichier}" download class="bouton-secondaire">Télécharger</a>
          </li>`;
      }

      return `
        <li class="carte" data-partition-id="${p.id}">
          <div class="fichier-ligne">
            <div>
              <span class="carte-titre">🔒 ${p.titre}</span>
              ${sousTitre}
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

async function chargerMusiques() {
  const liste = document.getElementById("liste-musiques");

  const [{ data: musiques, error }, { data: chants }] = await Promise.all([
    supabaseClient
      .from("musiques")
      .select("id, chant_id, titre, chemin_fichier")
      .order("titre", { ascending: true }),
    supabaseClient.from("chants").select("id, titre"),
  ]);

  if (error) {
    liste.innerHTML = `<p class="etat-vide">Erreur de chargement des musiques.</p>`;
    console.error(error);
    return;
  }

  if (!musiques || musiques.length === 0) {
    liste.innerHTML = `<p class="etat-vide">Aucune musique disponible.</p>`;
    return;
  }

  const titresChants = Object.fromEntries((chants || []).map((c) => [c.id, c.titre]));

  liste.innerHTML = musiques
    .map(
      (m) => `
        <li class="carte">
          <div class="fichier-ligne">
            <div>
              <span class="carte-titre">${m.titre}</span>
              ${m.chant_id && titresChants[m.chant_id] ? `<p class="carte-info">${titresChants[m.chant_id]}</p>` : ""}
            </div>
            <a href="${m.chemin_fichier}" download class="bouton-secondaire">Télécharger</a>
          </div>
          <audio controls src="${m.chemin_fichier}" style="margin-top: 0.5rem; width: 100%;"></audio>
        </li>`,
    )
    .join("");
}

async function chargerGaleriePhotos() {
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

async function chargerRepertoire() {
  const session = await exigerConnexion();
  if (!session) return;

  initOnglets();
  chargerChants();
  chargerPartitions();
  chargerMusiques();
  chargerGaleriePhotos();
}

chargerRepertoire();
