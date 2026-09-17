import { type View } from "../types";
import { PROJECTS } from "../data/mockData";
import { StatusBadge } from "../components/StatusBadge";

interface HomeViewProps {
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

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div
      style={{
        background: "var(--color-canvas)",
        border: "1px solid var(--color-mist)",
        borderRadius: 16,
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          background: "var(--color-primary-light)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.875rem",
          color: "var(--color-primary)",
        }}
      >
        {icon}
      </div>
      <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "0.4rem" }}>{title}</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-slate-light)", lineHeight: 1.6 }}>{body}</div>
    </div>
  );
}

function HowItWorksStep({ num, label, desc }: { num: number; label: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--color-primary)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "0.875rem",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {num}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "0.2rem" }}>{label}</div>
        <div style={{ fontSize: "0.83rem", color: "var(--color-slate-light)", lineHeight: 1.55 }}>{desc}</div>
      </div>
    </div>
  );
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const featured = PROJECTS.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-slate) 0%, #1B3A2D 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle texture pattern */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(26,107,74,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,107,42,0.15) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24" style={{ position: "relative" }}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0.3rem 0.75rem",
                  background: "rgba(26,107,74,0.3)",
                  border: "1px solid rgba(26,107,74,0.4)",
                  borderRadius: 20,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#7FCFAB",
                  marginBottom: "1.25rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                <span className="status-dot" style={{ background: "#7FCFAB" }} />
                Civic Transparency Platform
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: "white",
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.01em",
                }}
              >
                See what was promised.
                <br />
                <span style={{ color: "#7FCFAB" }}>Check what happened.</span>
              </h1>
              <p
                style={{
                  fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  maxWidth: 440,
                }}
              >
                TraceIt compares government promises with community evidence — so every citizen can see the full picture and know what to do next.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate("explorer")}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "var(--color-primary)",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(26,107,74,0.4)",
                  }}
                >
                  Explore Projects
                </button>
                <button
                  onClick={() => onNavigate("report")}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Report an Issue
                </button>
              </div>
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 mt-8" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                <span>🔒 Anonymous reporting</span>
                <span>📵 Works offline</span>
                <span>🌍 7 languages</span>
                <span>♿ Accessible</span>
              </div>
            </div>

            {/* Hero stats card */}
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20,
                padding: "1.75rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                Platform Activity
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { num: "2,847", label: "Projects tracked", icon: "📋" },
                  { num: "14,392", label: "Community reports", icon: "📝" },
                  { num: "38", label: "Countries", icon: "🌍" },
                  { num: "1,204", label: "Discrepancies found", icon: "⚠️" },
                ].map(({ num, label, icon }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 12,
                      padding: "1rem",
                    }}
                  >
                    <div style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>{icon}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "white", lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" }}>{label}</div>
                  </div>
                ))}
              </div>
              {/* Recent activity */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.625rem" }}>Recent activity</div>
                {[
                  { text: "New report on Lagos-Ibadan road", time: "2 min ago", country: "🇳🇬" },
                  { text: "Discrepancy verified in Nairobi schools", time: "14 min ago", country: "🇰🇪" },
                  { text: "Institution responded in Dakar", time: "1 hr ago", country: "🇸🇳" },
                ].map(({ text, time, country }) => (
                  <div key={text} className="flex items-start gap-2 mb-2" style={{ fontSize: "0.78rem" }}>
                    <span>{country}</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", flex: 1 }}>{text}</span>
                    <span style={{ color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline bar */}
      <div
        style={{
          background: "var(--color-primary-light)",
          borderBottom: "1px solid var(--color-primary-muted)",
          padding: "0.75rem 1rem",
          textAlign: "center",
          fontSize: "0.85rem",
          color: "var(--color-primary)",
          fontWeight: 500,
        }}
      >
        "See the promise. Check the evidence. Know what to do."
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Nearby Projects */}
        <section aria-labelledby="nearby-heading" className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                id="nearby-heading"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--color-slate)", marginBottom: "0.25rem" }}
              >
                Projects Near You
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)" }}>
                Based on your location — Lagos, Nigeria
              </p>
            </div>
            <button
              onClick={() => onNavigate("explorer")}
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              View all →
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((project) => (
              <button
                key={project.id}
                onClick={() => onNavigate("project-detail", project.id)}
                style={{
                  background: "var(--color-canvas)",
                  border: "1px solid var(--color-mist)",
                  borderRadius: 16,
                  padding: "1.25rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 3px rgba(28,36,56,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(28,36,56,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary-muted)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(28,36,56,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-mist)";
                }}
                aria-label={`View project: ${project.name}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span style={{ fontSize: "1.5rem" }} aria-hidden="true">
                    {CATEGORY_ICONS[project.category]}
                  </span>
                  <StatusBadge status={project.status} size="sm" />
                </div>
                <h3 style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-slate)", marginBottom: "0.25rem", lineHeight: 1.3 }}>
                  {project.name}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--color-slate-light)", marginBottom: "0.75rem" }}>
                  {project.region} · {project.country}
                </p>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--color-slate-mid)", fontWeight: 500 }}>
                    {project.budget}
                  </span>
                  {project.discrepancyCount > 0 && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--color-alert)",
                        background: "var(--color-alert-light)",
                        padding: "0.15rem 0.5rem",
                        borderRadius: 6,
                      }}
                    >
                      {project.discrepancyCount} discrepanc{project.discrepancyCount === 1 ? "y" : "ies"}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-mist)", fontSize: "0.75rem", color: "var(--color-slate-light)", display: "flex", gap: 12 }}>
                  <span>{project.communityReports} community reports</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          aria-labelledby="how-heading"
          style={{
            background: "var(--color-canvas)",
            border: "1px solid var(--color-mist)",
            borderRadius: 20,
            padding: "2rem",
            marginBottom: "4rem",
          }}
        >
          <h2
            id="how-heading"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-slate)", marginBottom: "0.375rem" }}
          >
            How TraceIt Works
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)", marginBottom: "2rem" }}>
            Six simple steps from promise to action
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <HowItWorksStep num={1} label="See the Promise" desc="Browse official government promises, project records, and budgets — verified from primary sources." />
            <HowItWorksStep num={2} label="Review Official Records" desc="View what institutions committed to: deliverables, timelines, responsible parties, and budgets." />
            <HowItWorksStep num={3} label="Add Community Evidence" desc="Submit photos, voice reports, or observations. Completely anonymous if you choose." />
            <HowItWorksStep num={4} label="AI Analysis" desc="TraceIt AI compares records and evidence to identify potential discrepancies — in plain language." />
            <HowItWorksStep num={5} label="Civic Reality Check" desc="See a clear, honest comparison of what was promised versus what the community reports." />
            <HowItWorksStep num={6} label="Know What to Do" desc="Get specific next steps: who to contact, what to submit, how to escalate — with direct links." />
          </div>
        </section>

        {/* Platform features */}
        <section aria-labelledby="features-heading" className="mb-14">
          <h2
            id="features-heading"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-slate)", marginBottom: "0.375rem" }}
          >
            Built for Everyone
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)", marginBottom: "1.5rem" }}>
            Designed for citizens across Africa — regardless of connectivity, language, or device
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
              title="Privacy First"
              body="Report anonymously or with protection. We collect minimal data and explain every privacy choice clearly."
            />
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
              }
              title="Works Offline"
              body="Browse cached projects, queue reports, and save content offline. Full sync when connection returns."
            />
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              }
              title="7 Languages"
              body="English, French, Portuguese, Arabic (RTL), Hausa, Yoruba, and Igbo. Submit reports by voice in your language."
            />
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Always Accessible"
              body="Large touch targets, high contrast, screen-reader support, audio read-aloud, and simple plain language."
            />
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: "var(--color-primary)",
            borderRadius: 20,
            padding: "2.5rem 2rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              color: "white",
              marginBottom: "0.75rem",
            }}
          >
            Have you seen something?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: 440, margin: "0 auto 1.5rem" }}>
            Your community report matters. Add evidence to an existing project or flag a new issue — anonymously if you prefer.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate("report")}
              style={{
                padding: "0.75rem 1.75rem",
                background: "white",
                color: "var(--color-primary)",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Submit a Report
            </button>
            <button
              onClick={() => onNavigate("learn")}
              style={{
                padding: "0.75rem 1.75rem",
                background: "transparent",
                color: "white",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Learn More
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
