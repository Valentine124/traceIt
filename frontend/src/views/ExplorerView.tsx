import { useState } from "react";
import { type View } from "../types";
import { PROJECTS } from "../data/mockData";
import { StatusBadge, VerificationBadge } from "../components/StatusBadge";

interface ExplorerViewProps {
  onNavigate: (view: View, projectId?: string) => void;
}

const CATEGORIES = ["All", "Roads", "Water", "Education", "Healthcare", "Electricity", "Other"];
const STATUSES = ["All", "On Track", "Delayed", "Stalled", "Completed", "Disputed"];
const COUNTRIES = ["All Countries", "Nigeria", "Ghana", "Kenya", "Senegal", "Zambia"];

const CATEGORY_ICONS: Record<string, string> = {
  roads: "🛣️",
  water: "💧",
  education: "📚",
  healthcare: "🏥",
  electricity: "⚡",
  other: "🏗️",
};

const STATUS_COLORS: Record<string, string> = {
  "on-track": "#22C55E",
  "completed": "var(--color-primary)",
  "delayed": "#F59E0B",
  "stalled": "#EF4444",
  "disputed": "var(--color-terra)",
};

// Simulated map pins
const MAP_PINS = [
  { id: "proj-001", x: 22, y: 58, label: "Lagos" },
  { id: "proj-002", x: 18, y: 55, label: "Accra" },
  { id: "proj-003", x: 52, y: 62, label: "Nairobi" },
  { id: "proj-004", x: 14, y: 28, label: "Dakar" },
  { id: "proj-005", x: 50, y: 78, label: "Lusaka" },
];

