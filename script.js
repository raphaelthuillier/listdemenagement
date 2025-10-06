// ---------- Configuration des jalons (une colonne, coloré + emojis) ----------
const MILESTONES = [
  {
    key: "J-60",
    offset: -60,
    icon: "🧹",
    title: "Prépare ton tri",
    desc: "Vends, donne, recycle. Liste le mobilier à garder.",
    actions: [
      {
        label: "Cartons & Matériel",
        href: "/comparateurs/cartons",
        icon: "📦",
      },
    ],
  },
  {
    key: "J-45",
    offset: -45,
    icon: "🚚",
    title: "Réserve le déménageur / utilitaire",
    desc: "Demande des devis et bloque le jour J.",
    actions: [
      {
        label: "Déménageur / Utilitaire",
        href: "/comparateurs/demenagement",
        icon: "🧭",
      },
    ],
  },
  {
    key: "J-30",
    offset: -30,
    icon: "📄",
    title: "Préavis & logement",
    desc: "Préavis propriétaire/syndic. Vérifie que le nouveau logement est prêt.",
    actions: [
      {
        label: "Énergie (ouvrir contrat)",
        href: "/comparateurs/energie",
        icon: "🔌",
      },
    ],
  },
  {
    key: "J-15",
    offset: -15,
    icon: "🌐",
    title: "Internet / Eau / Gaz",
    desc: "Transfert ou résiliation, et changement d’adresse.",
    actions: [{ label: "Box Internet", href: "/comparateurs/box", icon: "🌐" }],
  },
  {
    key: "J-7",
    offset: -7,
    icon: "🧳",
    title: "Cartons finaux & valise 48h",
    desc: "Étiquette par pièce. Prépare l’essentiel pour 48h.",
    actions: [
      {
        label: "Assurance habitation",
        href: "/comparateurs/assurance-habitation",
        icon: "🏠",
      },
    ],
  },
  {
    key: "J-3",
    offset: -3,
    icon: "🛠️",
    title: "Démontage & accès",
    desc: "Démonte les meubles, réserve parking/ascenseur, confirme horaires.",
    actions: [
      { label: "Ménage / Bricolage", href: "/comparateurs/menage", icon: "🧽" },
    ],
  },
  {
    key: "J-1",
    offset: -1,
    icon: "🔌",
    title: "Débranche & état des lieux",
    desc: "Débranche appareils, dégivre, fais l’état des lieux sortant.",
    actions: [
      {
        label: "Banque / Changement d’adresse",
        href: "/comparateurs/banque",
        icon: "💳",
      },
    ],
  },
  {
    key: "J",
    offset: 0,
    icon: "📋",
    title: "Jour J — Checklist",
    desc: "Supervise chargement, relevés des compteurs, état des lieux entrant.",
    actions: [
      {
        label: "Télécharger la checklist",
        href: "/ressources/checklist",
        icon: "📄",
      },
    ],
  },
  {
    key: "J+7",
    offset: 7,
    icon: "🗃️",
    title: "Une semaine après",
    desc: "Déballage prioritaire, déclarations assurances si besoin.",
    actions: [
      { label: "Aides & démarches", href: "/ressources/aides", icon: "🧾" },
    ],
  },
  {
    key: "J+30",
    offset: 30,
    icon: "🪪",
    title: "Un mois après",
    desc: "Termine les démarches (titres, impôts, carte grise).",
    actions: [
      {
        label: "Administratif en ligne",
        href: "/ressources/administratif",
        icon: "🏛️",
      },
    ],
  },
];
// ---------- Sélecteurs d’écrans ----------
const screenPlan = document.getElementById("screen-plan");
const screenContact = document.getElementById("screen-contact");
const moveDateInput = document.getElementById("moveDate");
const startBtn = document.getElementById("startBtn");
const backToDate = document.getElementById("backToDate");
const toContact = document.getElementById("toContact");
const backToPlan = document.getElementById("backToPlan");
const planList = document.getElementById("planList");
const printPdf = document.getElementById("printPdf");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
// ---------- Clés de stockage ----------
const lastDateKey = "moving::lastDateISO";
const planStateKey = (iso) => `moving::state::${iso}`; // { [milestoneKey]: "todo"|"done"|"na" }
// ---------- Utilitaires ----------
const fmtFR = (d) =>
  d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const loadState = (k) => JSON.parse(localStorage.getItem(k) || "{}");
