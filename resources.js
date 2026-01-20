"use strict";

const COVERAGE = [
  {
    source: "ABC News (Australia)",
    date: "Jan 20, 2026",
    title: "ABC News (AU): UN urged to investigate Iran deaths as possible crimes against humanity",
    desc: "Report on UN calls and investigation demands linked to deaths during protests.",
    url: "https://www.abc.net.au/news/2026-01-20/united-nations-iran-deaths-investigation-crimes-against-humanity/106238634",
    tags: ["UN", "Human rights"],
    thumb: "pic/abc.jpg"
  },
  {
    source: "Reuters",
    date: "Jan 18, 2026",
    title: "Reuters: Verified deaths in Iran protests reach at least 5,000, official says",
    desc: "Official statement and reporting on verified death toll claims during protests.",
    url: "https://www.reuters.com/business/media-telecom/iranian-official-says-verified-deaths-iran-protests-reaches-least-5000-2026-01-18/",
    tags: ["Deaths", "Reporting"],
    thumb: "pic/reuters.jpg"
  }
];

const INSTAGRAM = [
  {
    source: "Instagram",
    title: "On-the-ground reel",
    desc: "Shared for awareness and updates.",
    url: "https://www.instagram.com/reel/DTk5CLMjyim/"
  },
  {
    source: "Instagram",
    title: "On-the-ground reel",
    desc: "Shared for awareness and updates.",
    url: "https://www.instagram.com/reel/DTTA0i4Erj9/"
  }
];

const PETITIONS = [
  {
    source: "Amnesty International",
    date: "Jan 2026",
    title: "Amnesty: Iran — massacre of protesters demands global diplomatic action",
    desc: "Call for accountability and diplomatic action in response to reported killings.",
    url: "https://www.amnesty.org/en/latest/news/2026/01/iran-massacre-of-protesters-demands-global-diplomatic-action-to-signal-an-end-to-impunity/",
    tags: ["Petition", "Action"],
    thumb: "pic/amnesty.jpg"
  },
  {
    source: "Change.org",
    date: "Jan 2026",
    title: "Sign the petition",
    desc: "Add your name and share.",
    url: "https://c.org/6rRThJkrQB",
    tags: ["Petition", "Action"],
    thumb: "pic/change.jpg"
  }
];

// ---------- Helpers ----------
function $(id){ return document.getElementById(id); }

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function escapeAttr(str){
  return escapeHtml(str).replaceAll("`","&#096;");
}

function norm(str){
  return String(str ?? "").toLowerCase().trim();
}

function openUrl(url){
  window.open(url, "_blank", "noopener,noreferrer");
}

