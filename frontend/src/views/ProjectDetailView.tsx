import { useState } from "react";
import { type View } from "../types";
import { PROJECTS } from "../data/mockData";
import { StatusBadge, VerificationBadge } from "../components/StatusBadge";

interface ProjectDetailViewProps {
  projectId: string;
  onNavigate: (view: View, projectId?: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  roads: "🛣️",
  water: "💧",
  education: "📚",
  healthcare: "🏥",
  electricity: "⚡",
  other: "🏗️",
};

const COMMUNITY_EVIDENCE = [
  {
    id: "ev-1",
    type: "photo",
    author: "Protected Reporter",
    date: "Sept 8, 2026",
    content: "Section between km 45-52 showing no recent work. Potholes larger than in 2023 photos.",
    icon: "📷",
    verified: true,
  },
  {
    id: "ev-2",
    type: "voice",
    author: "Anonymous",
    date: "Aug 29, 2026",
    content: "Voice report: Contractor vehicles not seen since July. Road surface deteriorating at junction.",
    icon: "🎙️",
    verified: false,
  },
  {
    id: "ev-3",
    type: "text",
    author: "Community Leader",
    date: "Aug 14, 2026",
    content: "Attended community meeting. Ministry representative could not confirm completion date. Locals report no active work for 8 weeks.",
    icon: "📝",
    verified: true,
  },
];

const OFFICIAL_TIMELINE = [
  { date: "March 2020", event: "Contract awarded", done: true },
  { date: "June 2020", event: "Mobilization", done: true },
  { date: "Dec 2020", event: "Phase 1 (km 0-40) target", done: true },
  { date: "June 2022", event: "Phase 2 (km 40-90) target", done: false, delayed: true },
  { date: "Dec 2023", event: "Project completion (original)", done: false, delayed: true },
  { date: "Dec 2024", event: "Revised completion date", done: false, delayed: true },
  { date: "TBD", event: "Current projected completion", done: false },
];

export function ProjectDetailView({ projectId, onNavigate }: ProjectDetailViewProps) {
  const project = PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];
  const [activeTab, setActiveTab] = useState<"overview" | "reality" | "action">("overview");
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const TABS = [
    { id: "overview", label: "Project Overview" },
    { id: "reality", label: "⚖ Reality Check" },
    { id: "action", label: "✅ What Can I Do?" },
  ] as const;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-5" style={{ fontSize: "0.8rem", color: "var(--color-slate-light)" }}>
        <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-slate-light)" }}>Home</button>
        <span>›</span>
        <button onClick={() => onNavigate("explorer")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-slate-light)" }}>Explorer</button>
        <span>›</span>
        <span style={{ color: "var(--color-slate)" }}>{project.name}</span>
      </nav>

      {/* Project header */}
      <div
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-mist)",
          borderRadius: 20,
          padding: "1.5rem",
          marginBottom: "1.25rem",
        }}
      >
        <div className="flex items-start gap-4 flex-wrap mb-4">
          <div
            style={{
              width: 52,
              height: 52,
              background: "var(--color-primary-light)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {CATEGORY_ICONS[project.category]}
          </div>
          <div style={{ flex: 1 }}>
            <div className="flex flex-wrap gap-2 mb-1">
              <StatusBadge status={project.status} />
              <VerificationBadge status={project.verificationStatus} />
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 3vw, 1.75rem)", color: "var(--color-slate)", lineHeight: 1.2, marginBottom: "0.25rem" }}>
              {project.name}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)" }}>
              📍 {project.community} · {project.region} · {project.country}
            </p>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Budget", val: project.budget, mono: true },
            { label: "Expected Completion", val: project.promisedDelivery, mono: false },
            { label: "Responsible Institution", val: project.institution.split("—")[0].trim(), mono: false },
            { label: "Contractor", val: project.contractor.split(" ").slice(0, 3).join(" "), mono: false },
          ].map(({ label, val, mono }) => (
            <div
              key={label}
              style={{
                padding: "0.75rem",
                background: "var(--color-parchment)",
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: "0.7rem", color: "var(--color-slate-light)", marginBottom: "0.25rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {label}
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--color-slate)",
                  fontFamily: mono ? "var(--font-mono)" : "inherit",
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          background: "var(--color-mist)",
          borderRadius: 12,
          padding: 4,
          marginBottom: "1.25rem",
        }}
        role="tablist"
        aria-label="Project sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: activeTab === tab.id ? 600 : 500,
              background: activeTab === tab.id ? "var(--color-canvas)" : "transparent",
              color: activeTab === tab.id ? "var(--color-slate)" : "var(--color-slate-light)",
              boxShadow: activeTab === tab.id ? "0 1px 3px rgba(28,36,56,0.08)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div role="tabpanel" className="animate-slide-in">
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* What was promised */}
              <section
                style={{ background: "var(--color-canvas)", border: "1px solid var(--color-mist)", borderRadius: 16, padding: "1.25rem" }}
                aria-labelledby="promised-heading"
              >
                <h2 id="promised-heading" style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--color-primary)" }}>📋</span> What Was Promised
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {project.officialDeliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 mb-3">
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "var(--color-primary-light)",
                          color: "var(--color-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "var(--color-slate-mid)", lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    background: "var(--color-primary-light)",
                    borderRadius: 8,
                    fontSize: "0.78rem",
                    color: "var(--color-primary)",
                    fontWeight: 500,
                  }}
                >
                  📄 Source: Federal Ministry of Works contract record · Verified Sept 2026
                  <button
                    onClick={() => onNavigate("ai-explainer", project.id)}
                    style={{ marginLeft: 8, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", fontWeight: 600, fontSize: "0.78rem" }}
                  >
                    Read AI explanation →
                  </button>
                </div>
              </section>

              {/* Community evidence */}
              <section
                style={{ background: "var(--color-canvas)", border: "1px solid var(--color-mist)", borderRadius: 16, padding: "1.25rem" }}
                aria-labelledby="evidence-heading"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 id="evidence-heading" style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-slate)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>👥</span> Community Evidence
                  </h2>
                  <span style={{ fontSize: "0.78rem", color: "var(--color-slate-light)" }}>{project.communityReports} reports</span>
                </div>
                <div className="flex flex-col gap-3">
                  {COMMUNITY_EVIDENCE.map((ev) => (
                    <div
                      key={ev.id}
                      style={{
                        padding: "0.875rem",
                        background: "var(--color-parchment)",
                        borderRadius: 10,
                        border: "1px solid var(--color-mist)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span style={{ fontSize: "1rem" }} aria-label={`Report type: ${ev.type}`}>{ev.icon}</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-slate)" }}>{ev.author}</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--color-slate-light)", marginLeft: "auto" }}>{ev.date}</span>
                        {ev.verified && (
                          <span style={{ fontSize: "0.68rem", color: "var(--color-verified)", background: "var(--color-verified-light)", padding: "0.1rem 0.4rem", borderRadius: 4, fontWeight: 600 }}>
                            Reviewed
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.83rem", color: "var(--color-slate-mid)", lineHeight: 1.5, margin: 0 }}>{ev.content}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => onNavigate("report", project.id)}
                  style={{
                    marginTop: "0.875rem",
                    width: "100%",
                    padding: "0.625rem",
                    background: "transparent",
                    border: "1.5px dashed var(--color-primary-muted)",
                    borderRadius: 10,
                    color: "var(--color-primary)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  + Add your evidence
                </button>
              </section>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Discrepancy alert */}
              {project.discrepancyCount > 0 && (
                <div
                  style={{
                    background: "var(--color-alert-light)",
                    border: "1px solid #FECACA",
                    borderRadius: 14,
                    padding: "1rem",
                  }}
                  role="alert"
                >
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-alert)", marginBottom: "0.5rem" }}>
                    ⚠ {project.discrepancyCount} Potential Discrepanc{project.discrepancyCount === 1 ? "y" : "ies"}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#991B1B", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                    Community evidence may not match official records. This does not prove wrongdoing — further verification is needed.
                  </p>
                  <button
                    onClick={() => setActiveTab("reality")}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      background: "var(--color-alert)",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                  >
                    View Reality Check →
                  </button>
                </div>
              )}

              {/* Timeline */}
              <div
                style={{ background: "var(--color-canvas)", border: "1px solid var(--color-mist)", borderRadius: 14, padding: "1rem" }}
              >
                <h3 style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-slate)", marginBottom: "0.875rem" }}>
                  📅 Timeline
                </h3>
                <div style={{ position: "relative" }}>
                  {OFFICIAL_TIMELINE.map((item, i) => (
                    <div key={i} className="flex gap-3 mb-3 items-start">
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: item.done ? "var(--color-verified)" : item.delayed ? "var(--color-warning)" : "var(--color-mist-dark)",
                            border: "2px solid var(--color-canvas)",
                            flexShrink: 0,
                            marginTop: 3,
                          }}
                          aria-hidden="true"
                        />
                        {i < OFFICIAL_TIMELINE.length - 1 && (
                          <div style={{ width: 1, flex: 1, minHeight: 16, background: "var(--color-mist)", margin: "2px 0" }} aria-hidden="true" />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--color-slate-light)", marginBottom: "0.1rem" }}>{item.date}</div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: item.done ? "var(--color-slate)" : item.delayed ? "var(--color-warning)" : "var(--color-slate-light)",
                            fontWeight: item.done ? 500 : 400,
                          }}
                        >
                          {item.event}
                          {item.delayed && <span style={{ marginLeft: 4, fontSize: "0.68rem" }}>⚠ Delayed</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ background: "var(--color-canvas)", border: "1px solid var(--color-mist)", borderRadius: 14, padding: "1rem" }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-slate)", marginBottom: "0.75rem" }}>Quick Actions</h3>
                {[
                  { label: "Add evidence", icon: "📷", action: () => onNavigate("report", project.id) },
                  { label: "AI explanation", icon: "🤖", action: () => onNavigate("ai-explainer", project.id) },
                  { label: "What can I do?", icon: "✅", action: () => setActiveTab("action") },
                  { label: "Save offline", icon: "💾", action: () => {} },
                ].map(({ label, icon, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 8,
                      padding: "0.5rem 0.625rem",
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "0.83rem",
                      color: "var(--color-slate-mid)",
                      fontWeight: 500,
                      marginBottom: 2,
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-parchment)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: "1rem" }}>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reality" && (
          <RealityCheckPanel project={project} showDisclaimer={showDisclaimer} onDismissDisclaimer={() => setShowDisclaimer(false)} />
        )}

        {activeTab === "action" && (
          <WhatCanIDoPanel project={project} onNavigate={onNavigate} />
        )}
      </div>
    </main>
  );
}

