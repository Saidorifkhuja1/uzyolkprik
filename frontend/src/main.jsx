import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  HardHat,
  Languages,
  Layers,
  Mail,
  MapPin,
  Menu,
  Moon,
  MoveRight,
  Package,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { API_DOCS, fetchSite } from "./api";
import "./styles.css";

// ============================================================
// TRANSLATIONS — O'zbek (default), Rus, Ingliz
// ============================================================
const TRANSLATIONS = {
  uz: {
    loading: "Sayt ma\u02bclumotlari yuklanmoqda...",
    backendCheck: "Backend ishlayotganini tekshiring: http://127.0.0.1:8000",
    pageNotFound: "Sahifa topilmadi",
    contact: "Aloqa",
    searchPlaceholder: "Sahifa nomi yoki kalit s\u02bcozni kiriting...",
    searchTitle: "Sayt b\u02bcyicha qidiruv",
    searchPageLabel: "Sayt sahifasi",
    legalSmall: "klasteri davlat muassasasi",
    heroBtn1: "Katalogni k\u02bcrishch",
    heroBtn2: "Bog\u02bclanish",
    lang: "UZ",
  },
  ru: {
    loading: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 \u0441\u0430\u0439\u0442\u0430...",
    backendCheck: "\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0440\u0430\u0431\u043e\u0442\u0443 \u0431\u0430\u0441\u044f: http://127.0.0.1:8000",
    pageNotFound: "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430",
    contact: "\u0421\u0432\u044f\u0437\u044c",
    searchPlaceholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0438\u043b\u0438 \u043a\u043b\u044e\u0447\u0435\u0432\u043e\u0435 \u0441\u043b\u043e\u0432\u043e...",
    searchTitle: "\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u0441\u0430\u0439\u0442\u0443",
    searchPageLabel: "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0441\u0430\u0439\u0442\u0430",
    legalSmall: "\u0433\u043e\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0435 \u0443\u0447\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435 \u043a\u043b\u0430\u0441\u0442\u0435\u0440\u0430",
    heroBtn1: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043a\u0430\u0442\u0430\u043b\u043e\u0433",
    heroBtn2: "\u0421\u0432\u044f\u0437\u0430\u0442\u044c\u0441\u044f",
    lang: "RU",
  },
  en: {
    loading: "Loading site data...",
    backendCheck: "Check that backend is running: http://127.0.0.1:8000",
    pageNotFound: "Page not found",
    contact: "Contact",
    searchPlaceholder: "Enter page name or keyword...",
    searchTitle: "Search the site",
    searchPageLabel: "Site page",
    legalSmall: "state cluster institution",
    heroBtn1: "View catalog",
    heroBtn2: "Get in touch",
    lang: "EN",
  },
};

// Pristine Default High-Tech Bridge Plant & Concrete Cluster Asset
const DEFAULT_ASSETS = {
  logo: "/logo.png",

  hero: "/plant_hero.png",
  plant: "/plant_hero.png",
  contact: "/plant_hero.png",

  leaders: [
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none"><rect width="400" height="400" fill="%230E1726"/><circle cx="200" cy="140" r="60" fill="%2306B6D4" opacity="0.4"/><path d="M100 340 C 100 240, 300 240, 300 340" fill="%230F766E" opacity="0.6"/><text x="200" y="380" fill="%23F8FAFC" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">Raxbar</text></svg>`,
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none"><rect width="400" height="400" fill="%230E1726"/><circle cx="200" cy="140" r="60" fill="%23F59E0B" opacity="0.4"/><path d="M100 340 C 100 240, 300 240, 300 340" fill="%233B82F6" opacity="0.6"/><text x="200" y="380" fill="%23F8FAFC" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">Bosh Muhandis</text></svg>`,
  ],
};

