import { useState } from "react";
import { type View } from "../types";
import { MY_REPORTS } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";

interface MyReportsViewProps {
  onNavigate: (view: View, id?: string) => void;
}

const TRACKING_ID = "CP-NG-2026-8847";

const TIMELINE_STEPS = [
  { id: "submitted", label: "Submitted", desc: "Report received and queued for review", date: "Aug 14, 2026", done: true },
  { id: "under-review", label: "Evidence Review", desc: "TraceIt team reviewing your submission", date: "Aug 17, 2026", done: true },
  { id: "verified", label: "Verification", desc: "Cross-checking with official records and other reports", date: "Aug 22, 2026", done: false, current: true },
  { id: "institution-response", label: "Institution Response", desc: "Awaiting official response from Ministry", date: "—", done: false },
  { id: "resolved", label: "Resolution", desc: "Report resolved and outcome recorded", date: "—", done: false },
];

function TrackingView({ reportId, onBack }: { reportId: string; onBack: () => void }) {
  const report = MY_REPORTS.find((r) => r.id === reportId) ?? MY_REPORTS[0];

  return (
    <div>
      <button
        onClick={onBack}
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
        ← Back to My Reports
      </button>

      {/* Tracking ID card */}
      <div
        style={{
          background: "var(--color-slate)",
          borderRadius: 16,
          padding: "1.5rem",
          marginBottom: "1.25rem",
          color: "white",
        }}
      >
        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Private Tracking ID
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.4rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#7FCFAB",
            marginBottom: "0.5rem",
          }}
        >
          {report.trackingId}
        </div>
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginBottom: "0.875rem" }}>
          Use this ID to check your report status without revealing your identity. Keep it private.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={report.status} size="sm" />
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>Last updated {report.lastUpdate}</span>
        </div>
      </div>

      {/* Report info */}
      <div
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-mist)",
          borderRadius: 16,
          padding: "1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "0.25rem" }}>
          {report.projectName}
        </h2>
        <p style={{ fontSize: "0.82rem", color: "var(--color-slate-light)", marginBottom: "0.875rem" }}>
          Submitted {report.submittedAt} · Privacy: {report.privacy.charAt(0).toUpperCase() + report.privacy.slice(1)}
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--color-slate-mid)", lineHeight: 1.6, padding: "0.875rem", background: "var(--color-parchment)", borderRadius: 10 }}>
          "{report.summary}"
        </p>
      </div>

      {/* Status timeline */}
      <div
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-mist)",
          borderRadius: 16,
          padding: "1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "1.25rem" }}>
          Report Timeline
        </h3>
        {TIMELINE_STEPS.map((step, i) => (
          <div key={step.id} className="flex gap-4 items-start mb-4">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: step.done
                    ? "var(--color-verified)"
                    : step.current
                    ? "var(--color-warning)"
                    : "var(--color-mist)",
                  color: step.done || step.current ? "white" : "var(--color-slate-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: step.current ? "0 0 0 4px rgba(217,119,6,0.2)" : "none",
                }}
                aria-label={step.done ? `${step.label}: complete` : step.current ? `${step.label}: current step` : `${step.label}: pending`}
              >
                {step.done ? "✓" : step.current ? "…" : i + 1}
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 20,
                    background: step.done ? "var(--color-verified)" : "var(--color-mist)",
                    margin: "3px 0",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.2rem" }}>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: step.current ? "var(--color-warning)" : step.done ? "var(--color-slate)" : "var(--color-slate-light)",
                  }}
                >
                  {step.label}
                </span>
                {step.current && (
                  <span style={{ fontSize: "0.68rem", background: "var(--color-warning-light)", color: "var(--color-warning)", padding: "0.1rem 0.4rem", borderRadius: 4, fontWeight: 600 }}>
                    In progress
                  </span>
                )}
                {step.date !== "—" && (
                  <span style={{ fontSize: "0.72rem", color: "var(--color-slate-light)", marginLeft: "auto" }}>{step.date}</span>
                )}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--color-slate-light)", margin: 0, lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Next action */}
      <div
        style={{
          background: "var(--color-primary-light)",
          border: "1px solid var(--color-primary-muted)",
          borderRadius: 14,
          padding: "1.25rem",
        }}
        role="note"
      >
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-primary)", marginBottom: "0.5rem" }}>
          What happens next?
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--color-slate-mid)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
          Your report is currently being cross-referenced with official records and other submissions. If verification confirms a discrepancy, we will send a formal inquiry to the institution. You will be notified when there is an update.
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--color-primary)" }}>
          Estimated response: 2–4 weeks · You will be notified via the tracking page
        </p>
      </div>
    </div>
  );
}

