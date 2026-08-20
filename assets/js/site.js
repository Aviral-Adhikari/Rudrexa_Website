(function () {
  const data = window.RudrexaContent;

  if (!data) {
    return;
  }

  const { site, navigation, services, solutions, caseStudies, articles, process, outcomes, engagementModels, values, homeFaqs } = data;

  const byId = (id) => document.getElementById(id);
  const slugFromPath = () =>
    window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean).pop() || "";
  const currentPath = () => window.location.pathname.replace(/index\.html$/, "");
  const siteUrl = (path) => `${site.baseUrl}${path}`;
  const year = new Date().getFullYear();

  const serviceBySlug = Object.fromEntries(services.map((item) => [item.slug, item]));
  const solutionBySlug = Object.fromEntries(solutions.map((item) => [item.slug, item]));
  const caseStudyBySlug = Object.fromEntries(caseStudies.map((item) => [item.slug, item]));
  const articleBySlug = Object.fromEntries(articles.map((item) => [item.slug, item]));

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

    const serviceLinks = navigation.services
      .map(
        (item) =>
          `<a href="/services/${item.slug}/">${item.label}</a>`,
      )
      .join("");

    const solutionLinks = navigation.solutions
      .map(
        (item) =>
          `<a href="/solutions/${item.slug}/">${item.label}</a>`,
      )
      .join("");

    mount.innerHTML = `
      <div class="site-header">
        <div class="container nav-shell">
          <a href="/" class="wordmark" aria-label="Rudrexa home">RUDRE<span>X</span>A</a>
          <nav class="desktop-nav" aria-label="Main navigation">
            <div class="dropdown">
              <button class="dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">Services</button>
              <div class="dropdown-menu" role="menu">${serviceLinks}</div>
            </div>
            <div class="dropdown">
              <button class="dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">Solutions</button>
              <div class="dropdown-menu" role="menu">${solutionLinks}</div>
            </div>
            <a class="nav-link ${isActive("/work") ? "active" : ""}" href="/work/">Work</a>
            <a class="nav-link ${isActive("/products") ? "active" : ""}" href="/products/">Products</a>
            <a class="nav-link ${isActive("/about") ? "active" : ""}" href="/about/">About</a>
            <a class="nav-link ${isActive("/insights") ? "active" : ""}" href="/insights/">Insights</a>
          </nav>
          <div class="header-cta">
            <a class="cta-button cta-button--accent" href="/start-project/">Start a Project</a>
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
          <a href="/" class="wordmark">RUDRE<span>X</span>A</a>
          <button class="mobile-toggle" type="button" data-close-menu aria-label="Close navigation">
            <span></span>
          </button>
        </div>
        <div class="mobile-panel__groups">
          <details class="mobile-group">
            <summary>Services</summary>
            ${serviceLinks}
          </details>
          <details class="mobile-group">
            <summary>Solutions</summary>
            ${solutionLinks}
          </details>
        </div>
        <nav aria-label="Mobile navigation">
          <a class="nav-link" href="/work/">Work</a>
          <a class="nav-link" href="/products/">Products</a>
          <a class="nav-link" href="/about/">About</a>
          <a class="nav-link" href="/insights/">Insights</a>
          <a class="cta-button cta-button--accent" href="/start-project/">Start a Project</a>
        </nav>
      </div>
    `;

    const mobilePanel = mobileMount;
    const openButton = mount.querySelector(".mobile-toggle");
    const closeButton = mobileMount.querySelector("[data-close-menu]");
    const dropdownButtons = mount.querySelectorAll(".dropdown-toggle");

    dropdownButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const parent = button.closest(".dropdown");
        const expanded = parent.classList.toggle("open");
        button.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".dropdown")) {
        mount.querySelectorAll(".dropdown").forEach((item) => item.classList.remove("open"));
        mount
          .querySelectorAll(".dropdown-toggle")
          .forEach((button) => button.setAttribute("aria-expanded", "false"));
      }
    });

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
      .map((item) => `<li><a href="/services/${item.slug}/">${item.menu}</a></li>`)
      .join("");
    const companyList = `
      <li><a href="/about/">About</a></li>
      <li><a href="/process/">Process</a></li>
      <li><a href="/products/">Products</a></li>
      <li><a href="/contact/">Contact</a></li>
    `;
    const insightsList = articles
      .map((item) => `<li><a href="/insights/${item.slug}/">${item.title}</a></li>`)
      .join("");

    mount.innerHTML = `
      <div class="site-footer">
        <div class="container">
          <div class="footer-shell">
            <div>
              <a href="/" class="wordmark">RUDRE<span>X</span>A</a>
              <p>Rudrexa Technologies brings strategy, design, technology, growth and security together under one partnership.</p>
              <p class="muted">Everything Digital. One Partner.</p>
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
              <h3>Insights</h3>
              <ul>${insightsList}</ul>
            </div>
            <div>
              <h3>Contact</h3>
              <ul>
                <li>${site.contact.address}</li>
                <li>${site.contact.phone}</li>
                <li>${site.contact.email}</li>
                <li>${site.contact.social}</li>
                <li><a href="/privacy-policy/">Privacy Policy</a></li>
                <li><a href="/terms/">Terms</a></li>
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
      <article class="card">
        <div class="card-icon" aria-hidden="true"></div>
        <span class="micro-label">0${index + 1}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <a class="ghost-button" href="/services/${item.slug}/">Explore service</a>
      </article>
    `);
  }

  function renderCaseStudyCards(targetId, list) {
    renderCards(targetId, list, (item) => `
      <article class="card">
        <span class="tag">${item.label}</span>
        <h3>${item.name}</h3>
        <p><strong>Industry:</strong> ${item.industry}</p>
        <p><strong>Challenge:</strong> ${item.challenge}</p>
        <p><strong>Services:</strong> ${item.services.join(", ")}</p>
        <p>${item.result}</p>
        <a class="ghost-button" href="/work/${item.slug}/">Read case study</a>
      </article>
    `);
  }

  function renderArticleCards(targetId, list) {
    renderCards(targetId, list, (item) => `
      <article class="card">
        <span class="tag">Insight</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p class="muted">${item.author} · ${item.readingTime}</p>
        <a class="ghost-button" href="/insights/${item.slug}/">Read article</a>
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
    renderCards(targetId, engagementModels, (item) => `
      <article class="card">
        <span class="tag">${item.title}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <p class="muted">Request a tailored proposal.</p>
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
        item.href ? `<span><a href="${item.href}">${item.label}</a></span>` : `<span>${item.label}</span>`,
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

  function organizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Rudrexa Technologies",
      alternateName: "Rudrexa",
      url: site.baseUrl,
      description: site.description,
      address: site.contact.address,
      email: site.contact.email,
      telephone: site.contact.phone,
    };
  }

  function renderHome() {
    renderServiceCards("home-services", services);
    renderOutcomes("home-outcomes");
    renderProcess("home-process");
    renderCaseStudyCards("home-work", caseStudies);
    renderModels("home-models");
    renderArticleCards("home-insights", articles);
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
              <a class="cta-button cta-button--accent" href="/start-project/">Start a Project</a>
              <a class="ghost-button" href="/contact/">Talk to Rudrexa</a>
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
            <a class="cta-button cta-button--accent" href="/start-project/">Start Your Project</a>
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
            <a class="cta-button cta-button--accent" href="/start-project/">Start a Project</a>
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
            <a class="cta-button cta-button--accent" href="/start-project/">Request a tailored proposal</a>
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
            <a class="cta-button cta-button--accent" href="/start-project/">Discuss your project</a>
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
              <li><a href="/services/web-development/">Web Development</a></li>
              <li><a href="/services/software-saas/">Software & SaaS</a></li>
              <li><a href="/services/ai-automation/">AI & Automation</a></li>
            </ul>
            <a class="cta-button cta-button--accent" href="/start-project/">Start a Project</a>
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
    renderHeader();
    renderFooter();
    initByPage();
    const yearMount = document.querySelector("[data-year]");

    if (yearMount) {
      yearMount.textContent = year;
    }
  });
})();
