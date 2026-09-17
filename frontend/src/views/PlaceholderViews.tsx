import { type View } from "../types";

interface PlaceholderProps {
  title: string;
  desc: string;
  icon: string;
  onNavigate: (view: View) => void;
}

function PlaceholderView({ title, desc, icon, onNavigate }: PlaceholderProps) {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-slate)", marginBottom: "0.5rem" }}>
        {title}
      </h1>
      <p style={{ fontSize: "0.9rem", color: "var(--color-slate-light)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
        {desc}
      </p>
      <button
        onClick={() => onNavigate("home")}
        style={{
          padding: "0.625rem 1.5rem",
          background: "var(--color-primary)",
          color: "white",
          border: "none",
          borderRadius: 10,
          fontWeight: 600,
          fontSize: "0.875rem",
          cursor: "pointer",
        }}
      >
        ← Back to Home
      </button>
    </main>
  );
}

export function LearnView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-slate)", marginBottom: "0.5rem" }}>
        Learn
      </h1>
      <p style={{ fontSize: "0.875rem", color: "var(--color-slate-light)", marginBottom: "2rem" }}>
        Guides, tutorials, and civic literacy resources for African communities
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: "How to Read a Government Contract", cat: "Beginner", icon: "📄", time: "5 min" },
          { title: "Understanding Project Budgets", cat: "Beginner", icon: "💰", time: "8 min" },
          { title: "Your Rights Under Freedom of Information", cat: "Intermediate", icon: "⚖️", time: "12 min" },
          { title: "How to Submit an Evidence Report", cat: "Beginner", icon: "📷", time: "3 min" },
          { title: "Escalating to Anti-Corruption Bodies", cat: "Advanced", icon: "📣", time: "15 min" },
          { title: "Protecting Yourself as a Reporter", cat: "Safety", icon: "🔒", time: "10 min" },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-mist)",
              borderRadius: 14,
              padding: "1.125rem",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.625rem" }}>{item.icon}</div>
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: item.cat === "Safety" ? "var(--color-alert)" : item.cat === "Advanced" ? "var(--color-warning)" : "var(--color-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "0.375rem",
              }}
            >
              {item.cat}
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-slate)", marginBottom: "0.375rem", lineHeight: 1.3 }}>
              {item.title}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-slate-light)" }}>{item.time} read</div>
          </div>
        ))}
      </div>
    </main>
  );
}

export function AboutView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-slate)", marginBottom: "0.5rem" }}>
        About TraceIt
      </h1>
      <p style={{ fontSize: "0.9rem", color: "var(--color-slate-light)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: 560 }}>
        TraceIt is an independent civic technology platform built to help African citizens understand government promises, compare official records with community evidence, and take informed action.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: "Mission", val: "Transparent, evidence-based accountability" },
          { label: "Founded", val: "2024" },
          { label: "Coverage", val: "38 countries across Africa" },
          { label: "Languages", val: "English, French, Portuguese, Arabic, Hausa, Yoruba, Igbo" },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: "var(--color-canvas)", border: "1px solid var(--color-mist)", borderRadius: 12, padding: "1rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-slate-light)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.25rem" }}>{label}</div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-slate)" }}>{val}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "var(--color-primary-light)",
          border: "1px solid var(--color-primary-muted)",
          borderRadius: 14,
          padding: "1.25rem",
          fontSize: "0.85rem",
          color: "var(--color-slate-mid)",
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: "var(--color-primary)" }}>Editorial Independence:</strong> TraceIt does not represent any political party, government, or corporation. We are committed to factual accuracy, evidence-based analysis, and protecting the safety of community reporters.
      </div>
    </main>
  );
}

export function ProfileView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <PlaceholderView
      title="Profile"
      desc="Manage your account preferences, notification settings, saved projects, and language choices."
      icon="👤"
      onNavigate={onNavigate}
    />
  );
}

export function ReportTrackingConfirmView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 text-center">
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "var(--color-verified-light)",
          border: "3px solid var(--color-verified)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          margin: "0 auto 1.5rem",
        }}
        aria-hidden="true"
      >
        ✓
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-slate)", marginBottom: "0.75rem" }}>
        Report Submitted
      </h1>
      <p style={{ fontSize: "0.9rem", color: "var(--color-slate-light)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
        Your report has been received. Keep your private tracking ID safe — it is the only way to check your report status without revealing your identity.
      </p>
      <div
        style={{
          background: "var(--color-slate)",
          color: "white",
          borderRadius: 14,
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Your Private Tracking ID
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#7FCFAB",
          }}
        >
          CP-NG-2026-9104
        </div>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: "0.5rem" }}>
          Save this ID. Take a screenshot or write it down.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => onNavigate("my-reports")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Track this report
        </button>
        <button
          onClick={() => onNavigate("home")}
          style={{
            padding: "0.75rem 1.5rem",
            background: "transparent",
            color: "var(--color-slate-mid)",
            border: "1px solid var(--color-mist)",
            borderRadius: 10,
            fontWeight: 500,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Back to home
        </button>
      </div>
    </main>
  );
}