export function MyReportsView({ onNavigate }: MyReportsViewProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [showTrackingSearch, setShowTrackingSearch] = useState(false);

  if (selectedReport) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <TrackingView reportId={selectedReport} onBack={() => setSelectedReport(null)} />
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-slate)", marginBottom: "0.25rem" }}>
            My Reports
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-slate-light)" }}>
            Track the status of your submitted reports privately.
          </p>
        </div>
        <button
          onClick={() => onNavigate("report")}
          style={{
            padding: "0.625rem 1.25rem",
            background: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          + New Report
        </button>
      </div>

      {/* Track by ID */}
      <div
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-mist)",
          borderRadius: 14,
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        <button
          onClick={() => setShowTrackingSearch(!showTrackingSearch)}
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-slate)",
            padding: 0,
          }}
          aria-expanded={showTrackingSearch}
        >
          <span>🔍 Track a report by ID</span>
          <span style={{ color: "var(--color-slate-light)" }}>{showTrackingSearch ? "▲" : "▼"}</span>
        </button>
        {showTrackingSearch && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Enter tracking ID (e.g. CP-NG-2026-8847)"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              aria-label="Report tracking ID"
              style={{
                flex: 1,
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--color-mist)",
                borderRadius: 8,
                background: "var(--color-parchment)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-mono)",
                color: "var(--color-slate)",
                outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; }}
            />
            <button
              onClick={() => {
                if (trackingInput.trim()) {
                  setSelectedReport("rep-001");
                }
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Track
            </button>
          </div>
        )}
      </div>

      {/* Reports list */}
      <div className="flex flex-col gap-3">
        {MY_REPORTS.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            style={{
              background: "var(--color-canvas)",
              border: `1px solid ${report.hasNewUpdate ? "var(--color-primary-muted)" : "var(--color-mist)"}`,
              borderRadius: 16,
              padding: "1.125rem 1.25rem",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.15s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(28,36,56,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            aria-label={`View report: ${report.projectName}`}
          >
            {report.hasNewUpdate && (
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                }}
                aria-label="New update"
              />
            )}
            <div className="flex items-start gap-3">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StatusBadge status={report.status} size="sm" />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      color: "var(--color-slate-light)",
                    }}
                  >
                    {report.trackingId}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--color-slate-light)", marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                    {report.privacy === "anonymous" ? "🕵️" : report.privacy === "protected" ? "🔒" : "👤"}
                    {report.privacy}
                  </span>
                </div>
                <h2 style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-slate)", marginBottom: "0.375rem", lineHeight: 1.3 }}>
                  {report.projectName}
                </h2>
                <p style={{ fontSize: "0.8rem", color: "var(--color-slate-light)", marginBottom: "0.625rem", lineHeight: 1.45 }}>
                  {report.summary.slice(0, 90)}…
                </p>
                <div style={{ fontSize: "0.75rem", color: "var(--color-slate-light)" }}>
                  Submitted {report.submittedAt} · Updated {report.lastUpdate}
                  {report.hasNewUpdate && (
                    <span style={{ marginLeft: 8, color: "var(--color-primary)", fontWeight: 600 }}>
                      ● New update
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Privacy note */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "0.875rem",
          background: "var(--color-parchment)",
          borderRadius: 10,
          fontSize: "0.78rem",
          color: "var(--color-slate-light)",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        🔒 Your reports are stored securely. Anonymous reports are not linked to your account. Tracking IDs are the only way to access specific report details.
      </div>
    </main>
  );
}
