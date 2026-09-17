import { useEffect, useRef, useState, type JSX } from "react";
import { type View, type Language } from "../types";
import { LANGUAGES } from "../data/mockData";

interface NavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
}

const PRIMARY_NAV: { view: View; label: string }[] = [
  { view: "home", label: "Home" },
  { view: "explorer", label: "Explore Projects" },
  { view: "my-reports", label: "My Reports" },
  { view: "learn", label: "Learn" },
  { view: "about", label: "About" },
];

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

const NAV_ICONS: Partial<Record<View, () => JSX.Element>> = {
  home: HomeIcon,
  explorer: ExploreIcon,
  "my-reports": FolderIcon,
  learn: BookIcon,
  about: InfoIcon,
};

function ReportIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function WifiOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

/**
 * TopNav is the site's single, always-present navigation surface. It behaves
 * like an ordinary responsive website header: a horizontal link bar on
 * medium+ screens, collapsing into a full-width dropdown menu on narrow
 * viewports. There is no separate bottom tab bar — the same nav model works
 * at every breakpoint.
 */
export function TopNav({ currentView, onNavigate, language, onLanguageChange, isOnline }: NavProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLang = LANGUAGES.find((l) => l.code === language)!;
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [currentView]);

  const handleNavigate = (view: View) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  return (
    <>
      {!isOnline && (
        <div className="offline-banner flex items-center justify-center gap-2">
          <WifiOffIcon />
          <span>Offline mode — showing cached content. Reports queued for submission.</span>
        </div>
      )}
      <header
        style={{
          background: "var(--color-canvas)",
          borderBottom: "1px solid var(--color-mist)",
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <button
              onClick={() => handleNavigate("home")}
              className="flex items-center gap-2.5 focus-visible:outline-none shrink-0"
              aria-label="TraceIt Home"
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  background: "var(--color-primary)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: "var(--color-slate)",
                  lineHeight: 1.1,
                }}
              >
                TraceIt
              </div>
            </button>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center" aria-label="Primary">
              {PRIMARY_NAV.map((item) => {
                const isActive =
                  currentView === item.view ||
                  (item.view === "explorer" && (currentView === "project-detail" || currentView === "reality-check" || currentView === "ai-explainer" || currentView === "what-can-i-do"));
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavigate(item.view)}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      padding: "0.5rem 0.9rem",
                      borderRadius: 8,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: isActive ? "var(--color-primary)" : "var(--color-slate-mid)",
                      background: isActive ? "var(--color-primary-light)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Report CTA — always visible, primary action */}
              <button
                onClick={() => handleNavigate("report")}
                className="hidden sm:flex"
                style={{
                  alignItems: "center",
                  gap: 6,
                  padding: "0.5rem 1rem",
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(26,107,74,0.28)",
                }}
              >
                <ReportIcon />
                Report an Issue
              </button>

              {/* Language selector */}
              <div style={{ position: "relative" }} ref={langMenuRef} className="hidden sm:block">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0.5rem 0.75rem",
                    border: "1px solid var(--color-mist)",
                    borderRadius: 8,
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "var(--color-slate-mid)",
                  }}
                  aria-label="Select language"
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                >
                  <GlobeIcon />
                  <span>{currentLang.code.toUpperCase()}</span>
                  <ChevronDownIcon />
                </button>
                {langOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 6px)",
                      background: "var(--color-canvas)",
                      border: "1px solid var(--color-mist)",
                      borderRadius: 10,
                      boxShadow: "0 8px 24px rgba(28,36,56,0.14)",
                      minWidth: 170,
                      zIndex: 100,
                      overflow: "hidden",
                    }}
                    role="listbox"
                    aria-label="Language options"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setLangOpen(false);
                        }}
                        role="option"
                        aria-selected={language === lang.code}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.55rem 0.875rem",
                          background: language === lang.code ? "var(--color-primary-light)" : "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: language === lang.code ? "var(--color-primary)" : "var(--color-slate)",
                          fontWeight: language === lang.code ? 600 : 400,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span>{lang.nativeName}</span>
                        {lang.dir === "rtl" && (
                          <span style={{ fontSize: "0.7rem", color: "var(--color-slate-light)", marginLeft: "auto" }}>RTL</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile button */}
              <button
                onClick={() => handleNavigate("profile")}
                className="hidden md:flex"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--color-primary-muted)",
                  border: "2px solid var(--color-primary-light)",
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-primary)",
                }}
                aria-label="Profile"
                aria-current={currentView === "profile" ? "page" : undefined}
              >
                <ProfileIcon />
              </button>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex"
                onClick={() => setMenuOpen((v) => !v)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid var(--color-mist)",
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-slate)",
                }}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-panel"
              >
                <MenuIcon open={menuOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / tablet nav panel — the same links as desktop, stacked full-width */}
        {menuOpen && (
          <div
            id="mobile-nav-panel"
            style={{
              background: "var(--color-canvas)",
              borderTop: "1px solid var(--color-mist)",
            }}
            className="md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {PRIMARY_NAV.map((item) => {
                const Icon = NAV_ICONS[item.view];
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavigate(item.view)}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      textAlign: "left",
                      padding: "0.75rem 0.875rem",
                      borderRadius: 8,
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: isActive ? "var(--color-primary)" : "var(--color-slate-mid)",
                      background: isActive ? "var(--color-primary-light)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {Icon && <Icon />}
                    {item.label}
                  </button>
                );
              })}

              <button
                onClick={() => handleNavigate("profile")}
                aria-current={currentView === "profile" ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 0.875rem",
                  borderRadius: 8,
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: currentView === "profile" ? "var(--color-primary)" : "var(--color-slate-mid)",
                  background: currentView === "profile" ? "var(--color-primary-light)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <ProfileIcon />
                Profile
              </button>

              <div className="flex items-center justify-between gap-3 pt-2 mt-1" style={{ borderTop: "1px solid var(--color-mist)" }}>
                {/* Language selector (mobile) */}
                <div style={{ position: "relative", flex: 1 }}>
                  <button
                    onClick={() => setLangOpen((v) => !v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      width: "100%",
                      padding: "0.65rem 0.75rem",
                      marginTop: "0.5rem",
                      border: "1px solid var(--color-mist)",
                      borderRadius: 8,
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "var(--color-slate-mid)",
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={langOpen}
                  >
                    <GlobeIcon />
                    {currentLang.nativeName}
                    <ChevronDownIcon />
                  </button>
                  {langOpen && (
                    <div
                      style={{
                        marginTop: 6,
                        background: "var(--color-parchment)",
                        border: "1px solid var(--color-mist)",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                      role="listbox"
                      aria-label="Language options"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onLanguageChange(lang.code);
                            setLangOpen(false);
                          }}
                          role="option"
                          aria-selected={language === lang.code}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "0.6rem 0.875rem",
                            background: language === lang.code ? "var(--color-primary-light)" : "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            color: language === lang.code ? "var(--color-primary)" : "var(--color-slate)",
                            fontWeight: language === lang.code ? 600 : 400,
                          }}
                        >
                          {lang.nativeName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleNavigate("report")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.75rem 1rem",
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                <ReportIcon />
                Report an Issue
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/** Site footer — gives the app a proper web-page ending instead of trailing off under a mobile tab bar. */
export function Footer({ onNavigate }: Pick<NavProps, "onNavigate">) {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "var(--color-slate)", color: "rgba(255,255,255,0.65)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "var(--color-primary)",
                  borderRadius: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "white" }}>TraceIt</span>
            </div>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
              See what was promised. Check what happened. Civic accountability for every community.
            </p>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Platform</div>
            <ul className="flex flex-col gap-2" style={{ fontSize: "0.82rem" }}>
              <li><button onClick={() => onNavigate("explorer")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>Explore Projects</button></li>
              <li><button onClick={() => onNavigate("report")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>Report an Issue</button></li>
              <li><button onClick={() => onNavigate("my-reports")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>My Reports</button></li>
            </ul>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>About</div>
            <ul className="flex flex-col gap-2" style={{ fontSize: "0.82rem" }}>
              <li><button onClick={() => onNavigate("learn")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>How It Works</button></li>
              <li><button onClick={() => onNavigate("about")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>About TraceIt</button></li>
            </ul>
          </div>

          <div>
            <div style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Accessibility</div>
            <ul className="flex flex-col gap-2" style={{ fontSize: "0.82rem" }}>
              <li>🔒 Anonymous reporting</li>
              <li>📵 Works offline</li>
              <li>🌍 7 languages</li>
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.12)", fontSize: "0.78rem" }}
        >
          <span>© {year} TraceIt. Independent civic technology.</span>
          <span>Not affiliated with any government, party, or corporation.</span>
        </div>
      </div>
    </footer>
  );
}