function RealityCheckPanel({ project, showDisclaimer, onDismissDisclaimer }: {
  project: typeof PROJECTS[0];
  showDisclaimer: boolean;
  onDismissDisclaimer: () => void;
}) {
  return (
    <div>
      {/* Disclaimer */}
      {showDisclaimer && (
        <div
          style={{
            background: "var(--color-warning-light)",
            border: "1px solid #FDE68A",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            gap: 10,
          }}
          role="note"
        >
          <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>ℹ️</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.83rem", color: "#92400E", lineHeight: 1.6, margin: 0 }}>
              <strong>Important:</strong> TraceIt identifies potential discrepancies between official records and community reports. This does not prove wrongdoing, fraud, or corruption. Discrepancies may have legitimate explanations and require further investigation and official verification.
            </p>
          </div>
          <button
            onClick={onDismissDisclaimer}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#92400E", fontSize: "1rem", flexShrink: 0 }}
            aria-label="Dismiss notice"
          >
            ×
          </button>
        </div>
      )}

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--color-slate)", marginBottom: "0.25rem" }}>
        Civic Reality Check
      </h2>
      <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)", marginBottom: "1.25rem" }}>
        Comparing official records with community-submitted evidence for {project.name}
      </p>

      {/* Two-column comparison */}
      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        {/* Official Record */}
        <div
          style={{
            background: "var(--color-canvas)",
            border: "2px solid var(--color-primary-muted)",
            borderRadius: 16,
            padding: "1.25rem",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              style={{
                padding: "0.3rem 0.75rem",
                background: "var(--color-primary-light)",
                borderRadius: 20,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--color-primary)",
                letterSpacing: "0.04em",
              }}
            >
              📋 OFFICIAL RECORD
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--color-slate-light)" }}>Source verified</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: "Promised completion", val: project.promisedDelivery, status: "delayed" as const },
              { label: "Total budget", val: project.budget, status: "ok" as const },
              { label: "Deliverables committed", val: `${project.officialDeliverables.length} items`, status: "ok" as const },
              { label: "Official status", val: project.status.replace("-", " ").toUpperCase(), status: "delayed" as const },
            ].map(({ label, val, status }) => (
              <div
                key={label}
                style={{
                  padding: "0.75rem",
                  background: "var(--color-parchment)",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "var(--color-slate-light)" }}>{label}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: status === "delayed" ? "var(--color-warning)" : "var(--color-slate)",
                    }}
                  >
                    {val}
                  </span>
                  {status === "delayed" && <span style={{ fontSize: "0.7rem" }} aria-label="Warning">⚠</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Evidence */}
        <div
          style={{
            background: "var(--color-canvas)",
            border: "2px solid var(--color-terra-muted)",
            borderRadius: 16,
            padding: "1.25rem",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              style={{
                padding: "0.3rem 0.75rem",
                background: "var(--color-terra-light)",
                borderRadius: 20,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--color-terra)",
                letterSpacing: "0.04em",
              }}
            >
              👥 COMMUNITY EVIDENCE
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--color-slate-light)" }}>{project.communityReports} reports</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: "Active construction reported", val: "Not observed (Aug-Sep 2026)", discrepancy: true },
              { label: "Road surface condition", val: "Deteriorating, large potholes", discrepancy: true },
              { label: "Contractor presence", val: "Last seen July 2026", discrepancy: true },
              { label: "Streetlights installed", val: "Partial — km 0-22 only", discrepancy: true },
            ].map(({ label, val, discrepancy }) => (
              <div
                key={label}
                style={{
                  padding: "0.75rem",
                  background: discrepancy ? "var(--color-alert-light)" : "var(--color-parchment)",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  border: discrepancy ? "1px solid #FECACA" : "none",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "var(--color-slate-light)", flex: 1 }}>{label}</span>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: discrepancy ? "var(--color-alert)" : "var(--color-slate)", textAlign: "right" }}>
                    {val}
                  </span>
                  {discrepancy && <span aria-label="Discrepancy detected">🚨</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div
        style={{
          background: "linear-gradient(135deg, #1C2438, #1B3A2D)",
          borderRadius: 16,
          padding: "1.5rem",
          marginBottom: "1.25rem",
        }}
        role="region"
        aria-label="AI Analysis"
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            style={{
              padding: "0.25rem 0.625rem",
              background: "rgba(127,207,171,0.2)",
              border: "1px solid rgba(127,207,171,0.3)",
              borderRadius: 20,
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#7FCFAB",
              letterSpacing: "0.04em",
            }}
          >
            🤖 AI ANALYSIS — TraceIt Assistant
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "0.875rem" }}>
          Based on {project.communityReports} community reports and official records, there appear to be <strong style={{ color: "#7FCFAB" }}>{project.discrepancyCount} potential discrepancies</strong> between what was officially committed and what community members are reporting.
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1rem" }}>
          Key concerns include: apparent lack of active construction since July 2026, road surface deterioration in sections where rehabilitation was promised, and incomplete streetlight installation. These observations come from verified community reporters but have not been independently confirmed by authorities.
        </p>
        <div
          style={{
            padding: "0.75rem",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 8,
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          ⚠ AI analysis is based on available information only. It is not a legal determination. Always seek independent verification for important decisions.
        </div>
      </div>

      {/* Discrepancy list */}
      <div
        style={{ background: "var(--color-canvas)", border: "1px solid var(--color-mist)", borderRadius: 16, padding: "1.25rem" }}
      >
        <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "1rem" }}>
          Identified Potential Discrepancies
        </h3>
        <div className="flex flex-col gap-3">
          {[
            {
              id: "D-001",
              title: "Construction activity appears halted",
              official: "Contract requires continuous work until project completion",
              community: "No contractor vehicles or workers observed since July 2026 (8 weeks)",
              severity: "high",
            },
            {
              id: "D-002",
              title: "Road surface deteriorating despite claims",
              official: "Phase 2 rehabilitation includes full surface restoration",
              community: "Multiple reports of enlarged potholes and surface cracking in Phase 2 zone",
              severity: "high",
            },
            {
              id: "D-003",
              title: "Streetlight installation incomplete",
              official: "Streetlights committed along full 127.6km corridor",
              community: "Lights observed only on first 22km section",
              severity: "medium",
            },
            {
              id: "D-004",
              title: "Completion date unclear",
              official: "Original completion: Dec 2023. Revised: Dec 2024",
              community: "Ministry representative unable to confirm new date at community meeting",
              severity: "medium",
            },
          ].map((d) => (
            <div
              key={d.id}
              style={{
                padding: "1rem",
                background: d.severity === "high" ? "var(--color-alert-light)" : "var(--color-warning-light)",
                border: `1px solid ${d.severity === "high" ? "#FECACA" : "#FDE68A"}`,
                borderRadius: 10,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "var(--color-slate-light)",
                    background: "rgba(255,255,255,0.6)",
                    padding: "0.1rem 0.4rem",
                    borderRadius: 4,
                  }}
                >
                  {d.id}
                </span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: d.severity === "high" ? "var(--color-alert)" : "var(--color-warning)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {d.severity} priority
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-slate)", marginBottom: "0.5rem" }}>{d.title}</div>
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.2rem" }}>Official</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-slate-mid)" }}>{d.official}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--color-terra)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.2rem" }}>Community report</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-slate-mid)" }}>{d.community}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhatCanIDoPanel({ project, onNavigate }: { project: typeof PROJECTS[0]; onNavigate: (view: View, id?: string) => void }) {
  const steps = [
    {
      num: 1,
      title: "Review the Official Record",
      desc: "Read the full contract terms, budget breakdown, and promised deliverables. Know exactly what was committed before taking action.",
      icon: "📋",
      cta: "Read AI explanation",
      action: () => onNavigate("ai-explainer", project.id),
    },
    {
      num: 2,
      title: "Add Community Evidence",
      desc: "Submit photos, a voice note, or written observations. Anonymous reporting is available. Your evidence helps build a clearer picture.",
      icon: "📷",
      cta: "Submit evidence",
      action: () => onNavigate("report", project.id),
    },
    {
      num: 3,
      title: "Request Official Clarification",
      desc: `Submit a formal information request to ${project.institution}. Use the template TraceIt provides — it references specific contract terms.`,
      icon: "📨",
      cta: "Use request template",
      action: () => {},
    },
    {
      num: 4,
      title: "Contact the Responsible Institution",
      desc: "Find direct contact details for the ministry, contractor, and oversight bodies. Know the right person to approach.",
      icon: "📞",
      cta: "View contact details",
      action: () => {},
    },
    {
      num: 5,
      title: "Submit a Formal Complaint",
      desc: "If clarification is unsatisfactory, file a formal complaint through official channels. TraceIt tracks the response timeline.",
      icon: "📝",
      cta: "File a complaint",
      action: () => onNavigate("report", project.id),
    },
    {
      num: 6,
      title: "Escalate if Needed",
      desc: "Escalate to oversight bodies, anti-corruption agencies, media, or civil society organizations if the institution does not respond adequately.",
      icon: "📣",
      cta: "View escalation options",
      action: () => {},
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--color-slate)", marginBottom: "0.25rem" }}>
          What Can You Do?
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--color-slate-light)" }}>
          Six concrete steps you can take right now about {project.name}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            style={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-mist)",
              borderRadius: 16,
              padding: "1.25rem",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--color-primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Step {step.num}
                </div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-slate)", lineHeight: 1.3 }}>{step.title}</div>
              </div>
            </div>
            <p style={{ fontSize: "0.83rem", color: "var(--color-slate-mid)", lineHeight: 1.6, marginBottom: "0.875rem" }}>{step.desc}</p>
            <button
              onClick={step.action}
              style={{
                padding: "0.5rem 1rem",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              {step.cta} →
            </button>
          </div>
        ))}
      </div>

      {/* Institution contacts */}
      <div
        style={{
          marginTop: "1.5rem",
          background: "var(--color-canvas)",
          border: "1px solid var(--color-mist)",
          borderRadius: 16,
          padding: "1.25rem",
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "1rem" }}>Responsible Institutions</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { name: project.institution, role: "Primary institution", phone: "+234 9 523 2400", email: "info@fmwh.gov.ng" },
            { name: project.contractor, role: "Contractor", phone: "+234 1 270 0600", email: "info@juliusberger.com" },
            { name: "Infrastructure Concession Regulatory Commission", role: "Oversight body", phone: "+234 9 291 7600", email: "info@icrc.gov.ng" },
            { name: "Independent Corrupt Practices Commission", role: "Anti-corruption escalation", phone: "0800-CALL-ICPC", email: "report@icpc.gov.ng" },
          ].map(({ name, role, phone, email }) => (
            <div
              key={name}
              style={{
                padding: "0.875rem",
                background: "var(--color-parchment)",
                borderRadius: 10,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--color-slate)", marginBottom: "0.2rem" }}>{name}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>{role}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-slate-mid)" }}>{phone}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-slate-mid)" }}>{email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
