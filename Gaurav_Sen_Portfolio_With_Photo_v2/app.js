/* Generic renderer. Personalise portfolio.js first; do not paste HTML into data. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const text = value => typeof value === "string" || typeof value === "number" ? String(value) : "";
  const list = value => Array.isArray(value) ? value : [];
  function el(tag, value, className) {
    const node = document.createElement(tag);
    if (value !== undefined) node.textContent = text(value);
    if (className) node.className = className;
    return node;
  }
  // Only public web links and simple assets/ paths. Reject executable URLs.
  function safeUrl(value, asset = false) {
    const raw = text(value).trim();
    if (!raw || /[\u0000-\u0020\\]/.test(raw)) return "";
    try {
      const u = new URL(raw);
      if (["https:", "http:"].includes(u.protocol) && !u.username && !u.password) return u.href;
    } catch (_) { /* Local assets are checked below. */ }
    if (asset && /^assets\/[A-Za-z0-9_./-]+$/.test(raw) && !raw.split("/").includes("..")) return raw;
    return "";
  }
  function link(label, value, className = "button", asset = false) {
    const href = safeUrl(value, asset);
    if (!href || !text(label)) return null;
    const a = el("a", label, className);
    a.href = href;
    return a; // Same-tab navigation is deliberate; no unexpected new window.
  }
  function append(parent, node) { if (node) parent.append(node); }
  function set(id, value) { $(id).textContent = text(value); }
  function visible(id, yes) { $(id).hidden = !yes; }
  function media(container, source, alt, fallback, className) {
    container.append(fallback);
    const src = safeUrl(source, true);
    if (!src) return;
    const img = el("img", undefined, className);
    img.alt = text(alt);
    img.classList.add("is-loading");
    img.decoding = "async";
    if (className !== "portrait") img.loading = "lazy";
    else img.setAttribute("fetchpriority", "high");
    img.addEventListener("load", () => { fallback.hidden = true; img.classList.remove("is-loading"); });
    img.addEventListener("error", () => { img.remove(); fallback.hidden = false; });
    container.append(img);
    img.src = src;
  }
  try {
    const d = window.PORTFOLIO;
    if (!d || !d.profile || !text(d.profile.name)) throw new Error("Missing portfolio profile");
    const p = d.profile, design = d.design || {};
    const root = document.documentElement;
    const palettes = ["violet", "ocean", "forest", "mono"];
    root.dataset.palette = palettes.includes(design.palette) ? design.palette : "violet";
    root.dataset.hero = design.hero === "centered" ? "centered" : "split";
    root.dataset.layout = design.projectLayout === "list" ? "list" : "grid";
    root.dataset.motion = design.motion === false ? "off" : "on";
    const storageKey = "portfolio-theme:" + p.name;
    const preference = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
    let visitorChoice = false;
    let saved;
    try { saved = localStorage.getItem(storageKey); } catch (_) { /* Local file/privacy mode. */ }
    const chooseDefault = () => design.mode === "dark" || (design.mode === "system" && preference?.matches) ? "dark" : "light";
    const applyTheme = mode => {
      root.dataset.mode = mode;
      $("theme-toggle").textContent = mode === "dark" ? "Light" : "Dark";
      $("theme-toggle").setAttribute("aria-label", `Switch to ${mode === "dark" ? "light" : "dark"} theme`);
    };
    visitorChoice = ["light", "dark"].includes(saved);
    applyTheme(visitorChoice ? saved : chooseDefault());
    $("theme-toggle").addEventListener("click", () => {
      const next = root.dataset.mode === "dark" ? "light" : "dark";
      visitorChoice = true;
      applyTheme(next);
      try { localStorage.setItem(storageKey, next); } catch (_) { /* Theme still works. */ }
    });
    preference?.addEventListener?.("change", () => { if (!visitorChoice && design.mode === "system") applyTheme(chooseDefault()); });
    set("brand", p.name);
    set("hero-label", [p.location, p.role].filter(Boolean).join(" / "));
    set("hero-title", p.headline || p.name);
    set("hero-intro", p.introduction);
    set("availability", p.availability);
    visible("availability", !!text(p.availability));
    const initials = p.name.trim().split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase();
    const portraitFallback = el("div", undefined, "portrait-fallback");
    portraitFallback.setAttribute("aria-hidden", "true");
    portraitFallback.append(el("span", initials, "initials"), el("span", p.name, "portrait-name"));
    media($("portrait-wrap"), p.photo, p.photoAlt || `Portrait of ${p.name}`, portraitFallback, "portrait");
    append($("hero-actions"), link("View résumé ↗", p.resume, "button", true));
    // Result cards are separately attributed professional outcomes, not case-study targets.
    const results = list(d.results).filter(x => x && text(x.number));
    visible("results", results.length > 0);
    results.forEach(item => {
      const card = el("article", undefined, "result-card");
      card.append(el("strong", item.number, "result-value"), el("h3", item.label, "result-label"), el("p", item.context, "result-context"));
      $("results-list").append(card);
    });
    const projects = list(d.projects).filter(x => x && text(x.title));
    visible("work", projects.length > 0);
    set("work-intro", d.workIntro);
    if (projects.length) {
      const workLink = el("a", "Explore my work ↓", "button primary"); workLink.href = "#work";
      $("hero-actions").prepend(workLink);
    }
    projects.forEach((project, index) => {
      const article = el("article", undefined, "project-card");
      article.dataset.category = text(project.category) || "Other";
      const image = el("div", undefined, "project-image");
      const fallback = el("div", undefined, "project-placeholder");
      fallback.setAttribute("aria-hidden", "true");
      fallback.append(el("span", String(index + 1).padStart(2, "0"), "project-number"), el("span", project.category || "Selected work", "project-mark"), el("strong", project.title, "project-placeholder-title"));
      media(image, project.thumbnail, project.thumbnailAlt || project.title, fallback, "project-thumbnail");
      const body = el("div", undefined, "project-body");
      body.append(el("p", [project.category, project.kind].filter(Boolean).join(" / "), "eyebrow"), el("h3", project.title), el("p", project.summary));
      if (project.role) body.append(el("p", "My role: " + text(project.role), "project-role"));
      const detailEntries = Object.entries(project.details || {}).filter(([key, value]) => ["problem", "approach", "decision", "outcome", "learning"].includes(key) && text(value));
      if (detailEntries.length) {
        const details = el("details");
        const summary = el("summary", "Read the case study");
        summary.setAttribute("aria-label", `Read the case study: ${project.title}`);
        details.append(summary);
        const labels = {problem: "The problem", approach: "My approach", decision: "The decision", outcome: "Outcome / validation", learning: "What I learned"};
        detailEntries.forEach(([key, value]) => details.append(el("h4", labels[key]), el("p", value)));
        body.append(details);
      }
      const links = el("div", undefined, "project-links");
      list(project.links).forEach(item => { if (item) append(links, link(item.label, item.url, "text-link", true)); });
      if (links.childElementCount) body.append(links);
      article.append(image, body);
      $("projects").append(article);
    });
    const categories = [...new Set(projects.map(x => text(x.category) || "Other"))];
    if (categories.length > 1) {
      // Null is the unfiltered choice; a real category named "All" still works.
      [null, ...categories].forEach(category => {
        const button = el("button", category === null ? "All work" : category, "filter-button");
        button.type = "button";
        button.setAttribute("aria-pressed", String(category === null));
        button.addEventListener("click", () => {
          for (const b of $("filters").children) b.setAttribute("aria-pressed", String(b === button));
          let count = 0;
          for (const card of $("projects").children) {
            card.hidden = category !== null && card.dataset.category !== category;
            if (!card.hidden) count++;
          }
          set("filter-status", `${count} project${count === 1 ? "" : "s"} shown`);
        });
        $("filters").append(button);
      });
    }
    const about = list(p.about).filter(x => text(x));
    const skills = list(p.skills).filter(x => text(x));
    visible("about", about.length + skills.length > 0);
    about.forEach(paragraph => $("about-copy").append(el("p", paragraph, "lead")));
    skills.forEach(skill => $("skills").append(el("li", skill)));
    const experience = list(d.experience).filter(x => x && (text(x.company) || text(x.role)));
    visible("experience", experience.length > 0);
    experience.forEach(item => {
      const row = el("article", undefined, "experience-row");
      const meta = el("div"); meta.append(el("h3", item.company), el("p", item.dates, "muted"), el("p", item.location, "small"));
      const body = el("div"); body.append(el("h3", item.role), el("p", item.summary));
      const points = el("ul", undefined, "highlights");
      list(item.highlights).filter(x => text(x)).forEach(point => points.append(el("li", point)));
      if (points.childElementCount) body.append(points);
      row.append(meta, body); $("experience-list").append(row);
    });
    const education = list(d.education).filter(x => x && text(x.title));
    visible("education", education.length > 0);
    education.forEach(item => {
      const card = el("article", undefined, "education-card");
      card.append(el("h3", item.title), el("p", [item.institution, item.year].filter(Boolean).join(" · ")), el("p", item.detail, "small"));
      append(card, link("View credential ↗", item.url, "text-link"));
      $("education-list").append(card);
    });
    set("contact-title", p.contactHeading || "Let’s talk about what’s next.");
    set("contact-copy", p.contactText);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(p.email))) {
      const mail = el("a", "Email me ↗", "button primary");
      mail.href = "mailto:" + encodeURIComponent(p.email);
      $("contact-links").append(mail);
    }
    list(p.links).forEach(item => { if (item) append($("contact-links"), link(item.label, item.url)); });
    visible("contact", $("contact-links").childElementCount > 0);
    [["results", "Results"], ["work", "Work"], ["about", "About"], ["experience", "Experience"], ["contact", "Contact"]].forEach(([id, label]) => {
      if (!$(id).hidden) { const a = el("a", label); a.href = "#" + id; $("navigation").append(a); }
    });
    set("footer-copy", `© ${new Date().getFullYear()} ${p.name}${p.footer ? " · " + p.footer : ""}`);
    // Runtime titles help browser tabs; ALSO edit static tags in index.html for link previews.
    document.title = `${p.name} | ${p.role || "Portfolio"}`;
    const description = document.querySelector('meta[name="description"]');
    if (description && p.introduction) description.content = p.introduction;
    const siteUrl = safeUrl(p.siteUrl);
    if (siteUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) { canonical = el("link"); canonical.rel = "canonical"; document.head.append(canonical); }
      canonical.href = siteUrl;
    }
  } catch (error) {
    $("load-error").hidden = false;
    console.error("Portfolio setup error:", error.message);
  }
})();
