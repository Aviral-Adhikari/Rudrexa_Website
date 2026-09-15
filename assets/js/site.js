(function () {
  const data = window.RudrexaContent;

  if (!data) {
    return;
  }

  const { site, navigation, services, solutions, caseStudies, articles, process, outcomes, engagementModels, values, homeFaqs } = data;

  const byId = (id) => document.getElementById(id);
  const basePath = window.__RUDREXA_BASE__ ? window.__RUDREXA_BASE__.replace(/\/$/, "") : "";
  const withBase = (path) => `${basePath}${path}`;
  const normalizePath = (path) => {
    let value = path.replace(/index\.html$/, "");

    if (basePath && value.startsWith(basePath)) {
      value = value.slice(basePath.length) || "/";
    }

    value = value.replace(/\/$/, "");
    return value || "/";
  };
  const slugFromPath = () => normalizePath(window.location.pathname).split("/").filter(Boolean).pop() || "";
  const currentPath = () => normalizePath(window.location.pathname);
  const siteUrl = (path) => `${site.baseUrl}${path}`;
  const year = new Date().getFullYear();

  const serviceBySlug = Object.fromEntries(services.map((item) => [item.slug, item]));
  const solutionBySlug = Object.fromEntries(solutions.map((item) => [item.slug, item]));
  const caseStudyBySlug = Object.fromEntries(caseStudies.map((item) => [item.slug, item]));
  const articleBySlug = Object.fromEntries(articles.map((item) => [item.slug, item]));

  function iconShell(inner, viewBox = "0 0 24 24") {
    return `
      <svg viewBox="${viewBox}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        ${inner}
      </svg>
    `;
  }

  function getServiceIcon(slug) {
    const icons = {
      "branding-ui-ux": iconShell(`
        <path d="M4 20h16" />
        <path d="M7 16l8-8 3 3-8 8H7z" />
        <path d="M14 7l3 3" />
      `),
      "web-development": iconShell(`
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 8h18" />
        <path d="M9 13l-2 2 2 2" />
        <path d="M15 13l2 2-2 2" />
      `),
      "software-saas": iconShell(`
        <rect x="4" y="5" width="16" height="5" rx="1.5" />
        <rect x="4" y="14" width="16" height="5" rx="1.5" />
        <path d="M8 10v4" />
        <path d="M16 10v4" />
      `),
      "mobile-app-development": iconShell(`
        <rect x="7" y="3" width="10" height="18" rx="2.2" />
        <path d="M11 6h2" />
        <circle cx="12" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
      `),
      "ai-automation": iconShell(`
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="M6 6l2.5 2.5" />
        <path d="M15.5 15.5L18 18" />
      `),
      "seo-digital-growth": iconShell(`
        <path d="M4 19h16" />
        <path d="M7 15l3-3 3 2 4-5" />
        <path d="M16 9h3v3" />
      `),
      "cloud-cybersecurity": iconShell(`
        <path d="M8 18h8a4 4 0 0 0 .7-7.94A5 5 0 0 0 7.3 8 3.5 3.5 0 0 0 8 18Z" />
        <path d="M12 11l3 1.4v2.7c0 2-1.3 3.8-3 4.5-1.7-.7-3-2.5-3-4.5v-2.7L12 11Z" />
      `),
    };

    return icons[slug] || iconShell(`<circle cx="12" cy="12" r="7" /><path d="M12 8v4l2 2" />`);
  }

  function getIndustryIcon(industry) {
    const key = industry.toLowerCase();

    if (key.includes("mental")) {
      return iconShell(`
        <path d="M12 20s-6-3.8-8-8.6C2.8 7.5 5 5 7.7 5c1.6 0 3.2.8 4.3 2.3C13 5.8 14.7 5 16.3 5 19 5 21.2 7.5 20 11.4 18 16.2 12 20 12 20Z" />
      `);
    }

    if (key.includes("education")) {
      return iconShell(`
        <path d="M3 8l9-4 9 4-9 4-9-4Z" />
        <path d="M7 10v4c0 1.8 2.2 3 5 3s5-1.2 5-3v-4" />
      `);
    }

    if (key.includes("tourism")) {
      return iconShell(`
        <path d="M4 18h16" />
        <path d="M7 18l5-11 5 11" />
        <path d="M10 12h4" />
      `);
    }

    return iconShell(`<rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12h8" /><path d="M8 16h5" />`);
  }

  function getArticleIcon() {
    return iconShell(`
      <path d="M7 4h8l4 4v12H7z" />
      <path d="M15 4v4h4" />
      <path d="M10 12h6" />
      <path d="M10 16h6" />
    `);
  }

  function getModelIcon(title) {
    const map = {
      Launch: iconShell(`<path d="M6 18c2-5 5-8 10-10 1.5 4.5-1.5 9-6 10l-2 2v-4Z" /><path d="M13 9l2 2" />`),
      Build: iconShell(`<rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" />`),
      Partner: iconShell(`<path d="M8 12l3 3 5-5" /><path d="M4 7h5l2 2 2-2h7" /><path d="M4 17h16" />`),
    };

    return map[title] || iconShell(`<circle cx="12" cy="12" r="8" />`);
  }

  function getModelDetails(title) {
    const details = {
      Launch: ["Best for early launches", "Typical duration: 2 to 4 weeks", "Clear scope and rapid delivery plan"],
      Build: ["Best for deeper product work", "Typical duration: 6 to 12+ weeks", "Dedicated design and engineering flow"],
      Partner: ["Best for long-term support", "Monthly ongoing collaboration", "Roadmap, optimization and operational continuity"],
    };

    return details[title] || [];
  }

  function getModelLabel(title) {
    const labels = {
      Launch: "Launch Sprint",
      Build: "Dedicated Build",
      Partner: "Ongoing Partnership",
    };

    return labels[title] || title;
  }

  function getCaseStudyImage(slug) {
    const positions = {
      "himalaya-counselling-collective": "72% center",
      "mero-school-hub": "48% center",
      "sajilo-yatra": "88% center",
    };

    return {
      src: withBase("/assets/img/heroimage.png"),
      position: positions[slug] || "center center",
    };
  }

  function getProcessMeta(index) {
    const items = [
      { deliverable: "Business goals, pain points and opportunity map", timeframe: "1 to 2 weeks" },
      { deliverable: "Scope, architecture and practical roadmap", timeframe: "1 week" },
      { deliverable: "Flows, interface direction and decision-ready prototypes", timeframe: "1 to 3 weeks" },
      { deliverable: "Production build, QA and launch preparation", timeframe: "2 to 8+ weeks" },
      { deliverable: "Iteration roadmap, reporting and operational support", timeframe: "Ongoing" },
    ];

    return items[index] || { deliverable: "Tailored deliverables based on scope", timeframe: "Defined during scoping" };
  }

  function initLoader() {
    if (!document.body || document.querySelector(".site-loader")) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "site-loader";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="site-loader__mark">
        <img src="${withBase(`/assets/img/rudrexa_logo_icon.png`)}" alt="" width="2000" height="2000" />
      </div>
    `;

    document.body.appendChild(overlay);

    const hideLoader = () => {
      window.setTimeout(() => {
        overlay.classList.add("site-loader--hidden");
        window.setTimeout(() => overlay.remove(), 420);
      }, 1000);
    };

    if (document.readyState === "complete") {
      hideLoader();
      return;
    }

    window.addEventListener("load", hideLoader, { once: true });
  }

  function summarize(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength).trimEnd().replace(/[.,;:!?-]+$/, "")}...`;
  }

  function renderBadges(items, className = "service-badge", maxItems = items.length) {
    return items
      .slice(0, maxItems)
      .map((item) => `<span class="${className}">${item}</span>`)
      .join("");
  }

  function isActive(prefix) {
    const path = currentPath();
    return path === prefix || path.startsWith(`${prefix}/`);
  }

  function renderHeader() {
    const mount = byId("site-header");
    const mobileMount = byId("mobile-panel");

    if (!mount || !mobileMount) {
      return;
    }

    mount.innerHTML = `
      <div class="site-header">
        <div class="container nav-shell">
          <a href="${withBase(`/`)}" class="brand-lockup" aria-label="Rudrexa home">
            <img src="${withBase(`/assets/img/rudrexa_logo_icon.png`)}" alt="" width="2000" height="2000" />
            <span class="wordmark">RUDRE<span>X</span>A</span>
          </a>
          <nav class="desktop-nav" aria-label="Main navigation">
            <a class="nav-link ${isActive("/services") ? "active" : ""}" href="${withBase(`/services/`)}">Services</a>
            <a class="nav-link ${isActive("/work") ? "active" : ""}" href="${withBase(`/work/`)}">Work</a>
            <a class="nav-link ${isActive("/process") ? "active" : ""}" href="${withBase(`/process/`)}">Approach</a>
            <a class="nav-link ${isActive("/insights") ? "active" : ""}" href="${withBase(`/insights/`)}">Insights</a>
            <a class="nav-link ${isActive("/about") ? "active" : ""}" href="${withBase(`/about/`)}">About</a>
          </nav>
          <div class="header-cta">
            <a class="cta-button cta-button--accent" href="${withBase(`/start-project/`)}">Start a Project</a>
          </div>
          <button class="mobile-toggle" type="button" aria-expanded="false" aria-controls="mobile-panel-sheet" aria-label="Open navigation">
            <span></span>
          </button>
        </div>
      </div>
    `;

    mobileMount.innerHTML = `
      <div class="mobile-panel__inner" id="mobile-panel-sheet">
        <div class="stack-row" style="justify-content: space-between; align-items: center;">
          <a href="${withBase(`/`)}" class="brand-lockup">
            <img src="${withBase(`/assets/img/rudrexa_logo_icon.png`)}" alt="" width="2000" height="2000" />
            <span class="wordmark">RUDRE<span>X</span>A</span>
          </a>
          <button class="mobile-toggle" type="button" data-close-menu aria-label="Close navigation">
            <span></span>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          <a class="nav-link" href="${withBase(`/services/`)}">Services</a>
          <a class="nav-link" href="${withBase(`/work/`)}">Work</a>
          <a class="nav-link" href="${withBase(`/process/`)}">Approach</a>
          <a class="nav-link" href="${withBase(`/insights/`)}">Insights</a>
          <a class="nav-link" href="${withBase(`/about/`)}">About</a>
          <a class="cta-button cta-button--accent" href="${withBase(`/start-project/`)}">Start a Project</a>
        </nav>
      </div>
    `;

    const mobilePanel = mobileMount;
    const openButton = mount.querySelector(".mobile-toggle");
    const closeButton = mobileMount.querySelector("[data-close-menu]");

    const closeMenu = () => {
      mobilePanel.classList.remove("open");
      document.body.classList.remove("menu-open");
      if (openButton) {
        openButton.setAttribute("aria-expanded", "false");
      }
    };

    if (openButton) {
      openButton.addEventListener("click", () => {
        const nextState = !mobilePanel.classList.contains("open");
        mobilePanel.classList.toggle("open", nextState);
        document.body.classList.toggle("menu-open", nextState);
        openButton.setAttribute("aria-expanded", nextState ? "true" : "false");
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeMenu);
    }

    mobilePanel.addEventListener("click", (event) => {
      if (event.target === mobilePanel) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  function renderFooter() {
    const mount = byId("site-footer");

    if (!mount) {
      return;
    }

    const servicesList = services
      .slice(0, 4)
      .map((item) => `<li><a href="${withBase(`/services/${item.slug}/`)}">${item.menu}</a></li>`)
      .join("");
    const companyList = `
      <li><a href="${withBase(`/about/`)}">About</a></li>
      <li><a href="${withBase(`/process/`)}">Process</a></li>
      <li><a href="${withBase(`/work/`)}">Work</a></li>
      <li><a href="${withBase(`/contact/`)}">Contact</a></li>
    `;

    mount.innerHTML = `
      <div class="site-footer">
        <div class="container">
          <div class="footer-shell">
            <div>
              <a href="${withBase(`/`)}" class="brand-lockup">
                <img src="${withBase(`/assets/img/rudrexa_logo_icon.png`)}" alt="" width="2000" height="2000" />
                <span class="wordmark">RUDRE<span>X</span>A</span>
              </a>
              <p>Rudrexa brings branding, software, growth and infrastructure together through one connected digital partnership.</p>
              <p class="muted">${site.contact.locationLine}</p>
            </div>
            <div>
              <h3>Services</h3>
              <ul>${servicesList}</ul>
            </div>
            <div>
              <h3>Company</h3>
              <ul>${companyList}</ul>
            </div>
            <div>
              <h3>Contact</h3>
              <ul>
                <li>${site.contact.address}</li>
                <li><a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
                <li><a href="${withBase(`/privacy-policy/`)}">Privacy Policy</a></li>
                <li><a href="${withBase(`/terms/`)}">Terms</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>&copy; ${year} Rudrexa Technologies. All rights reserved.</span>
            <span>${site.tagline}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderCards(targetId, items, template) {
    const mount = byId(targetId);

    if (!mount) {
      return;
    }

    mount.innerHTML = items.map(template).join("");
  }

  function renderServiceCards(targetId, list) {
    renderCards(targetId, list, (item, index) => `
      <article class="card service-card service-card--${item.slug}">
        <div class="card-top">
          <div class="card-icon" aria-hidden="true">${getServiceIcon(item.slug)}</div>
          <span class="micro-label">0${index + 1}</span>
        </div>
        <div class="card-copy">
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
          <p class="service-card__detail">${item.capabilities[0]}</p>
        </div>
        <div class="card-footer">
          <a class="ghost-button" href="${withBase(`/services/${item.slug}/`)}">Explore service</a>
        </div>
      </article>
    `);
  }

  function renderCaseStudyCards(targetId, list) {
    renderCards(targetId, list, (item) => `
      <article class="card case-study-card">
        <div class="case-study-visual">
          <img
            src="${getCaseStudyImage(item.slug).src}"
            alt="${item.name} concept project visual"
            width="2049"
            height="1152"
            style="object-position: ${getCaseStudyImage(item.slug).position};"
          />
          <div class="case-study-visual__overlay">
            <div class="case-study-visual__bar"><span></span><span></span><span></span></div>
            <div class="case-study-visual__rail">
              <span>${item.industry}</span>
              <span>${item.services[0]}</span>
              <span>${item.services[1] || item.services[0]}</span>
            </div>
          </div>
        </div>
        <div class="card-copy">
          <span class="tag">${item.label}</span>
          <h3>${item.name}</h3>
          <p class="card-lead"><strong>Problem</strong> ${summarize(item.challenge, 110)}</p>
          <div class="service-badges">${renderBadges(item.services, "service-badge", 3)}</div>
          <p><strong>Delivered</strong> Brand structure, interface direction and digital delivery planning for a more coherent product experience.</p>
          <p><strong>Status</strong> ${summarize(item.result, 108)}</p>
        </div>
        <div class="card-footer">
          <a class="ghost-button" href="${withBase(`/work/${item.slug}/`)}">Read case study</a>
        </div>
      </article>
    `);
  }

  function renderArticleCards(targetId, list) {
    renderCards(targetId, list, (item, index) => `
      <article class="card article-card ${index === 0 ? "article-card--featured" : ""}">
        <div class="article-card__cover" aria-hidden="true">
          <img src="${withBase(`/assets/img/rudrexa_logo_icon.png`)}" alt="" width="2000" height="2000" />
          <span>${item.readingTime}</span>
        </div>
        <div class="card-top">
          <div class="card-icon" aria-hidden="true">${getArticleIcon()}</div>
          <span class="tag">Insight</span>
        </div>
        <div class="card-copy">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <p class="muted">${item.author} · ${item.readingTime}</p>
        </div>
        <div class="card-footer">
          <a class="ghost-button" href="${withBase(`/insights/${item.slug}/`)}">Read article</a>
        </div>
      </article>
    `);
  }

  function renderFaqs(targetId, list) {
    const mount = byId(targetId);

    if (!mount) {
      return;
    }

    mount.innerHTML = list
      .map(
        (item) => `
          <details class="faq-item">
            <summary>${item.q}</summary>
            <p>${item.a}</p>
          </details>
        `,
      )
      .join("");
  }

  function renderProcess(targetId) {
    const mount = byId(targetId);

    if (!mount) {
      return;
    }

    mount.innerHTML = process
      .map(
        (item, index) => `
          <article class="process-card">
            <div class="process-index">${index + 1}</div>
            <div>
              <h3>${item.name}</h3>
              <p>${item.text}</p>
            </div>
            <div class="process-meta">
              <strong>Client receives</strong>
              <span>${getProcessMeta(index).deliverable}</span>
              <strong>Typical timeframe</strong>
              <span>${getProcessMeta(index).timeframe}</span>
            </div>
          </article>
        `,
      )
      .join("");
  }

  function renderOutcomes(targetId) {
    renderCards(targetId, outcomes, (item) => `
      <article class="card">
        <h3>${item}</h3>
        <p>Rudrexa aligns design, engineering and operational thinking around this outcome.</p>
      </article>
    `);
  }

  function renderModels(targetId) {
    renderCards(targetId, engagementModels, (item, index) => `
      <article class="card model-card ${index === 1 ? "model-card--featured" : ""}">
        <div class="card-top">
          <div class="card-icon" aria-hidden="true">${getModelIcon(item.title)}</div>
          <span class="tag">${index === 1 ? "Recommended" : item.title}</span>
        </div>
        <div class="card-copy">
          <h3>${getModelLabel(item.title)}</h3>
          <p>${item.text}</p>
          <ul class="stack-list model-points">${getModelDetails(item.title).map((point) => `<li>${point}</li>`).join("")}</ul>
          <p class="muted">Request a tailored proposal.</p>
        </div>
        <div class="card-footer">
          <a class="ghost-button" href="${withBase(`/start-project/`)}">Start a conversation</a>
        </div>
      </article>
    `);
  }

  function renderValues(targetId) {
    renderCards(targetId, values, (item) => `
      <article class="card">
        <h3>${item}</h3>
        <p>This principle shapes how Rudrexa Technologies scopes, communicates and delivers work.</p>
      </article>
    `);
  }

  function renderBreadcrumbs(items) {
    const mount = document.querySelector("[data-breadcrumbs]");

    if (!mount) {
      return;
    }

    mount.innerHTML = items
      .map((item) =>
        item.href
          ? `<span><a href="${item.href.startsWith("/") ? withBase(item.href) : item.href}">${item.label}</a></span>`
          : `<span>${item.label}</span>`,
      )
      .join("");
  }

  function injectJsonLd(schema) {
    const mount = document.querySelector("[data-jsonld]");

    if (!mount) {
      return;
    }

    mount.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
  }

  function initMotion() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const revealTargets = document.querySelectorAll(
      "section, .card, .detail-box, .compare-card, .process-card, .contact-card, .faq-item, .cta-strip",
    );

    revealTargets.forEach((item, index) => {
      item.classList.add("reveal");
      item.style.setProperty("--reveal-delay", `${Math.min(index * 22, 220)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealTargets.forEach((item) => observer.observe(item));
  }

  function initScrollState() {
    const sync = () => {
      document.body.classList.toggle("scrolled", window.scrollY > 8);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  function organizationSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Rudrexa Technologies",
      alternateName: "Rudrexa",
      url: site.baseUrl,
      description: site.description,
      address: site.contact.address,
      email: site.contact.email,
    };

    return schema;
  }

  function renderHome() {
    renderServiceCards("home-services", services);
    renderProcess("home-process");
    renderCaseStudyCards("home-work", caseStudies.slice(0, 2));
    renderModels("home-models");
    renderArticleCards("home-insights", articles.slice(0, 3));
    renderFaqs("home-faqs", homeFaqs);
    injectJsonLd([
      organizationSchema(),
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Rudrexa",
        url: site.baseUrl,
      },
    ]);
  }

  function renderServicesOverview() {
    renderServiceCards("services-grid", services);
    renderProcess("services-process");
    renderCaseStudyCards("services-work", caseStudies);
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Services" },
    ]);
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: services.map((item, index) => ({
        "@type": "Service",
        position: index + 1,
        name: item.title,
        url: siteUrl(`/services/${item.slug}/`),
      })),
    });
  }

  function renderServiceDetail() {
    const slug = document.body.dataset.service || slugFromPath();
    const service = serviceBySlug[slug];
    const mount = document.querySelector("[data-service-detail]");

    if (!service || !mount) {
      return;
    }

    const relatedServices = service.related.map((related) => serviceBySlug[related]).filter(Boolean);

    mount.innerHTML = `
      <section class="page-hero">
        <div class="container story-grid">
          <div>
            <div class="breadcrumbs" data-breadcrumbs></div>
            <p class="eyebrow">Services</p>
            <h1>${service.title}</h1>
            <p class="lede">${service.hero}</p>
            <div class="stack-row">
              <a class="cta-button cta-button--accent" href="${withBase(`/start-project/`)}">Start a Project</a>
              <a class="ghost-button" href="${withBase(`/contact/`)}">Talk to Rudrexa</a>
            </div>
          </div>
          <aside class="detail-box">
            <span class="tag">Rudrexa Technologies</span>
            <h3>What this service supports</h3>
            <p>${service.intro}</p>
            <p class="muted">${site.contact.locationLine}</p>
          </aside>
        </div>
      </section>
      <section>
        <div class="container grid-3">
          <article class="detail-box">
            <h3>Business problems it solves</h3>
            <ul>${service.problems.map((item) => `<li>${item}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h3>Specific capabilities</h3>
            <ul>${service.capabilities.map((item) => `<li>${item}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h3>Who this is for</h3>
            <ul>${service.audience.map((item) => `<li>${item}</li>`).join("")}</ul>
          </article>
        </div>
      </section>
      <section>
        <div class="container">
          <div class="section-header section-copy">
            <p class="eyebrow">Process</p>
            <h2 class="section-title">A clear path from idea to implementation.</h2>
          </div>
          <div class="process-flow" id="service-process-flow"></div>
        </div>
      </section>
      <section>
        <div class="container">
          <div class="section-header section-copy">
            <p class="eyebrow">Related Services</p>
            <h2 class="section-title">Connected capabilities that work together.</h2>
          </div>
          <div class="grid-3" id="related-services"></div>
        </div>
      </section>
      <section>
        <div class="container">
          <div class="section-header section-copy">
            <p class="eyebrow">Questions</p>
            <h2 class="section-title">Answers before the project starts.</h2>
          </div>
          <div class="faq-list" id="service-faqs"></div>
        </div>
      </section>
      <section class="page-spacer">
        <div class="container">
          <div class="cta-strip">
            <div>
              <h2>Ready to plan this service around your business?</h2>
              <p>Share your scope, timeline and priorities with Rudrexa.</p>
            </div>
            <a class="cta-button cta-button--accent" href="${withBase(`/start-project/`)}">Start Your Project</a>
          </div>
        </div>
      </section>
    `;

    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Services", href: "/services/" },
      { label: service.title },
    ]);
    renderProcess("service-process-flow");
    renderServiceCards("related-services", relatedServices);
    renderFaqs("service-faqs", service.faqs);
    injectJsonLd([
      organizationSchema(),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        provider: {
          "@type": "Organization",
          name: "Rudrexa Technologies",
        },
        areaServed: "Nepal and international remote clients",
        url: siteUrl(`/services/${service.slug}/`),
        description: service.hero,
      },
    ]);
  }

  function renderSolutionDetail() {
    const slug = document.body.dataset.solution || slugFromPath();
    const solution = solutionBySlug[slug];
    const mount = document.querySelector("[data-solution-detail]");

    if (!solution || !mount) {
      return;
    }

    mount.innerHTML = `
      <section class="page-hero">
        <div class="container overview-grid">
          <div>
            <div class="breadcrumbs" data-breadcrumbs></div>
            <p class="eyebrow">Solutions</p>
            <h1>${solution.title}</h1>
            <p class="lede">${solution.hero}</p>
          </div>
          <aside class="detail-box">
            <span class="tag">Who this is for</span>
            <p>${solution.summary}</p>
            <a class="cta-button cta-button--accent" href="${withBase(`/start-project/`)}">Start a Project</a>
          </aside>
        </div>
      </section>
      <section>
        <div class="container grid-2">
          <article class="detail-box">
            <h3>Common challenges</h3>
            <ul>${solution.challenges.map((item) => `<li>${item}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h3>What Rudrexa can deliver</h3>
            <ul>${solution.deliverables.map((item) => `<li>${item}</li>`).join("")}</ul>
          </article>
        </div>
      </section>
      <section>
        <div class="container">
          <div class="notice">
            Rudrexa works with businesses in Nepal and remotely with international clients that want a Nepal-based development and digital partner.
          </div>
        </div>
      </section>
      <section class="page-spacer">
        <div class="container">
          <div class="cta-strip">
            <div>
              <h2>Need a delivery model that matches your stage?</h2>
              <p>Tell Rudrexa where the business is now and what should happen next.</p>
            </div>
            <a class="cta-button cta-button--accent" href="${withBase(`/start-project/`)}">Request a tailored proposal</a>
          </div>
        </div>
      </section>
    `;

    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Solutions" },
      { label: solution.title },
    ]);
    injectJsonLd(organizationSchema());
  }

  function renderWorkOverview() {
    renderCaseStudyCards("work-grid", caseStudies);
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Work" },
    ]);
    injectJsonLd(organizationSchema());
  }

  function renderCaseStudyDetail() {
    const slug = document.body.dataset.caseStudy || slugFromPath();
    const study = caseStudyBySlug[slug];
    const mount = document.querySelector("[data-case-study-detail]");

    if (!study || !mount) {
      return;
    }

    mount.innerHTML = `
      <section class="page-hero">
        <div class="container story-grid">
          <div>
            <div class="breadcrumbs" data-breadcrumbs></div>
            <span class="tag">${study.label}</span>
            <h1>${study.name}</h1>
            <p class="lede">${study.challenge}</p>
          </div>
          <aside class="detail-box">
            <p><strong>Industry:</strong> ${study.industry}</p>
            <p><strong>Location:</strong> ${study.location}</p>
            <p><strong>Services:</strong> ${study.services.join(", ")}</p>
            <p>${study.result}</p>
          </aside>
        </div>
      </section>
      <section>
        <div class="container grid-2">
          <article class="detail-box">
            <h3>Overview</h3>
            <p>${study.overview}</p>
          </article>
          <article class="detail-box">
            <h3>Short result</h3>
            <p>${study.result}</p>
          </article>
        </div>
      </section>
      <section>
        <div class="container grid-2" id="case-study-sections"></div>
      </section>
      <section class="page-spacer">
        <div class="container">
          <div class="cta-strip">
            <div>
              <h2>Need something similar for your business?</h2>
              <p>Use this concept project as a starting point and shape it around your real requirements.</p>
            </div>
            <a class="cta-button cta-button--accent" href="${withBase(`/start-project/`)}">Discuss your project</a>
          </div>
        </div>
      </section>
    `;

    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Work", href: "/work/" },
      { label: study.name },
    ]);
    renderCards("case-study-sections", study.sections, (item) => `
      <article class="detail-box">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `);
    injectJsonLd(organizationSchema());
  }

  function renderInsightsOverview() {
    renderArticleCards("insights-grid", articles);
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Insights" },
    ]);
    injectJsonLd(organizationSchema());
  }

  function renderArticleDetail() {
    const slug = document.body.dataset.article || slugFromPath();
    const article = articleBySlug[slug];
    const mount = document.querySelector("[data-article-detail]");

    if (!article || !mount) {
      return;
    }

    const tocItems = article.sections
      .map(
        (section) =>
          `<li><a href="#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${section.heading}</a></li>`,
      )
      .join("");

    mount.innerHTML = `
      <section class="page-hero">
        <div class="container story-grid">
          <article>
            <div class="breadcrumbs" data-breadcrumbs></div>
            <p class="eyebrow">Insights</p>
            <h1>${article.title}</h1>
            <p class="lede">${article.description}</p>
            <div class="article-meta">
              <span>${article.author}</span>
              <span>${article.updated}</span>
              <span>${article.readingTime}</span>
            </div>
          </article>
          <aside class="toc">
            <strong>Table of contents</strong>
            <ol>${tocItems}</ol>
          </aside>
        </div>
      </section>
      <section>
        <div class="container story-grid">
          <article>
            <p class="notice">${article.intro}</p>
            ${article.sections
              .map(
                (section) => `
                  <section id="${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
                    <h2>${section.heading}</h2>
                    ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
                  </section>
                `,
              )
              .join("")}
          </article>
          <aside class="detail-box">
            <h3>Related services</h3>
            <ul>
              <li><a href="${withBase(`/services/web-development/`)}">Web Development</a></li>
              <li><a href="${withBase(`/services/software-saas/`)}">Software & SaaS</a></li>
              <li><a href="${withBase(`/services/ai-automation/`)}">AI & Automation</a></li>
            </ul>
            <a class="cta-button cta-button--accent" href="${withBase(`/start-project/`)}">Start a Project</a>
          </aside>
        </div>
      </section>
      <section class="page-spacer">
        <div class="container">
          <div class="section-header section-copy">
            <p class="eyebrow">More Insights</p>
            <h2 class="section-title">Keep exploring related topics.</h2>
          </div>
          <div class="grid-3" id="related-articles"></div>
        </div>
      </section>
    `;

    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Insights", href: "/insights/" },
      { label: article.title },
    ]);
    renderArticleCards(
      "related-articles",
      articles.filter((item) => item.slug !== article.slug).slice(0, 2),
    );
    injectJsonLd([
      organizationSchema(),
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        dateModified: article.updated,
        datePublished: article.updated,
        author: {
          "@type": "Person",
          name: article.author,
        },
        publisher: {
          "@type": "Organization",
          name: "Rudrexa Technologies",
        },
        url: siteUrl(`/insights/${article.slug}/`),
      },
    ]);
  }

  function renderAboutPage() {
    renderValues("about-values");
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "About" },
    ]);
    injectJsonLd([
      organizationSchema(),
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Rudrexa Technologies",
        url: siteUrl("/about/"),
      },
    ]);
  }

  function renderProcessPage() {
    renderProcess("process-grid");
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Process" },
    ]);
    injectJsonLd(organizationSchema());
  }

  function renderProductsPage() {
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Products" },
    ]);
    injectJsonLd(organizationSchema());
  }

  function renderContactPage() {
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Contact" },
    ]);
    injectJsonLd([
      organizationSchema(),
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Rudrexa",
        url: siteUrl("/contact/"),
      },
    ]);
  }

  function renderStartProjectPage() {
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Start a Project" },
    ]);
    injectJsonLd(organizationSchema());
  }

  function renderLegalPage(label) {
    renderBreadcrumbs([
      { label: "Home", href: "/" },
      { label },
    ]);
    injectJsonLd(organizationSchema());
  }

  function initByPage() {
    const page = document.body.dataset.page;

    switch (page) {
      case "home":
        renderHome();
        break;
      case "services":
        renderServicesOverview();
        break;
      case "service-detail":
        renderServiceDetail();
        break;
      case "solution-detail":
        renderSolutionDetail();
        break;
      case "work":
        renderWorkOverview();
        break;
      case "case-study-detail":
        renderCaseStudyDetail();
        break;
      case "insights":
        renderInsightsOverview();
        break;
      case "article-detail":
        renderArticleDetail();
        break;
      case "about":
        renderAboutPage();
        break;
      case "process":
        renderProcessPage();
        break;
      case "products":
        renderProductsPage();
        break;
      case "contact":
        renderContactPage();
        break;
      case "start-project":
        renderStartProjectPage();
        break;
      case "privacy":
        renderLegalPage("Privacy Policy");
        break;
      case "terms":
        renderLegalPage("Terms");
        break;
      default:
        injectJsonLd(organizationSchema());
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    renderHeader();
    renderFooter();
    initByPage();
    initScrollState();
    initMotion();
    const yearMount = document.querySelector("[data-year]");

    if (yearMount) {
      yearMount.textContent = year;
    }
  });
})();