export function ExplorerView({ onNavigate }: ExplorerViewProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [view, setView] = useState<"list" | "map">("list");
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const filtered = PROJECTS.filter((p) => {
    const matchQuery = query === "" || p.name.toLowerCase().includes(query.toLowerCase()) || p.region.toLowerCase().includes(query.toLowerCase());
    const matchCat = selectedCategory === "All" || p.category === selectedCategory.toLowerCase();
    const matchStatus = selectedStatus === "All" || p.status.replace("-", " ") === selectedStatus.toLowerCase();
    const matchCountry = selectedCountry === "All Countries" || p.country === selectedCountry;
    return matchQuery && matchCat && matchStatus && matchCountry;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--color-slate)", marginBottom: "0.375rem" }}>
          Project Explorer
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-slate-light)" }}>
          {PROJECTS.length} public projects tracked across 38 countries
        </p>
      </div>

      {/* Search + view toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div style={{ position: "relative", flex: 1 }}>
          <svg
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-slate-light)" }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search by project name, location, or institution..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search projects"
            style={{
              width: "100%",
              padding: "0.625rem 0.875rem 0.625rem 2.5rem",
              border: "1px solid var(--color-mist)",
              borderRadius: 10,
              background: "var(--color-canvas)",
              fontSize: "0.875rem",
              color: "var(--color-slate)",
              outline: "none",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; }}
          />
        </div>
        <div style={{ display: "flex", gap: 2, background: "var(--color-mist)", borderRadius: 10, padding: 3 }}>
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.85rem",
                background: view === v ? "var(--color-canvas)" : "transparent",
                color: view === v ? "var(--color-slate)" : "var(--color-slate-light)",
                boxShadow: view === v ? "0 1px 3px rgba(28,36,56,0.08)" : "none",
              }}
              aria-pressed={view === v}
            >
              {v === "list" ? "☰ List" : "🗺 Map"}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: 20,
                border: selectedCategory === cat ? "1.5px solid var(--color-primary)" : "1px solid var(--color-mist)",
                background: selectedCategory === cat ? "var(--color-primary-light)" : "var(--color-canvas)",
                color: selectedCategory === cat ? "var(--color-primary)" : "var(--color-slate-light)",
                fontSize: "0.8rem",
                fontWeight: selectedCategory === cat ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Country select */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          aria-label="Filter by country"
          style={{
            padding: "0.35rem 0.75rem",
            borderRadius: 20,
            border: "1px solid var(--color-mist)",
            background: "var(--color-canvas)",
            color: "var(--color-slate-mid)",
            fontSize: "0.8rem",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Status select */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter by status"
          style={{
            padding: "0.35rem 0.75rem",
            borderRadius: 20,
            border: "1px solid var(--color-mist)",
            background: "var(--color-canvas)",
            color: "var(--color-slate-mid)",
            fontSize: "0.8rem",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Results count */}
        <span style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", color: "var(--color-slate-light)", marginLeft: "auto" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {view === "list" ? (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <button
              key={project.id}
              onClick={() => onNavigate("project-detail", project.id)}
              style={{
                background: "var(--color-canvas)",
                border: "1px solid var(--color-mist)",
                borderRadius: 16,
                padding: "1.25rem 1.375rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 4px rgba(28,36,56,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(28,36,56,0.1)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(28,36,56,0.04)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
              aria-label={`Open project: ${project.name}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span style={{ fontSize: "1.75rem", lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
                  {CATEGORY_ICONS[project.category]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <h2 style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-slate)", lineHeight: 1.3 }}>
                      {project.name}
                    </h2>
                    <StatusBadge status={project.status} size="sm" />
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-slate-light)" }}>
                    {project.region} · {project.country}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: "0.82rem", color: "var(--color-slate-mid)", lineHeight: 1.55, marginBottom: "0.875rem" }}>
                {project.description.slice(0, 100)}...
              </p>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: "Budget", val: project.budget },
                  { label: "Due", val: project.promisedDelivery },
                  { label: "Reports", val: `${project.communityReports}` },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div style={{ fontSize: "0.7rem", color: "var(--color-slate-light)", marginBottom: "0.15rem" }}>{label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 500, color: "var(--color-slate)" }}>{val}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between" style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--color-mist)" }}>
                <VerificationBadge status={project.verificationStatus} />
                {project.discrepancyCount > 0 && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--color-alert)",
                      background: "var(--color-alert-light)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                    }}
                  >
                    ⚠ {project.discrepancyCount} discrepanc{project.discrepancyCount === 1 ? "y" : "ies"}
                  </span>
                )}
                <span style={{ fontSize: "0.78rem", color: "var(--color-slate-light)", marginLeft: "auto" }}>
                  Updated {project.lastUpdated}
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem",
                color: "var(--color-slate-light)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
              <p style={{ fontWeight: 600, marginBottom: "0.375rem" }}>No projects found</p>
              <p style={{ fontSize: "0.875rem" }}>Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      ) : (
        /* Map View */
        <div
          style={{
            background: "var(--color-canvas)",
            border: "1px solid var(--color-mist)",
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="map-grid"
            style={{
              height: 480,
              position: "relative",
              background: "#E8F4F0",
            }}
            role="img"
            aria-label="Map showing project locations across Africa"
          >
            {/* Africa outline approximation using SVG */}
            <svg
              viewBox="0 0 100 100"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.08,
              }}
              aria-hidden="true"
            >
              <path
                d="M35,5 L45,4 L55,6 L62,8 L68,12 L72,20 L74,30 L76,40 L75,50 L78,58 L80,65 L78,72 L72,78 L65,82 L58,88 L52,95 L48,95 L42,90 L36,85 L30,78 L25,70 L22,62 L20,55 L18,48 L20,40 L22,32 L24,25 L26,18 L28,12 L32,7 Z"
                fill="var(--color-primary)"
              />
            </svg>

            {/* Map pins */}
            {MAP_PINS.filter((pin) => filtered.find((p) => p.id === pin.id)).map((pin) => {
              const project = PROJECTS.find((p) => p.id === pin.id)!;
              const isHovered = hoveredPin === pin.id;
              return (
                <button
                  key={pin.id}
                  style={{
                    position: "absolute",
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    transform: "translate(-50%, -100%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    zIndex: isHovered ? 20 : 10,
                  }}
                  onMouseEnter={() => setHoveredPin(pin.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                  onClick={() => onNavigate("project-detail", pin.id)}
                  aria-label={`Project: ${project.name}`}
                >
                  <div
                    style={{
                      width: isHovered ? 14 : 12,
                      height: isHovered ? 14 : 12,
                      borderRadius: "50%",
                      background: STATUS_COLORS[project.status] ?? "#888",
                      border: "2px solid white",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      transition: "all 0.15s ease",
                      marginBottom: 2,
                    }}
                  />
                  {isHovered && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        marginBottom: 4,
                        background: "var(--color-slate)",
                        color: "white",
                        padding: "0.375rem 0.625rem",
                        borderRadius: 8,
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        minWidth: 160,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{project.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>{project.status.replace("-", " ")} · {project.budget}</div>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Legend */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                background: "rgba(255,255,255,0.95)",
                border: "1px solid var(--color-mist)",
                borderRadius: 10,
                padding: "0.75rem",
                fontSize: "0.72rem",
              }}
              role="img"
              aria-label="Map legend"
            >
              <div style={{ fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-slate)" }}>Legend</div>
              {[
                { color: "#22C55E", label: "On Track" },
                { color: "#F59E0B", label: "Delayed" },
                { color: "#EF4444", label: "Stalled" },
                { color: "var(--color-primary)", label: "Completed" },
                { color: "var(--color-terra)", label: "Disputed" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 mb-1">
                  <span className="status-dot" style={{ background: color }} />
                  <span style={{ color: "var(--color-slate-mid)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
