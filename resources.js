// resources.js (FINAL - no more “Generating preview…”)
//
// Required local files:
// - pic/background.jpg
// - pic/reuters.jpg
// - pic/abc.jpg
// - pic/amnesty.jpg

// --------------------
// DATA
// --------------------

const PETITIONS = [
  {
    title: "Amnesty: Iran — massacre of protesters demands global diplomatic action",
    url: "https://www.amnesty.org/en/latest/news/2026/01/iran-massacre-of-protesters-demands-global-diplomatic-action-to-signal-an-end-to-impunity/?utm_source=chatgpt.com",
    org: "Amnesty International",
    desc: "Call for accountability and diplomatic action in response to reported killings."
  }
];

const LINKS = [
  {
    title: "ABC News (AU): UN urged to investigate Iran deaths as possible crimes against humanity",
    url: "https://www.abc.net.au/news/2026-01-20/united-nations-iran-deaths-investigation-crimes-against-humanity/106238634?utm_source=chatgpt.com",
    source: "ABC News (Australia)",
    date: "Jan 20, 2026",
    desc: "Report on UN calls and investigation demands linked to deaths during protests.",
    tags: ["UN", "Human rights"],
    thumb: "pic/abc.jpg"
  },
  {
    title: "Reuters: Verified deaths in Iran protests reach at least 5,000, official says",
    url: "https://www.reuters.com/business/media-telecom/iranian-official-says-verified-deaths-iran-protests-reaches-least-5000-2026-01-18/",
    source: "Reuters",
    date: "Jan 18, 2026",
    desc: "Official statement and reporting on verified death toll claims during protests.",
    tags: ["Deaths", "Reporting"],
    thumb: "pic/reuters.jpg"
  },
  {
    title: "Amnesty: Internet shutdown hides rights violations",
    url: "https://www.amnesty.org/en/latest/news/2026/01/internet-shutdown-in-iran-hides-violations-in-escalating-protests/?utm_source=chatgpt.com",
    source: "Amnesty",
    date: "Jan 2026",
    desc: "How shutdowns limit documentation and reporting.",
    tags: ["Internet outage", "Shutdown", "Human rights"],
    thumb: "pic/amnesty.jpg"
  }
];

const INSTAGRAM = [
  {
    title: "Instagram Reel: On-the-ground footage",
    url: "https://www.instagram.com/reel/DTk5CLMjyim/",
    source: "Instagram",
    desc: "Public reel embedded from Instagram."
  },
  {
    title: "Instagram Reel: On-the-ground footage",
    url: "https://www.instagram.com/reel/DTTA0i4Erj9/?igsh=MWFpa3RsM2Rla3FsNA==",
    source: "Instagram",
    desc: "Public reel embedded from Instagram."
  }
];

// --------------------
// DOM
// --------------------

const grid = document.getElementById("grid");
const petitionsGrid = document.getElementById("petitions");
const instagramGrid = document.getElementById("instagram");
const search = document.getElementById("search");
const chips = document.getElementById("chips");

let activeTag = "All";

// --------------------
// HELPERS
// --------------------

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  }[c]));
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/`/g, "&#96;");
}

function matches(item, q) {
  const text = `${item.title} ${item.source} ${(item.desc || "")} ${(item.tags || []).join(" ")}`.toLowerCase();
  return text.includes(q.toLowerCase());
}

function allTags() {
  const s = new Set();
  LINKS.forEach(x => (x.tags || []).forEach(t => s.add(t)));
  return ["All", ...Array.from(s).sort((a,b)=>a.localeCompare(b))];
}

// --------------------
// PETITION REMINDER (TOP)
// --------------------

function insertPetitionReminder() {
  if (!PETITIONS.length || !grid || !grid.parentNode) return;
  if (document.getElementById("petitionReminder")) return;

  const p = PETITIONS[0];

  const banner = document.createElement("div");
  banner.id = "petitionReminder";
  banner.style.cssText = `
    margin: 16px 0 10px;
    padding: 14px;
    border-radius: 16px;
    border: 1px solid rgba(124,92,255,.55);
    background: rgba(124,92,255,.14);
    backdrop-filter: blur(6px);
  `;

  banner.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;">
      <div>
        <div style="font-weight:900; letter-spacing:-0.02em;">Reminder: Sign the petition</div>
        <div style="margin-top:6px; color: rgba(255,255,255,.70); line-height:1.4;">
          ${escapeHtml(p.title)}
        </div>
      </div>
      <a class="petition-cta" href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer">
        Open petition
      </a>
    </div>
  `;

  grid.parentNode.insertBefore(banner, grid);
}

// --------------------
// CHIPS
// --------------------

function renderChips() {
  if (!chips) return;

  chips.innerHTML = "";
  allTags().forEach(tag => {
    const el = document.createElement("div");
    el.className = "chip" + (tag === activeTag ? " active" : "");
    el.textContent = tag;
    el.onclick = () => {
      activeTag = tag;
      renderArticles();
      renderChips();
    };
    chips.appendChild(el);
  });
}

// --------------------
// ARTICLES
// --------------------

