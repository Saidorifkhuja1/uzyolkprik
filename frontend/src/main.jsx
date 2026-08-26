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
  Layers,
  Mail,
  MapPin,
  Menu,
  MoveRight,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { API_DOCS, fetchSite } from "./api";
import "./styles.css";

// Pristine Default High-Tech Bridge Plant & Concrete Cluster Asset
const DEFAULT_ASSETS = {
  logo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none"><rect width="200" height="200" rx="40" fill="%230E1726"/><path d="M40 130 C 70 60, 130 60, 160 130" stroke="%2306B6D4" stroke-width="14" stroke-linecap="round"/><path d="M55 125 C 80 80, 120 80, 145 125" stroke="%23F59E0B" stroke-width="8"/><path d="M30 145 Q 100 120 170 145" stroke="%230F766E" stroke-width="12" stroke-linecap="round"/><path d="M100 73 V 127 M75 88 V 125 M125 88 V 125" stroke="%2306B6D4" stroke-width="4" stroke-dasharray="4 4"/></svg>`,

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
            <p style={{ fontSize: 13, color: "#94a3b8" }}>Backend ishlayotganini tekshiring: http://127.0.0.1:8000</p>
          </div>
        ) : (
          <p style={{ color: "#94a3b8" }}>Sayt maʼlumotlari yuklanmoqda...</p>
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
      />
      <main>
        <PageRenderer page={activePage} site={site} onNavigate={navigate} />
      </main>
      <Footer site={site} onNavigate={navigate} />

      {searchOpen && (
        <SearchModal site={site} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      )}
    </>
  );
}

function Header({ site, activeSlug, onNavigate, menuOpen, setMenuOpen, onOpenSearch }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const closeDropdown = () => setOpenDropdown(null);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const navigate = (slug) => {
    setOpenDropdown(null);
    onNavigate(slug);
  };

  const logoSrc = site?.assets?.logo || DEFAULT_ASSETS.logo;

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
          />
          <div className="brand-text">
            <strong>{site.brand.name}</strong>
            <small>klasteri davlat muassasasi</small>
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
          <button className="icon-button" aria-label="Qidiruv" onClick={onOpenSearch}>
            <Search size={18} />
          </button>
          <button className="contact-button" onClick={() => navigate("qayta-aloqa")}>
            <Phone size={16} />
            <span>Aloqa</span>
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
          <h3 style={{ fontSize: 18, color: "#fff" }}>Sayt boʻyicha qidiruv</h3>
          <button onClick={onClose} className="icon-button">
            <X size={18} />
          </button>
        </div>

        <div className="search-input-wrap">
          <Search size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Sahifa nomi yoki kalit soʻzni kiriting..."
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
                <strong style={{ color: "#fff", display: "block" }}>{page.title}</strong>
                <small style={{ color: "#94a3b8" }}>{page.status || "Sayt sahifasi"}</small>
              </div>
              <ArrowRight size={16} style={{ color: "#06b6d4" }} />
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
  const heroSrc = site?.assets?.hero || DEFAULT_ASSETS.hero;

  return (
    <section className="page-shell">
      <PageHero title={page.title} label="Sahifa" />
      <div className="glass-panel" style={{ padding: 48, textAlign: "center" }}>
        <Sparkles size={40} style={{ color: "#06b6d4", marginBottom: 20 }} />
        <h2 style={{ fontSize: 24, marginBottom: 32 }}>{page.status}</h2>
        <img
          src={heroSrc}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_ASSETS.hero;
          }}
          alt=""
          style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 16 }}
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
  const items =
    page.catalogItems && page.catalogItems.length > 0
      ? page.catalogItems
      : [
          {
            title: page.document || "Каталог ver. 2.pdf",
            fileUrl:
              "https://drive.google.com/uc?id=1m2fTdEmw9IXzEmaeZWfr-nScjt5DWw2n&export=download",
            embedUrl:
              "https://drive.google.com/file/d/1m2fTdEmw9IXzEmaeZWfr-nScjt5DWw2n/preview",
            description:
              "Oʻzyoʻlkoʻprik klasteri rasmiy zavod mahsulotlari va temir-beton konstruksiyalar katalogi (Каталог ver. 2.pdf)",
            fileSize: "14.8 MB",
          },
        ];

  return (
    <section className="page-shell">
      <PageHero title={page.title} label="Zavod va Texnologiyalar" />
      <div style={{ display: "grid", gap: 32 }}>
        {items.map((item, index) => {
          const embed =
            item.embedUrl ||
            (item.fileUrl?.includes("drive.google.com")
              ? item.fileUrl.replace("/uc?id=", "/file/d/").replace("&export=download", "") + "/preview"
              : null);

          return (
            <div key={item.id || index} style={{ display: "grid", gap: 24 }}>
              {embed && (
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

createRoot(document.getElementById("root")).render(<App />);