function App() {
  const [site, setSite] = useState(null);
  const [loadError, setLoadError] = useState("");
  const getInitialSlug = () => {
    const hash = window.location.hash.replace("#", "");
    return hash || "bosh-sahifa";
  };
  const [activeSlug, setActiveSlug] = useState(getInitialSlug);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Theme: dark (default) | light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("uz_theme") || "dark";
  });

  // Language: uz (default) | ru | en
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("uz_lang") || "uz";
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("uz_theme", theme);
  }, [theme]);

  // Apply lang to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("uz_lang", lang);
  }, [lang]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const changeLang = (newLang) => setLang(newLang);

  useEffect(() => {
    fetchSite()
      .then((data) => {
        setSite(data);
        setLoadError("");
      })
      .catch((error) => {
        setSite(null);
        setLoadError(error.message || "Sayt ma'lumotlarini yuklab bo'lmadi");
      });

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveSlug(hash || "bosh-sahifa");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const activePage = useMemo(() => {
    if (!site) return null;
    return site.pages.find((page) => page.slug === activeSlug) || site.pages[0];
  }, [site, activeSlug]);

  if (!site) {
    return (
      <main className="loading-screen">
        <div className="loading-mark">OʻY</div>
        {loadError ? (
          <div style={{ maxWidth: 480 }}>
            <p style={{ color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>{loadError}</p>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>{t.backendCheck}</p>
          </div>
        ) : (
          <p style={{ color: "#94a3b8" }}>{t.loading}</p>
        )}
      </main>
    );
  }

  const navigate = (slug) => {
    window.location.hash = slug === "bosh-sahifa" ? "" : slug;
    setActiveSlug(slug);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        site={site}
        activeSlug={activeSlug}
        onNavigate={navigate}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onOpenSearch={() => setSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onChangeLang={changeLang}
        t={t}
      />
      <main>
        <PageRenderer page={activePage} site={site} onNavigate={navigate} t={t} lang={lang} />
      </main>
      <Footer site={site} onNavigate={navigate} t={t} />

      {searchOpen && (
        <SearchModal site={site} onClose={() => setSearchOpen(false)} onNavigate={navigate} t={t} />
      )}
    </>
  );
}

function Header({ site, activeSlug, onNavigate, menuOpen, setMenuOpen, onOpenSearch, theme, onToggleTheme, lang, onChangeLang, t }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const closeAll = () => {
      setOpenDropdown(null);
      setLangMenuOpen(false);
    };
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  const navigate = (slug) => {
    setOpenDropdown(null);
    onNavigate(slug);
  };

  const logoSrc = "/logo.png";

  const langLabels = { uz: "O'Z", ru: "RU", en: "EN" };
  const allLangs = ["uz", "ru", "en"];

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="top-strip-info">
          <span className="top-strip-item">
            <Building2 size={14} />
            {site.brand.legalName}
          </span>
          <span className="top-strip-item">
            <Clock3 size={14} />
            {site.contact.hours}
          </span>
        </div>
        <div className="top-strip-info">
          <a href={`mailto:${site.contact.email}`} className="top-strip-item">
            <Mail size={14} />
            {site.contact.email}
          </a>
        </div>
      </div>

      <div className="nav-wrap">
        <button className="brand-button" onClick={() => onNavigate("bosh-sahifa")}>
          <img
            src={logoSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_ASSETS.logo;
            }}
            alt="Oʻzyoʻlkoʻprik logotipi"
            style={{ borderRadius: "50%", background: theme === "light" ? "rgba(0,0,0,0.06)" : "transparent" }}
          />
          <div className="brand-text">
            <strong>{site.brand.name}</strong>
            <small>{t.legalSmall}</small>
          </div>
        </button>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Asosiy menyu">
          {site.navigation.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              activeSlug={activeSlug}
              onNavigate={navigate}
              isOpen={openDropdown === item.slug}
              onToggle={(event) => {
                event.stopPropagation();
                setOpenDropdown(openDropdown === item.slug ? null : item.slug);
              }}
            />
          ))}
        </nav>

        <div className="header-actions">
          {/* Language Switcher */}
          <div
            className="lang-switcher"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lang-switcher-btn"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-label="Tilni tanlang"
              title="Tilni o'zgartirish"
            >
              <Languages size={15} />
              <span>{langLabels[lang]}</span>
            </button>
            {langMenuOpen && (
              <div className="lang-dropdown">
                {allLangs.map((l) => (
                  <button
                    key={l}
                    className={lang === l ? "lang-option active" : "lang-option"}
                    onClick={() => {
                      onChangeLang(l);
                      setLangMenuOpen(false);
                    }}
                  >
                    {langLabels[l]}
                    {lang === l && <span className="lang-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Light rejimga o'tish" : "Dark rejimga o'tish"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Search */}
          <button className="icon-button" aria-label="Qidiruv" onClick={onOpenSearch}>
            <Search size={18} />
          </button>

          <button className="contact-button" onClick={() => navigate("qayta-aloqa")}>
            <Phone size={16} />
            <span>{t.contact}</span>
          </button>
          <button
            className="menu-button"
            aria-label="Menyuni ochish"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ item, activeSlug, onNavigate, isOpen, onToggle }) {
  const childActive = item.children?.some((child) => child.slug === activeSlug);
  const hasChildren = Boolean(item.children?.length);

  const handleClick = (event) => {
    if (hasChildren) {
      onToggle(event);
      return;
    }
    onNavigate(item.slug);
  };

  return (
    <div className={isOpen ? "nav-item is-open" : "nav-item"}>
      <button
        className={activeSlug === item.slug || childActive ? "nav-link active" : "nav-link"}
        onClick={handleClick}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        {item.label}
        {hasChildren && <ChevronDown size={14} />}
      </button>
      {hasChildren && isOpen && (
        <div className="nav-dropdown" onClick={(event) => event.stopPropagation()}>
          {item.children.map((child) => (
            <button key={child.slug} onClick={() => onNavigate(child.slug)}>
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchModal({ site, onClose, onNavigate }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return site.pages;
    const q = query.toLowerCase();
    return site.pages.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.status?.toLowerCase().includes(q)
    );
  }, [site, query]);

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h3 style={{ fontSize: 18 }}>{t?.searchTitle || "Qidiruv"}</h3>
          <button onClick={onClose} className="icon-button">
            <X size={18} />
          </button>
        </div>

        <div className="search-input-wrap">
          <Search size={20} />
          <input
            type="text"
            className="search-input"
            placeholder={t?.searchPlaceholder || "Kalit so'z kiriting..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="search-results">
          {results.map((page) => (
            <button
              key={page.slug}
              className="search-result-item"
              onClick={() => {
                onNavigate(page.slug);
                onClose();
              }}
            >
              <div>
                <strong style={{ display: "block" }}>{page.title}</strong>
                <small style={{ color: "var(--text-muted)" }}>{page.status || t?.searchPageLabel || "Sayt sahifasi"}</small>
              </div>
              <ArrowRight size={16} style={{ color: "var(--accent-cyan)" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageRenderer({ page, site, onNavigate }) {
  if (!page) {
    return (
      <section className="page-shell">
        <div className="glass-panel" style={{ padding: 48, textAlign: "center" }}>
          <Sparkles size={40} style={{ color: "#06b6d4", marginBottom: 16 }} />
          <h2>Sahifa topilmadi</h2>
        </div>
      </section>
    );
  }

  if (page.type === "home") return <Home site={site} onNavigate={onNavigate} />;
  if (page.type === "leaders") return <Leaders page={page} site={site} />;
  if (page.type === "document") return <DocumentPage page={page} site={site} />;
  if (page.type === "announcement") return <Announcement page={page} />;
  if (page.type === "contact") return <Contact site={site} />;
  if (page.slug === "narx-navo") return <PriceGridPage page={page} site={site} />;
  if (page.type === "filiallar" || page.slug === "filiallar") return <FiliallarPage page={page} site={site} />;
  return <StatusPage page={page} site={site} />;
}

function Home({ site, onNavigate }) {
  const quickLinks = [
    { label: "Katalog", slug: "katalog", detail: "Mahsulotlar va hujjatlar" },
    { label: "Rahbariyat", slug: "rahbariyat", detail: "Muassasa masʼullari" },
    { label: "Eʼlonlar", slug: "elonlar", detail: "Tanlovlar va xaridlar" },
    { label: "Qayta aloqa", slug: "qayta-aloqa", detail: "Manzil va telefonlar" },
  ];

  const heroSrc = site?.assets?.hero || DEFAULT_ASSETS.hero;
  const plantSrc = site?.assets?.plant || DEFAULT_ASSETS.plant;

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-kicker">
              <ShieldCheck size={16} />
              Respublika Koʻprik Infratuzilmasi
            </div>
            <h1 className="hero-title">{site.brand.legalName}</h1>
            <div className="hero-tagline">{site.brand.tagline}</div>
            <p className="hero-lead">{site.home.intro}</p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onNavigate("katalog")}>
                <span>Katalogni koʻrish</span>
                <MoveRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => onNavigate("qayta-aloqa")}>
                Bogʻlanish
              </button>
            </div>
          </div>

          <div className="hero-card">
            <img
              src={heroSrc}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_ASSETS.hero;
              }}
              alt="Koʻprik va ishlab chiqarish obyekti"
            />
            <div className="hero-card-overlay">
              <div className="hero-card-badge">
                <Layers size={14} />
                Yagona Klaster Modeli
              </div>
              <h3>Loyihalash → Ishlab chiqarish → Ekspluatatsiya</h3>
            </div>
          </div>
        </div>

        <div className="quick-access-strip">
          {quickLinks.map((link) => (
            <button
              key={link.slug}
              className="quick-link-card"
              onClick={() => onNavigate(link.slug)}
            >
              <div className="quick-link-content">
                <strong>{link.label}</strong>
                <small>{link.detail}</small>
              </div>
              <div className="quick-link-icon">
                <ArrowRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="metrics-band">
        <div className="metric-item">
          <div className="metric-number">{site.home.capabilities.length}</div>
          <div className="metric-label">Asosiy Yoʻnalish</div>
        </div>
        <div className="metric-item">
          <div className="metric-number">{site.home.tasks.length}</div>
          <div className="metric-label">Klaster Vazifasi</div>
        </div>
        <div className="metric-item">
          <div className="metric-number">{site.contact.phones.length}</div>
          <div className="metric-label">Aloqa Kanallari</div>
        </div>
        <div className="metric-item">
          <div className="metric-number">360°</div>
          <div className="metric-label">Toʻliq Nazorat</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">{site.home.modelEyebrow || "Klaster Modeli"}</span>
          <h2>{site.home.modelTitle || "Loyihadan tayyor konstruksiyagacha yagona boshqaruv"}</h2>
        </div>
        <div className="glass-panel" style={{ padding: 36, display: "grid", gap: 20 }}>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#e2e8f0" }}>{site.home.purpose}</p>
          <div
            style={{
              padding: 20,
              borderRadius: 14,
              background: "rgba(6, 182, 212, 0.08)",
              border: "1px solid rgba(6, 182, 212, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Sparkles size={24} style={{ color: "#06b6d4", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "#fff", display: "block" }}>Muassasa Jarayoni</strong>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>
                Diagnostika, ishlab chiqarish, tiklash va texnik soz holatda saqlash ishlari bitta operatsion tizimda birlashadi.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">{site.home.capabilitiesEyebrow || "Yoʻnalishlar"}</span>
          <h2>{site.home.capabilitiesTitle || "Koʻprik infratuzilmasi uchun asosiy xizmat bloklari"}</h2>
        </div>
        <div className="capability-grid">
          {site.home.capabilities.map((capability, index) => (
            <article className="capability-card" key={capability}>
              <div className="capability-top">
                <div className="capability-icon-wrap">
                  <IconForIndex index={index} />
                </div>
                <span className="capability-num">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{capability}</h3>
              <p>Muassasa tomonidan amalga oshiriladigan yuqori aniqlikdagi texnik va muhandislik xizmatlari yoʻnalishi.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">{site.home.workflowEyebrow || "Ish Oqimi"}</span>
          <h2>{site.home.workflowTitle || "Texnik qarordan amaliy natijagacha"}</h2>
        </div>
        <div className="process-grid">
          {["Diagnostika", "Loyihalash", "Ishlab chiqarish", "Ekspluatatsiya"].map((step, index) => (
            <article className="process-card" key={step}>
              <div className="process-step-num">{index + 1}</div>
              <h3>{step}</h3>
              <p>Koʻprik va sunʼiy inshootlar boʻyicha ketma-ketlik va sifat nazorati bosqichi.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="task-section-grid">
          <div className="task-visual-card">
            <img
              src={plantSrc}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_ASSETS.plant;
              }}
              alt="Ishlab chiqarish hududi"
            />
            <div className="task-visual-info">
              <strong>Operatsion Vazifalar</strong>
              <span>{site.home.tasks.length} ta faoliyat yoʻnalishi</span>
            </div>
          </div>

          <div>
            <div className="section-heading" style={{ marginBottom: 20 }}>
              <span className="eyebrow">{site.home.tasksEyebrow || "Vazifalar"}</span>
              <h2>{site.home.tasksTitle || "Klaster bajaradigan asosiy ishlar"}</h2>
            </div>
            <div className="task-list">
              {site.home.tasks.map((task, index) => (
                <div className="task-row" key={task}>
                  <span className="task-row-num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function IconForIndex({ index }) {
  const icons = [FileText, Building2, HardHat, ShieldCheck];
  const Icon = icons[index] || CheckCircle2;
  return <Icon size={24} />;
}

function StatusPage({ page, site }) {
  const pageImgSrc = page.imageUrl || site?.assets?.hero || DEFAULT_ASSETS.hero;

  return (
    <section className="page-shell">
      <PageHero title={page.title} label="Sahifa" />
      <div className="glass-panel" style={{ padding: 48, display: "grid", gap: 24 }}>
        
        {page.content ? (
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "#e2e8f0", textAlign: "left", whiteSpace: "pre-line" }}>
            {page.content}
          </p>
        ) : (
          <h2 style={{ fontSize: 24, color: "#e2e8f0", textAlign: "center" }}>{page.status || "Maʼlumot mavjud emas."}</h2>
        )}

        {page.fileUrl && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <a
              href={page.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ padding: "12px 24px", fontSize: 15 }}
              download
            >
              <span>Hujjatni yuklab olish</span>
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        <img
          src={pageImgSrc}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_ASSETS.hero;
          }}
          alt=""
          style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 16, marginTop: 16 }}
        />
      </div>
    </section>
  );
}

function Leaders({ page, site }) {
  return (
    <section className="page-shell">
      <PageHero title={page.title} label="Korxona haqida" />
      <div className="leaders-grid">
        {page.leaders.map((leader, idx) => {
          const leaderImg =
            site?.assets?.leaders?.[leader.imageIndex] ||
            DEFAULT_ASSETS.leaders[idx % DEFAULT_ASSETS.leaders.length];

          return (
            <article className="leader-card" key={leader.name}>
              {leader.imageIndex === null && !leaderImg ? (
                <div className="leader-placeholder">
                  <UserRound size={64} />
                </div>
              ) : (
                <img
                  src={leaderImg}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_ASSETS.leaders[idx % DEFAULT_ASSETS.leaders.length];
                  }}
                  alt={leader.name}
                />
              )}
              <div className="leader-info">
                <h2>{leader.name}</h2>
                <p className="position">{leader.position}</p>
                <dl>
                  <dt>Tugʻilgan sanasi va joyi:</dt>
                  <dd>{leader.born || "Maʼlumot kiritilmagan"}</dd>
                  <dt>Tamomlagan:</dt>
                  <dd>{leader.education || "Maʼlumot kiritilmagan"}</dd>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DocumentPage({ page, site }) {
  const defaultDesc = page.slug === "katalog"
    ? "Oʻzyoʻlkoʻprik klasteri rasmiy zavod mahsulotlari, koʻprik va temir-beton konstruksiyalari katalogi."
    : page.slug === "nomenklatura"
      ? "Oʻzyoʻlkoʻprik klasteri rasmiy zavod mahsulotlari va buyumlari nomenklaturasi."
      : "";

  const pageDesc = page.content || defaultDesc;

  let items = [];
  if (page.fileUrl) {
    items = [
      {
        id: "page-file",
        title: page.title,
        fileUrl: page.fileUrl,
        embedUrl: page.fileUrl,
      }
    ];
  }

  return (
    <section className="page-shell">
      <PageHero title={page.title} label="Zavod va Texnologiyalar" />
      <div style={{ display: "grid", gap: 32 }}>
        
        {pageDesc && (
          <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 16px auto" }}>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "#cbd5e1" }}>
              {pageDesc}
            </p>
          </div>
        )}

        {page.imageUrl && (
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
            <img
              src={page.imageUrl}
              alt=""
              style={{ width: "100%", maxHeight: 420, objectFit: "cover" }}
            />
          </div>
        )}

        {items.map((item, index) => {
          const embed = item.embedUrl;
          const isImage = /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjpg|png|svg|webp)$/i.test(item.fileUrl);

          return (
            <div key={item.id || index} style={{ display: "grid", gap: 24 }}>
              {embed && isImage && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={embed}
                    alt={item.title}
                    style={{ width: "100%", maxHeight: 600, objectFit: "contain", borderRadius: 8 }}
                  />
                </div>
              )}

              {embed && !isImage && (
                <div className="pdf-embed-container" style={{ marginTop: 0 }}>
                  <iframe
                    src={embed}
                    className="pdf-embed-frame"
                    title={item.title}
                    allow="autoplay"
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ padding: "16px 36px", fontSize: 16 }}
                  download
                >
                  <span>Hujjatni yuklab olish</span>
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Announcement({ page }) {
  return (
    <section className="page-shell">
      <PageHero title={page.title} label="Tanlov Savdolari" />
      <div className="announcement-box">
        <p style={{ fontSize: 16, color: "#e2e8f0", marginBottom: 24 }}>{page.intro}</p>
        <div className="equipment-grid">
          {page.items.map((item) => (
            <div className="equipment-badge" key={item}>
              <Wrench size={18} style={{ color: "#06b6d4" }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="proposal-card">
          <Mail size={24} style={{ color: "#06b6d4" }} />
          <div>
            <span style={{ color: "#94a3b8", display: "block", fontSize: 13 }}>
              Tijorat takliflarini yuborish uchun e-pochta:
            </span>
            <a href={`mailto:${page.email}`}>{page.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ site }) {
  return (
    <section className="page-shell">
      <PageHero title="Bogʻlanish va Manzil" label="Qayta Aloqa" />
      <div className="contact-layout">
        <div className="contact-cards">
          <InfoCard icon={Phone} title="Telefon raqamlar" lines={site.contact.phones} />
          <InfoCard icon={Mail} title="E-pochtamiz" lines={[site.contact.email]} />
          <InfoCard icon={Clock3} title="Ish vaqti" lines={[site.contact.hours]} />
          <InfoCard icon={BriefcaseBusiness} title="Hisob-raqam" lines={[site.contact.bank]} />
          <InfoCard icon={MapPin} title="Joylashuv manzili" lines={[site.contact.address]} />
        </div>
        <div className="map-panel">
          <iframe title="Oʻzyoʻlkoʻprik xaritada" src={site.contact.map} loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, lines }) {
  return (
    <article className="info-card">
      <div className="info-icon-wrap">
        <Icon size={20} />
      </div>
      <div>
        <h2>{title}</h2>
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  );
}

function PageHero({ title, label }) {
  return (
    <div className="page-hero">
      <span className="eyebrow">{label}</span>
      <h1>{title}</h1>
    </div>
  );
}

function Footer({ site, onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <strong>{site.brand.legalName}</strong>
        <p>{site.brand.tagline}</p>
        <div className="footer-links">
          <a href={API_DOCS.swagger} target="_blank" rel="noreferrer">
            API (Swagger)
          </a>
          <a href={API_DOCS.redoc} target="_blank" rel="noreferrer">
            API (ReDoc)
          </a>
        </div>
      </div>
      <button className="btn-primary" onClick={() => onNavigate("qayta-aloqa")}>
        <Mail size={16} />
        <span>Aloqa sahifasi</span>
      </button>
    </footer>
  );
}

function PriceGridPage({ page, site }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  const products = page.narxNavoProducts || [];
  const catalogItems = page.catalogItems || [];

  return (
    <section className="page-shell">
      <PageHero title={page.title} label="Maʼlumot" />

      {page.content && (
        <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 32px auto" }}>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "#cbd5e1", whiteSpace: "pre-line" }}>
            {page.content}
          </p>
        </div>
      )}

      {products.length === 0 && catalogItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>Hozircha hech qanday mahsulot yoki xizmat kiritilmagan.</p>
        </div>
      ) : null}

      {/* ── Mahsulotlar bo'limi ── */}
      {products.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, marginTop: 16 }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="glass-panel price-item-card"
                onClick={() => setSelectedProduct(product)}
                style={{
                  padding: 0, cursor: "pointer", display: "flex", flexDirection: "column",
                  transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  border: "1px solid var(--border-dim)", borderRadius: "var(--radius-md)",
                  overflow: "hidden", height: "100%",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.boxShadow = "var(--shadow-glow)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border-dim)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {product.imageUrl ? (
                  <div style={{ width: "100%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, minHeight: 200, maxHeight: 260, overflow: "hidden" }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: "100%", maxHeight: 260, objectFit: "contain", display: "block" }} />
                  </div>
                ) : (
                  <div style={{ width: "100%", height: 120, flexShrink: 0, background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.15))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Package size={40} style={{ color: "var(--accent-cyan)", opacity: 0.7 }} />
                  </div>
                )}
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", lineHeight: 1.3, margin: 0 }}>{product.name}</h3>
                  {product.text && (
                    <p style={{ fontSize: 14, color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.6, margin: 0 }}>
                      {product.text}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-cyan)", fontSize: 13, fontWeight: 600, marginTop: "auto", paddingTop: 8 }}>
                    {product.fileUrl && <FileText size={14} />}
                    <span>Batafsil koʻrish</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Katalog hujjatlari ── */}
      {catalogItems.length > 0 && (
        <div style={{ marginTop: products.length > 0 ? 16 : 0 }}>
          {products.length > 0 && <h2 style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", marginBottom: 20 }}>Katalog hujjatlari</h2>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {catalogItems.map((item) => (
              <div key={item.id} className="glass-panel price-item-card" onClick={() => setSelectedCatalog(item)}
                style={{ padding: 24, cursor: "pointer", display: "flex", flexDirection: "column", gap: 16, transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease", border: "1px solid var(--border-dim)", borderRadius: "var(--radius-md)", height: "100%" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.boxShadow = "var(--shadow-glow)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border-dim)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <FileText size={32} style={{ color: "var(--accent-cyan)" }} />
                  {item.fileUrl && <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 12, background: "rgba(6,182,212,0.15)", color: "var(--accent-cyan)", fontWeight: 600 }}>Fayl bor</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 8, color: "#ffffff", fontWeight: 600 }}>{item.title}</h3>
                  {item.description && <p style={{ fontSize: 14, color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>{item.description}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-cyan)", fontSize: 14, fontWeight: 600, marginTop: "auto" }}>
                  <span>Batafsil koʻrish</span><ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mahsulot modal ── */}
      {selectedProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }} onClick={() => setSelectedProduct(null)}>
          <div className="glass-panel" style={{ maxWidth: 640, width: "100%", position: "relative", animation: "fadeIn 0.2s ease-out", overflow: "hidden", borderRadius: "var(--radius-md)", maxHeight: "90vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            {/* Yopish tugmasi */}
            <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: 14, right: 14, color: "var(--text-muted)", cursor: "pointer", zIndex: 10, background: "rgba(0,0,0,0.5)", borderRadius: "50%", padding: 6, display: "flex", border: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
              <X size={18} />
            </button>

            {/* Scroll area */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {/* Rasm — to'liq ko'rinadi */}
              {selectedProduct.imageUrl && (
                <div style={{ width: "100%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    style={{ width: "100%", maxHeight: 380, objectFit: "contain", display: "block" }}
                  />
                </div>
              )}

              <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Nom */}
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", margin: 0, paddingRight: 32 }}>
                  {selectedProduct.name}
                </h2>

                {/* Matn */}
                {selectedProduct.text && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16 }}>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-main)", whiteSpace: "pre-line", margin: 0 }}>
                      {selectedProduct.text}
                    </p>
                  </div>
                )}

                {/* Fayl yuklab olish */}
                {selectedProduct.fileUrl && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16, display: "flex", justifyContent: "center" }}>
                    <a
                      href={selectedProduct.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{ padding: "12px 32px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}
                      download
                    >
                      <span>Faylni yuklab olish</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Katalog modal ── */}
      {selectedCatalog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 24 }} onClick={() => setSelectedCatalog(null)}>
          <div className="glass-panel" style={{ maxWidth: 600, width: "100%", padding: 32, position: "relative", display: "grid", gap: 24, animation: "fadeIn 0.2s ease-out" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedCatalog(null)} style={{ position: "absolute", top: 20, right: 20, color: "var(--text-muted)", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}><X size={24} /></button>
            <div>
              <span style={{ fontSize: 13, textTransform: "uppercase", color: "var(--accent-cyan)", fontWeight: 700, display: "block", marginBottom: 8 }}>Batafsil maʼlumot</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>{selectedCatalog.title}</h2>
            </div>
            {selectedCatalog.description && (
              <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 16 }}>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-main)", whiteSpace: "pre-line" }}>{selectedCatalog.description}</p>
              </div>
            )}
            {selectedCatalog.fileUrl && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
                {selectedCatalog.fileUrl.toLowerCase().endsWith(".pdf") ? (
                  <div style={{ width: "100%", height: 350, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-dim)", marginBottom: 12 }}>
                    <iframe src={selectedCatalog.fileUrl} title={selectedCatalog.title} style={{ width: "100%", height: "100%", border: "none" }} />
                  </div>
                ) : /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjpg|png|svg|webp)$/i.test(selectedCatalog.fileUrl) ? (
                  <div style={{ width: "100%", display: "flex", justifyContent: "center", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                    <img src={selectedCatalog.fileUrl} alt={selectedCatalog.title} style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }} />
                  </div>
                ) : null}
                <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
                  <a href={selectedCatalog.fileUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: "12px 28px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }} download>
                    <span>Faylni yuklab olish</span><ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}



function FiliallarPage({ page, site }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);

  const defaultBranches = [
    {
      id: 1,
      name: "Toshkent Bosh Filiali va Temir-Beton Klasteri",
      region: "Toshkent shahri va viloyati",
      director: "Raximov Anvar Olimovich",
      address: "Toshkent shahri, Yashnobod tumani, Ohangrabo koʻchasi 12-uy",
      phone: "+998 55 515 16 16",
      tasks: "Bosh boshqaruv, Temir-beton konstruksiyalar ishlab chiqarish, Diagnostika markazi",
      status: "Asosiy bazasi",
      description: "Klaster bosh boshqarmasi va temir-beton buyumlari ishlab chiqaruvchi eng yirik majmua.",
    },
    {
      id: 2,
      name: "Vodiy Hududiy Filiali (Fargʻona, Andijon, Namangan)",
      region: "Fargʻona vodiysi",
      director: "Qodirov Sardor Bahromovich",
      address: "Fargʻona shahri, Sanoat zonasi 4-daha",
      phone: "+998 73 244 12 34",
      tasks: "Koʻprik inshootlarini taʼmirlash, tovar-beton va konstruksiya taʼminoti",
      status: "Faol",
      description: "Fargʻona vodiysidagi avtomobil yoʻllari hamda koʻprik qurilishi boʻyicha masʼul hududiy filial.",
    },
    {
      id: 3,
      name: "Samarqand va Zarafshon Hududiy Filiali",
      region: "Samarqand va Jizzax viloyatlari",
      director: "Yoqubov Jasur Alisherovich",
      address: "Samarqand shahri, Dagbit koʻchasi 88-uy",
      phone: "+998 66 233 45 67",
      tasks: "Avtomobil yoʻllaridagi koʻpriklarni diagnostika va rekonstruksiya qilish",
      status: "Faol",
      description: "Samarqand va Jizzax hududidagi koʻprik va sunʼiy inshootlarni texnik soz holatda saqlash.",
    },
    {
      id: 4,
      name: "Buxoro va Navoiy Hududiy Filiali",
      region: "Buxoro va Navoiy viloyatlari",
      director: "Nazarov Bobur Shavkatovich",
      address: "Buxoro shahri, Sanoatchilar koʻchasi 15-uy",
      phone: "+998 65 221 78 90",
      tasks: "Choʻl va magistral hududlardagi sunʼiy inshootlarni saqlash va taʼmirlash",
      status: "Faol",
      description: "Choʻl hududlari hamda magistral yoʻllardagi koʻpriklar ekspluatatsiyasi.",
    },
    {
      id: 5,
      name: "Janubiy Hududiy Filiali (Qashqadaryo va Surxondaryo)",
      region: "Qashqadaryo va Surxondaryo viloyatlari",
      director: "Xoliqov Temur Rustamovich",
      address: "Qarshi shahri, Kasan yoʻli 42-uy",
      phone: "+998 75 225 33 11",
      tasks: "Togʻ va murakkab relyefli koʻpriklarni tiklash va qurilish ishlari",
      status: "Faol",
      description: "Qashqadaryo va Surxondaryo viloyatlaridagi togʻli va murakkab koʻprik obyektlari.",
    },
    {
      id: 6,
      name: "Shimoliy-Gʻarbiy Filial (Xorazm va Qoraqalpogʻiston)",
      region: "Xorazm viloyati va Qoraqalpogʻiston Resp.",
      director: "Muradov Sherzod Ilhomovich",
      address: "Urganch shahri, Al-Xorazmiy koʻchasi 102-uy",
      phone: "+998 62 228 99 00",
      tasks: "Daryo koʻpriklari va suv inshootlari texnik diagnostikasi hamda taʼmiri",
      status: "Faol",
      description: "Amudaryo va kanal koʻpriklari hamda hududiy temir-beton inshootlari taʼminoti.",
    },
  ];

  const branches = page?.branches && page.branches.length > 0 ? page.branches : defaultBranches;

  const filteredBranches = branches.filter(
    (b) =>
      (b.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.region || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.director || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageDesc =
    page?.content ||
    page?.status ||
    "Respublika boʻyicha “Oʻzyoʻlkoʻprik” klasteri hududiy filiallari va ishlab chiqarish bazalari.";

  return (
    <section className="page-shell">
      <PageHero title={page?.title || "Filiallar"} label="Hududiy Tarmoq" />

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 32 }}>
        {/* Banner va Tavsif */}
        <div className="glass-panel" style={{ padding: 32, borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <Building2 size={32} style={{ color: "var(--accent-cyan)" }} />
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#ffffff", margin: 0 }}>
                Hududiy Filiallar va Bazalar
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                {pageDesc}
              </p>
            </div>
          </div>

          {/* Qidiruv input */}
          <div style={{ marginTop: 24, position: "relative", maxWidth: 500 }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Filial, rahbariyat yoki hudud boʻyicha qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 44px",
                borderRadius: 24,
                border: "1px solid var(--border-bright)",
                background: "rgba(15, 23, 42, 0.6)",
                color: "#ffffff",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Filiallar kartalari Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="glass-panel price-item-card"
              onClick={() => setSelectedBranch(branch)}
              style={{
                padding: 24,
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                border: "1px solid var(--border-dim)",
                cursor: "pointer",
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "var(--border-bright)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border-dim)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Filial rasmi (agar bo'lsa) */}
              {branch.imageUrl && (
                <div style={{ width: "100%", borderRadius: 8, overflow: "hidden", maxHeight: 180 }}>
                  <img
                    src={branch.imageUrl}
                    alt={branch.name}
                    style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                  />
                </div>
              )}

              {/* Sarlavha & Holat */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.4 }}>
                  {branch.name}
                </h3>
                {branch.status && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 12,
                      background: branch.status === "Asosiy bazasi" ? "rgba(6, 182, 212, 0.2)" : "rgba(16, 185, 129, 0.15)",
                      color: branch.status === "Asosiy bazasi" ? "var(--accent-cyan)" : "#10b981",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {branch.status}
                  </span>
                )}
              </div>

              {/* Direktor ma'lumoti hamda rasmi */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(6, 182, 212, 0.08)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                }}
              >
                {branch.directorImageUrl ? (
                  <img
                    src={branch.directorImageUrl}
                    alt={branch.director || "Direktor"}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid var(--accent-cyan)",
                      flexShrink: 0,
                      boxShadow: "0 0 10px rgba(6, 182, 212, 0.25)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "rgba(6, 182, 212, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: "2px solid var(--accent-cyan)",
                    }}
                  >
                    <UserRound size={26} style={{ color: "var(--accent-cyan)" }} />
                  </div>
                )}
                <div>
                  <span style={{ fontSize: 11, color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 2 }}>
                    Filial Rahbari (Direktor)
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>
                    {branch.director || "Maʼlumot kiritilmagan"}
                  </span>
                </div>
              </div>

              {/* Rekvizitlar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-main)" }}>
                {branch.region && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--accent-cyan)" }}>
                    <MapPin size={16} />
                    <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{branch.region}</span>
                  </div>
                )}

                {branch.address && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Building2 size={16} style={{ color: "var(--text-muted)", marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: "var(--text-muted)" }}>{branch.address}</span>
                  </div>
                )}

                {branch.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Phone size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    <a href={`tel:${branch.phone.replace(/\s+/g, '')}`} style={{ color: "var(--accent-cyan)", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                      {branch.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Card pastidagi tugma */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-cyan)", fontSize: 14, fontWeight: 600, marginTop: "auto", paddingTop: 8 }}>
                <span>Batafsil maʼlumotlarni koʻrish</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filial to'liq ma'lumotlari Modali ── */}
      {selectedBranch && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 24,
          }}
          onClick={() => setSelectedBranch(null)}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 720,
              width: "100%",
              position: "relative",
              animation: "fadeIn 0.2s ease-out",
              overflow: "hidden",
              borderRadius: "var(--radius-md)",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Yopish tugmasi */}
            <button
              onClick={() => setSelectedBranch(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#ffffff",
                cursor: "pointer",
                zIndex: 10,
                background: "rgba(0,0,0,0.6)",
                borderRadius: "50%",
                padding: 10,
                display: "flex",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(6,182,212,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
            >
              <X size={22} />
            </button>

            <div style={{ overflowY: "auto", flex: 1 }}>
              {/* Filial Rasmi */}
              {selectedBranch.imageUrl && (
                <div style={{ width: "100%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={selectedBranch.imageUrl}
                    alt={selectedBranch.name}
                    style={{ width: "100%", maxHeight: 350, objectFit: "cover", display: "block" }}
                  />
                </div>
              )}

              <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Sarlavha hamda status */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, padding: "4px 14px", borderRadius: 14, background: "rgba(6,182,212,0.15)", color: "var(--accent-cyan)", fontWeight: 700 }}>
                      {selectedBranch.region || "Hududiy Filial"}
                    </span>
                    {selectedBranch.status && (
                      <span style={{ fontSize: 13, padding: "4px 14px", borderRadius: 14, background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 700 }}>
                        {selectedBranch.status}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
                    {selectedBranch.name}
                  </h2>
                </div>

                {/* Rahbariyat / Direktor katta rasmli bloki */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: 24,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(15, 23, 42, 0.8))",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {selectedBranch.directorImageUrl ? (
                    <img
                      src={selectedBranch.directorImageUrl}
                      alt={selectedBranch.director || "Direktor"}
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid var(--accent-cyan)",
                        boxShadow: "0 0 20px rgba(6, 182, 212, 0.35)",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: "50%",
                        background: "rgba(6, 182, 212, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "3px solid var(--accent-cyan)",
                        boxShadow: "0 0 20px rgba(6, 182, 212, 0.35)",
                      }}
                    >
                      <UserRound size={56} style={{ color: "var(--accent-cyan)" }} />
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: 12, color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 4, letterSpacing: 0.5 }}>
                      Filial Rahbari (Direktor)
                    </span>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
                      {selectedBranch.director || "Maʼlumot kiritilmagan"}
                    </h3>
                  </div>
                </div>

                {/* Aloqa va Manzil */}
                <div style={{ display: "grid", gap: 16, fontSize: 15, borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
                  {selectedBranch.address && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <Building2 size={22} style={{ color: "var(--accent-cyan)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: "#ffffff", display: "block", fontSize: 14, marginBottom: 2 }}>Manzil:</strong>
                        <span style={{ color: "var(--text-muted)", fontSize: 15 }}>{selectedBranch.address}</span>
                      </div>
                    </div>
                  )}

                  {selectedBranch.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Phone size={22} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: "#ffffff", display: "block", fontSize: 14, marginBottom: 2 }}>Telefon raqami:</strong>
                        <a href={`tel:${selectedBranch.phone.replace(/\s+/g, '')}`} style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 700, fontSize: 16 }}>
                          {selectedBranch.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filial haqida ma'lumot (Tavsif) */}
                {selectedBranch.description && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 10 }}>
                      Filial Haqida Maʼlumot
                    </h4>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-main)", whiteSpace: "pre-line", margin: 0 }}>
                      {selectedBranch.description}
                    </p>
                  </div>
                )}

                {/* Asosiy faoliyati (Vazifalar) */}
                {selectedBranch.tasks && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 20 }}>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 10 }}>
                      Asosiy Faoliyati va Vazifalari
                    </h4>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-main)", whiteSpace: "pre-line", margin: 0 }}>
                      {selectedBranch.tasks}
                    </p>
                  </div>
                )}

                {/* Fayl yuklab olish (agar bor bo'lsa) */}
                {selectedBranch.fileUrl && (
                  <div style={{ borderTop: "1px solid var(--border-dim)", paddingTop: 20, display: "flex", justifyContent: "center" }}>
                    <a
                      href={selectedBranch.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                      style={{ padding: "12px 32px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}
                      download
                    >
                      <span>Hujjatni yuklab olish</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