function articleCardHtml(x, idx) {
  const tags = (x.tags || []).slice(0, 4).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  return `
    <a class="card" href="${escapeAttr(x.url)}" target="_blank" rel="noopener noreferrer">
      <div class="thumb-wrap" data-idx="${idx}">
        <div class="skeleton" aria-hidden="true"></div>
        <img class="thumb" data-role="thumb" alt="" loading="lazy" />
      </div>

      <div class="card-body">
        <div class="kicker">
          <span>${escapeHtml(x.source || "")}</span>
          <span>${escapeHtml(x.date || "")}</span>
        </div>
        <div class="h">${escapeHtml(x.title || "")}</div>
        <p class="desc">${escapeHtml(x.desc || "")}</p>
        <div class="tags">${tags}</div>
      </div>
    </a>
  `;
}

function hydrateThumbs(items) {
  const wraps = document.querySelectorAll(".thumb-wrap");

  wraps.forEach((w) => {
    const idx = Number(w.getAttribute("data-idx"));
    const x = items[idx];
    const img = w.querySelector('img[data-role="thumb"]');
    const skeleton = w.querySelector(".skeleton");

    if (!img || !x) return;

    // No remote screenshots. Only local thumbs.
    const src = x.thumb || "";

    if (!src) {
      w.remove();
      return;
    }

    img.classList.remove("loaded");
    img.src = src;

    img.onload = () => {
      img.classList.add("loaded");
      if (skeleton) skeleton.style.display = "none";
    };

    img.onerror = () => {
      w.remove();
    };
  });
}

function renderArticles() {
  if (!grid) return;

  const q = (search && search.value ? search.value : "").trim();

  const filtered = LINKS
    .map(x => ({ ...x }))
    .filter(x => {
      const tagOk = activeTag === "All" || (x.tags || []).includes(activeTag);
      const qOk = !q || matches(x, q);
      return tagOk && qOk;
    });

  grid.innerHTML = filtered.map((x, idx) => articleCardHtml(x, idx)).join("");

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="color:rgba(255,255,255,.7); padding:16px; border:1px solid rgba(255,255,255,.12); border-radius:16px; background:rgba(255,255,255,.05);">
        No matches. Try a different search or tag.
      </div>
    `;
    return;
  }

  hydrateThumbs(filtered);
}

// --------------------
// INSTAGRAM (official embed)
// --------------------

function instagramCardHtml(x) {
  return `
    <div class="card">
      <div class="card-body">
        <div class="kicker">
          <span>${escapeHtml(x.source || "Instagram")}</span>
          <span>Reel</span>
        </div>

        <div class="h">${escapeHtml(x.title || "Instagram Reel")}</div>
        <p class="desc">${escapeHtml(x.desc || "Embedded from Instagram.")}</p>

        <div class="instagram-embed-wrap">
          <blockquote
            class="instagram-media"
            data-instgrm-permalink="${escapeAttr(x.url)}"
            data-instgrm-version="14">
          </blockquote>
        </div>

        <a class="petition-cta" style="margin-top:12px; width:100%;"
           href="${escapeAttr(x.url)}" target="_blank" rel="noopener noreferrer">
          Open on Instagram
        </a>
      </div>
    </div>
  `;
}

function renderInstagram() {
  if (!instagramGrid) return;

  if (!INSTAGRAM.length) {
    instagramGrid.innerHTML = `
      <div style="color:rgba(255,255,255,.7); padding:16px; border:1px solid rgba(255,255,255,.12); border-radius:16px; background:rgba(255,255,255,.05);">
        Instagram links will be added here.
      </div>
    `;
    return;
  }

  instagramGrid.innerHTML = INSTAGRAM.map(x => instagramCardHtml(x)).join("");

  if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
    window.instgrm.Embeds.process();
  } else {
    setTimeout(() => {
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
        window.instgrm.Embeds.process();
      }
    }, 800);
  }
}

// --------------------
// PETITIONS
// --------------------

function petitionCardHtml(p) {
  return `
    <a class="card" href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer">
      <div class="card-body">
        <div class="kicker">
          <span>${escapeHtml(p.org || "Petition")}</span>
          <span></span>
        </div>
        <div class="h">${escapeHtml(p.title || "")}</div>
        <p class="desc">${escapeHtml(p.desc || "")}</p>
        <div class="petition-btn">Open petition</div>
      </div>
    </a>
  `;
}

function renderPetitions() {
  if (!petitionsGrid) return;

  if (!PETITIONS.length) {
    petitionsGrid.innerHTML = `
      <div style="color:rgba(255,255,255,.7); padding:16px; border:1px solid rgba(255,255,255,.12); border-radius:16px; background:rgba(255,255,255,.05);">
        Petitions will be added here.
      </div>
    `;
    return;
  }

  petitionsGrid.innerHTML = PETITIONS.map(p => petitionCardHtml(p)).join("");
}

// --------------------
// INIT
// --------------------

if (search) search.addEventListener("input", renderArticles);

insertPetitionReminder();
renderChips();
renderArticles();
renderInstagram();
renderPetitions();