const saveState = (k, v) => localStorage.setItem(k, JSON.stringify(v));
// ---------- Rendu du plan (une colonne) ----------
function renderPlan(iso) {
  const d = new Date(iso);
  const state = loadState(planStateKey(iso));
  planList.innerHTML = "";
  const sorted = [...MILESTONES].sort((a, b) => a.offset - b.offset);
  sorted.forEach((ms) => {
    const date = new Date(d);
    date.setDate(date.getDate() + ms.offset);
    const li = document.createElement("li");
    li.className = "item";
    const current = state[ms.key] || "todo";
    const dim = current === "na" ? " dim" : "";
    li.className += dim;
    li.innerHTML = `
      <div class="header">
        <div class="emoji" aria-hidden="true">${ms.icon}</div>
        <div class="grow">
          <p class="title">${ms.title} <span class="badge">${ms.key}</span></p>
          <p class="date">${fmtFR(date)}</p>
          <p class="desc">${ms.desc}</p>
          <div class="actions">
            ${ms.actions
              .map(
                (a) =>
                  `<a class="action-link" href="${a.href}" target="_blank" rel="noopener">${a.icon} ${a.label}</a>`
              )
              .join("")}
          </div>
          <div class="state">
            <button class="pill" data-ms="${ms.key}" data-val="todo" ${
      current === "todo" ? 'data-state="todo"' : ""
    }>À faire</button>
            <button class="pill" data-ms="${ms.key}" data-val="done" ${
      current === "done" ? 'data-state="done"' : ""
    }>Fait</button>
            <button class="pill" data-ms="${ms.key}" data-val="na" ${
      current === "na" ? 'data-state="na"' : ""
    }>Non concerné</button>
          </div>
        </div>
      </div>
    `;
    planList.appendChild(li);
  });
  attachStateHandlers(iso);
  updateProgress(iso);
  show(screenPlan);
}
function attachStateHandlers(iso) {
  const state = loadState(planStateKey(iso));
  document.querySelectorAll(".pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.ms;
      const val = btn.dataset.val;
      state[key] = val;
      // toggle visuel sur le trio
      const group = btn.parentElement.querySelectorAll(".pill");
      group.forEach((b) => b.removeAttribute("data-state"));
      btn.setAttribute(
        "data-state",
        val === "todo" ? "todo" : val === "done" ? "done" : "na"
      );
      // dim si N/A
      const card = btn.closest(".item");
      if (val === "na") {
        card.classList.add("dim");
      } else {
        card.classList.remove("dim");
      }
      saveState(planStateKey(iso), state);
      updateProgress(iso);
    });
  });
}
function updateProgress(iso) {
  const state = loadState(planStateKey(iso));
  const total = MILESTONES.length;
  const done = Object.values(state).filter((v) => v === "done").length;
  const pct = Math.round((done / total) * 100);
  progressText.textContent = `${pct}% complété`;
  progressBar.style.width = `${pct}%`;
}
// ---------- Navigation écrans ----------
function show(el) {
  screenPlan.classList.add("hidden");
  screenContact.classList.add("hidden");
  el.classList.remove("hidden");
}
startBtn.addEventListener("click", () => {
  const v = moveDateInput.value;
  if (!v) return alert("Merci d’indiquer une date de déménagement.");
  const iso = new Date(v + "T00:00:00").toISOString().slice(0, 10);
  localStorage.setItem(lastDateKey, iso);
  if (!localStorage.getItem(planStateKey(iso)))
    saveState(planStateKey(iso), {});
  renderPlan(iso);
});
backToDate.addEventListener("click", () => {
  show(document.querySelector(".hero"));
});
toContact.addEventListener("click", () => {
  show(screenContact);
});
backToPlan.addEventListener("click", () => {
  const iso = localStorage.getItem(lastDateKey);
  if (!iso) return;
  renderPlan(iso);
});
printPdf.addEventListener("click", () => window.print());
// ---------- Restauration ----------
window.addEventListener("DOMContentLoaded", () => {
  const last = localStorage.getItem(lastDateKey);
  if (last) {
    moveDateInput.value = last;
    renderPlan(last);
  }
});
// ---------- Feuille 3 : formulaire dynamique + envoi ----------
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("change", (e) => {
  if (e.target.name === "channels") {
    const val = e.target.value;
    const field = contactForm.querySelector(`.field[data-for="${val}"]`);
    if (!field) return;
    if (e.target.checked) {
      field.classList.remove("hidden");
    } else {
      field.classList.add("hidden");
      const input = field.querySelector("input");
      if (input) input.value = "";
    }
  }
});
document.getElementById("sendPlan").addEventListener("click", async () => {
  const iso = localStorage.getItem(lastDateKey);
  if (!iso) return alert("Commencez par créer votre plan.");
  const selected = Array.from(
    contactForm.querySelectorAll('input[name="channels"]:checked')
  ).map((c) => c.value);
  if (selected.length === 0)
    return alert(
      "Sélectionnez au moins un canal (WhatsApp, SMS, Email ou PDF)."
    );
  // validations coordonnées selon canal
  if (selected.includes("email") && !document.getElementById("emailAddr").value)
    return alert("Indiquez votre email.");
  if (selected.includes("sms") && !document.getElementById("smsPhone").value)
    return alert("Indiquez votre numéro SMS.");
  if (
    selected.includes("whatsapp") &&
    !document.getElementById("waPhone").value
  )
    return alert("Indiquez votre numéro WhatsApp.");
  // payload
  const state = loadState(planStateKey(iso));
  const payload = {
    moveDate: iso,
    channels: selected,
    contacts: {
      email: document.getElementById("emailAddr").value || null,
      sms: document.getElementById("smsPhone").value || null,
      whatsapp: document.getElementById("waPhone").value || null,
    },
    identity: {
      prenom: document.getElementById("prenom").value || "",
      nom: document.getElementById("nom").value || "",
    },
    optins: {
      reminders: document.getElementById("optinMain").checked,
      partners: document.getElementById("optinPartners").checked,
    },
    plan: MILESTONES.map((ms) => {
      const base = new Date(iso + "T00:00:00");
      base.setDate(base.getDate() + ms.offset);
      return {
        key: ms.key,
        date: base.toISOString().slice(0, 10),
        title: ms.title,
        desc: ms.desc,
        state: state[ms.key] || "todo",
        actions: ms.actions,
      };
    }),
  };
  try {
    // Remplace cette URL par ton webhook n8n
    const res = await fetch("https://webhook.site/xxxxxxxxxxxxxxxx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert("Merci ! Votre plan personnalisé arrive selon les canaux choisis.");
    } else {
      alert("Échec d’envoi. Réessayez dans un instant.");
    }
  } catch (e) {
    alert("Erreur réseau. Vérifiez votre connexion.");
  }
});