function cardHtml(x){
  const tags = (x.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  const thumb = x.thumb ? `<img class="thumb" src="${escapeAttr(x.thumb)}" alt="">` : "";

  return `
    <article class="card" role="button" tabindex="0" data-url="${escapeAttr(x.url)}">
      ${thumb}
      <div class="card-body">
        <div class="kicker">
          <span>${escapeHtml(x.source || "")}</span>
          <span>${escapeHtml(x.date || "")}</span>
        </div>
        <div class="h">${escapeHtml(x.title || "")}</div>
        <p class="desc">${escapeHtml(x.desc || "")}</p>
        <div class="tags">${tags}</div>
      </div>
    </article>
  `;
}

function petitionCardHtml(x){
  const tags = (x.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  const thumb = x.thumb ? `<img class="thumb" src="${escapeAttr(x.thumb)}" alt="">` : "";

  return `
    <article class="card">
      ${thumb}
      <div class="card-body">
        <div class="kicker">
          <span>${escapeHtml(x.source || "")}</span>
          <span>${escapeHtml(x.date || "")}</span>
        </div>
        <div class="h">${escapeHtml(x.title || "")}</div>
        <p class="desc">${escapeHtml(x.desc || "")}</p>
        <div class="tags">${tags}</div>

        <div class="card-actions">
          <a class="linkbtn" href="${escapeAttr(x.url)}" target="_blank" rel="noopener noreferrer">Open petition</a>
        </div>
      </div>
    </article>
  `;
}

function instagramCardHtml(x){
  return `
    <article class="card">
      <div class="card-body">
        <div class="kicker">
          <span>${escapeHtml(x.source || "Instagram")}</span>
          <span>Reel</span>
        </div>
        <div class="h">${escapeHtml(x.title || "Instagram Reel")}</div>
        <p class="desc">${escapeHtml(x.desc || "Embedded from Instagram.")}</p>

        <a class="linkbtn" href="${escapeAttr(x.url)}" target="_blank" rel="noopener noreferrer">
          Open on Instagram
        </a>

        <div class="instagram-embed-wrap">
          <blockquote class="instagram-media"
            data-instgrm-permalink="${escapeAttr(x.url)}"
            data-instgrm-version="14">
          </blockquote>
        </div>
      </div>
    </article>
  `;
}

// ---------- State ----------
const searchEl = $("search");
const chipsEl = $("chips");
const gridEl = $("grid");
const instagramEl = $("instagram");
const petitionsEl = $("petitions");

let activeTag = "All";
let query = "";

// ---------- Chips ----------
function computeTags(){
  const set = new Set();
  for (const x of COVERAGE){
    for (const t of (x.tags || [])) set.add(t);
  }
  return ["All", ...Array.from(set).sort((a,b)=>a.localeCompare(b))];
}

function renderChips(){
  const tags = computeTags();
  chipsEl.innerHTML = tags.map(t => {
    const active = t === activeTag ? "active" : "";
    return `<span class="chip ${active}" data-tag="${escapeAttr(t)}">${escapeHtml(t)}</span>`;
  }).join("");
}

// ---------- Coverage rendering ----------
function matches(x){
  const q = norm(query);
  const hay = norm([
    x.source, x.title, x.desc, (x.tags || []).join(" ")
  ].join(" "));

  const tagOk = (activeTag === "All") || (x.tags || []).includes(activeTag);
  const qOk = !q || hay.includes(q);
  return tagOk && qOk;
}

function renderCoverage(){
  const items = COVERAGE.filter(matches);
  if (!items.length){
    gridEl.innerHTML = `
      <div style="grid-column: span 12; padding:16px; border:1px solid rgba(255,255,255,.12); border-radius:16px; background:rgba(255,255,255,.05); color:rgba(255,255,255,.72);">
        No results. Try a different keyword or clear filters.
      </div>
    `;
    return;
  }
  gridEl.innerHTML = items.map(cardHtml).join("");
}

// ---------- Instagram ----------
function renderInstagram(){
  if (!INSTAGRAM.length){
    instagramEl.innerHTML = `
      <div style="grid-column: span 12; padding:16px; border:1px solid rgba(255,255,255,.12); border-radius:16px; background:rgba(255,255,255,.05); color:rgba(255,255,255,.72);">
        Instagram links will be added here.
      </div>
    `;
    return;
  }

  instagramEl.innerHTML = INSTAGRAM.map(instagramCardHtml).join("");

  if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process){
    window.instgrm.Embeds.process();
  }
}

// ---------- Petitions ----------
function renderPetitions(){
  if (!PETITIONS.length){
    petitionsEl.innerHTML = `
      <div style="grid-column: span 12; padding:16px; border:1px solid rgba(255,255,255,.12); border-radius:16px; background:rgba(255,255,255,.05); color:rgba(255,255,255,.72);">
        No petitions added yet.
      </div>
    `;
    return;
  }
  petitionsEl.innerHTML = PETITIONS.map(petitionCardHtml).join("");
}

// ---------- Events ----------
document.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (chip){
    activeTag = chip.getAttribute("data-tag") || "All";
    renderChips();
    renderCoverage();
    return;
  }

  const card = e.target.closest(".card[data-url]");
  if (card){
    const url = card.getAttribute("data-url");
    if (url) openUrl(url);
    return;
  }

  const jump = e.target.closest('a[href="#petitions-section"]');
  if (jump){
    e.preventDefault();
    document.querySelector("#petitions-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const card = document.activeElement?.closest?.(".card[data-url]");
  if (!card) return;
  const url = card.getAttribute("data-url");
  if (url) openUrl(url);
});

searchEl?.addEventListener("input", () => {
  query = searchEl.value || "";
  renderCoverage();
});

// ---------- Init ----------
renderChips();
renderCoverage();
renderInstagram();
renderPetitions();
