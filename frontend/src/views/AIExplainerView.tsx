import { useState } from "react";
import { type View } from "../types";
import { PROJECTS } from "../data/mockData";

interface AIExplainerViewProps {
  projectId?: string;
  onNavigate: (view: View, id?: string) => void;
}

const EXPLANATION = {
  simple: `The government promised to fix the Lagos-Ibadan road — one of Nigeria's busiest highways. They gave ₦167.6 billion (about $100 million) to a company called Julius Berger to repair the 127km road, add lights, and build better access routes.

The work was supposed to be done by December 2023. It is now September 2026 — nearly 3 years late. Community members report that no workers have been seen on the road for months, and the road surface is getting worse, not better.`,

  official: `Contract No. FMW/IB/PH/REH/2020/04 was awarded to Julius Berger Nigeria PLC in March 2020 for the comprehensive rehabilitation of the Lagos-Ibadan Expressway (127.6km dual carriageway).

Scope includes: dual carriageway rehabilitation, two flyover construction at Sagamu interchange, streetlight installation along full corridor, service lane and drainage construction, and emergency access at five designated points.

Original completion: December 2023. First revised completion: December 2024. Current status: Unclear. Last ministry update: April 2026.`,

  citizen: `This means:
• You paid for this road through taxes. You have a right to know what happened to the money.
• The road should be fixed and safe to drive on.
• If the contractor stopped working but still received payments, that is a serious concern.
• You can ask the Ministry of Works to explain the delays — this is your legal right under the Freedom of Information Act.
• You can report what you observe on TraceIt and it will be part of the accountability record.`,

  sources: [
    { title: "Federal Contract Award Notice", date: "March 15, 2020", type: "Official document", verified: true },
    { title: "Ministry of Works Progress Report Q2 2026", date: "June 30, 2026", type: "Government report", verified: true },
    { title: "House Committee on Works Hearing Transcript", date: "August 8, 2026", type: "Parliamentary record", verified: true },
    { title: "Julius Berger Project Update Statement", date: "July 2026", type: "Contractor statement", verified: false },
  ],
};

export function AIExplainerView({ projectId, onNavigate }: AIExplainerViewProps) {
  const project = PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];
  const [isListening, setIsListening] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [activeSection, setActiveSection] = useState<"simple" | "official" | "citizen">("simple");

  const handleListen = () => {
    setIsListening(true);
    setTimeout(() => setIsListening(false), 4000);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      {projectId && (
        <button
          onClick={() => onNavigate("project-detail", projectId)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-slate-mid)",
            fontSize: "0.85rem",
            fontWeight: 500,
            marginBottom: "1.5rem",
            padding: 0,
          }}
        >
          ← Back to project
        </button>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(135deg, var(--color-slate), #1B3A2D)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "0.2rem 0.6rem",
              background: "var(--color-primary-light)",
              borderRadius: 20,
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              letterSpacing: "0.04em",
              marginBottom: "0.375rem",
            }}
          >
            🤖 TraceIt AI Explainer
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-slate)", lineHeight: 1.2 }}>
            {project.name}
          </h1>
          <p style={{ fontSize: "0.8rem", color: "var(--color-slate-light)", marginTop: "0.25rem" }}>
            AI-generated explanation based on official records · Last verified Sept 2026
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={handleListen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0.5rem 1rem",
            border: `1px solid ${isListening ? "var(--color-primary)" : "var(--color-mist)"}`,
            background: isListening ? "var(--color-primary-light)" : "var(--color-canvas)",
            color: isListening ? "var(--color-primary)" : "var(--color-slate-mid)",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 500,
          }}
          aria-label={isListening ? "Reading aloud..." : "Listen to explanation"}
          aria-live="polite"
        >
          <span style={{ fontSize: "1rem" }}>{isListening ? "⏹" : "🔊"}</span>
          {isListening ? "Reading aloud…" : "Listen"}
        </button>
        <button
          onClick={() => setSavedOffline(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0.5rem 1rem",
            border: `1px solid ${savedOffline ? "var(--color-verified)" : "var(--color-mist)"}`,
            background: savedOffline ? "var(--color-verified-light)" : "var(--color-canvas)",
            color: savedOffline ? "var(--color-verified)" : "var(--color-slate-mid)",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 500,
          }}
          aria-label={savedOffline ? "Saved for offline use" : "Save for offline use"}
        >
          <span style={{ fontSize: "1rem" }}>{savedOffline ? "✓" : "💾"}</span>
          {savedOffline ? "Saved offline" : "Save offline"}
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0.5rem 1rem",
            border: "1px solid var(--color-mist)",
            background: "var(--color-canvas)",
            color: "var(--color-slate-mid)",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 500,
          }}
          aria-label="Share this explanation"
        >
          <span style={{ fontSize: "1rem" }}>🔗</span>
          Share
        </button>
      </div>

      {/* Section tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          background: "var(--color-mist)",
          borderRadius: 10,
          padding: 3,
          marginBottom: "1.25rem",
        }}
        role="tablist"
        aria-label="Explanation sections"
      >
        {[
          { id: "simple" as const, label: "📖 Simple explanation" },
          { id: "official" as const, label: "📋 Official record" },
          { id: "citizen" as const, label: "✅ What this means for you" },
        ].map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeSection === tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              flex: 1,
              padding: "0.5rem 0.5rem",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: activeSection === tab.id ? 600 : 500,
              background: activeSection === tab.id ? "var(--color-canvas)" : "transparent",
              color: activeSection === tab.id ? "var(--color-slate)" : "var(--color-slate-light)",
              boxShadow: activeSection === tab.id ? "0 1px 3px rgba(28,36,56,0.08)" : "none",
              transition: "all 0.15s ease",
              textAlign: "center",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-mist)",
          borderRadius: 16,
          padding: "1.5rem",
          marginBottom: "1.25rem",
        }}
        role="tabpanel"
        className="animate-slide-in"
      >
        {activeSection === "simple" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 2,
                padding: "0.25rem 0.625rem",
                background: "var(--color-primary-light)",
                borderRadius: 6,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                marginBottom: "1rem",
                width: "fit-content",
              }}
            >
              Plain language
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--color-slate)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {EXPLANATION.simple}
            </p>
          </>
        )}
        {activeSection === "official" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 2,
                padding: "0.25rem 0.625rem",
                background: "var(--color-parchment-dark)",
                borderRadius: 6,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--color-slate-mid)",
                marginBottom: "1rem",
                width: "fit-content",
              }}
            >
              Official record extract
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-slate-mid)",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
                fontFamily: "var(--font-mono)",
              }}
            >
              {EXPLANATION.official}
            </p>
          </>
        )}
        {activeSection === "citizen" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 2,
                padding: "0.25rem 0.625rem",
                background: "var(--color-verified-light)",
                borderRadius: 6,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--color-verified)",
                marginBottom: "1rem",
                width: "fit-content",
              }}
            >
              What this means for you
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--color-slate)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {EXPLANATION.citizen}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => onNavigate("report", projectId)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Submit a report
              </button>
              <button
                onClick={() => onNavigate("project-detail", projectId)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "transparent",
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-primary-muted)",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                See what you can do
              </button>
            </div>
          </>
        )}
      </div>

      {/* AI disclaimer */}
      <div
        style={{
          padding: "0.875rem",
          background: "var(--color-parchment)",
          borderRadius: 10,
          fontSize: "0.75rem",
          color: "var(--color-slate-light)",
          lineHeight: 1.6,
          marginBottom: "1.25rem",
        }}
      >
        🤖 This explanation was generated by TraceIt AI. It is based on official documents and community reports and is intended to help citizens understand public information — not to make legal, financial, or political claims. Always verify important decisions with primary sources.
      </div>

      {/* Sources */}
      <div
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-mist)",
          borderRadius: 16,
          padding: "1.25rem",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "1rem" }}>
          Sources
        </h2>
        <div className="flex flex-col gap-2">
          {EXPLANATION.sources.map((source, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0.75rem",
                background: "var(--color-parchment)",
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: "1rem" }} aria-hidden="true">{source.verified ? "📄" : "📑"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--color-slate)" }}>{source.title}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--color-slate-light)" }}>
                  {source.type} · Published {source.date}
                </div>
              </div>
              {source.verified && (
                <span style={{ fontSize: "0.68rem", color: "var(--color-verified)", background: "var(--color-verified-light)", padding: "0.15rem 0.4rem", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap" }}>
                  ✓ Verified
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
