import { useState } from "react";
import { type View, type PrivacyMode } from "../types";

interface ReportViewProps {
  onNavigate: (view: View) => void;
  prefillProjectId?: string;
}

type EvidenceType = "photo" | "video" | "voice" | "text";

interface ReportState {
  step: 1 | 2 | 3 | 4;
  evidenceType: EvidenceType | null;
  hasEvidence: boolean;
  projectName: string;
  location: string;
  description: string;
  privacy: PrivacyMode;
  isRecording: boolean;
  aiProcessed: boolean;
  aiSummary: string;
  agreed: boolean;
}

const AI_SUMMARY = `Voice report transcribed and structured by TraceIt AI:

**Report type:** Construction progress discrepancy
**Location:** Lagos-Ibadan Expressway, approximately km 47-50
**Date observed:** September 13, 2026

**Summary:** Reporter observes no active construction work at the specified section. Road surface shows signs of further deterioration compared to previous condition. No contractor machinery or workers visible. Adjacent residents confirm work stopped approximately 6-8 weeks ago.

**Supporting details:** Reporter mentions large potholes near the Sagamu interchange area that were not present in 2024. Drainage channels remain incomplete.`;

export function ReportView({ onNavigate, prefillProjectId }: ReportViewProps) {
  const [state, setState] = useState<ReportState>({
    step: 1,
    evidenceType: null,
    hasEvidence: false,
    projectName: prefillProjectId ? "Lagos-Ibadan Expressway Rehabilitation" : "",
    location: "",
    description: "",
    privacy: "anonymous",
    isRecording: false,
    aiProcessed: false,
    aiSummary: "",
    agreed: false,
  });

  const [voiceSeconds, setVoiceSeconds] = useState(0);

  const set = (partial: Partial<ReportState>) => setState((s) => ({ ...s, ...partial }));

  const startRecording = () => {
    set({ isRecording: true });
    const interval = setInterval(() => {
      setVoiceSeconds((s) => {
        if (s >= 5) {
          clearInterval(interval);
          set({ isRecording: false, hasEvidence: true, aiProcessed: false });
          setTimeout(() => set({ aiProcessed: true, aiSummary: AI_SUMMARY }), 1200);
          return 0;
        }
        return s + 1;
      });
    }, 1000);
  };

  const PRIVACY_OPTIONS: { mode: PrivacyMode; icon: string; title: string; desc: string; recommended?: boolean }[] = [
    {
      mode: "anonymous",
      icon: "🕵️",
      title: "Anonymous",
      desc: "No identity information stored. Your report is submitted without any link to your account or device. Recommended for sensitive issues.",
      recommended: true,
    },
    {
      mode: "protected",
      icon: "🔒",
      title: "Protected",
      desc: "Your identity is encrypted and known only to TraceIt. Not shared with institutions. Allows us to contact you if needed.",
    },
    {
      mode: "public",
      icon: "👤",
      title: "Public",
      desc: "Your name or handle is visible on the report. Suitable for journalists, CSOs, or community leaders comfortable being identified.",
    },
  ];

  const steps = [
    { num: 1, label: "Evidence" },
    { num: 2, label: "Details" },
    { num: 3, label: "Privacy" },
    { num: 4, label: "Submit" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-slate)", marginBottom: "0.25rem" }}>
          Report an Issue
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-slate-light)" }}>
          Your report helps hold institutions accountable. All submissions are carefully reviewed.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8" role="list" aria-label="Report steps">
        {steps.map(({ num, label }, i) => {
          const isDone = state.step > num;
          const isActive = state.step === num;
          return (
            <div key={num} className="flex items-center gap-2 flex-1" role="listitem">
              <div className="flex flex-col items-center gap-1">
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: isDone ? "var(--color-primary)" : isActive ? "var(--color-primary)" : "var(--color-mist)",
                    color: isDone || isActive ? "white" : "var(--color-slate-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    transition: "all 0.2s ease",
                  }}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? "✓" : num}
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--color-primary)" : isDone ? "var(--color-slate)" : "var(--color-slate-light)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    flex: 1,
                    height: 2,
                    background: isDone ? "var(--color-primary)" : "var(--color-mist)",
                    borderRadius: 1,
                    marginTop: -12,
                    transition: "background 0.2s ease",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: "var(--color-canvas)",
          border: "1px solid var(--color-mist)",
          borderRadius: 20,
          padding: "1.75rem",
        }}
      >
        {/* Step 1: Evidence */}
        {state.step === 1 && (
          <div className="animate-slide-in">
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-slate)", marginBottom: "0.375rem" }}>
              Add Evidence
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)", marginBottom: "1.5rem" }}>
              Choose how you'd like to submit your evidence. You can use text, voice, or upload media.
            </p>

            {/* Evidence type selection */}
            <div className="grid grid-cols-2 gap-3 mb-5" role="group" aria-label="Evidence type">
              {[
                { type: "photo" as EvidenceType, icon: "📷", label: "Photo / Video", desc: "Upload images or video from your device" },
                { type: "voice" as EvidenceType, icon: "🎙️", label: "Voice Report", desc: "Record in your own language — AI will transcribe" },
                { type: "text" as EvidenceType, icon: "✏️", label: "Written Report", desc: "Type your observation in any language" },
                { type: "video" as EvidenceType, icon: "📹", label: "Video Report", desc: "Record short video evidence" },
              ].map(({ type, icon, label, desc }) => (
                <button
                  key={type}
                  onClick={() => set({ evidenceType: type, hasEvidence: false, aiProcessed: false, aiSummary: "" })}
                  aria-pressed={state.evidenceType === type}
                  style={{
                    padding: "1rem",
                    border: `2px solid ${state.evidenceType === type ? "var(--color-primary)" : "var(--color-mist)"}`,
                    borderRadius: 12,
                    background: state.evidenceType === type ? "var(--color-primary-light)" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.375rem" }} aria-hidden="true">{icon}</div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-slate)", marginBottom: "0.2rem" }}>{label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-slate-light)", lineHeight: 1.4 }}>{desc}</div>
                </button>
              ))}
            </div>

            {/* Voice recorder */}
            {state.evidenceType === "voice" && (
              <div
                style={{
                  background: "var(--color-parchment)",
                  borderRadius: 14,
                  padding: "1.5rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {!state.hasEvidence ? (
                  <>
                    <button
                      onClick={startRecording}
                      disabled={state.isRecording}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: state.isRecording ? "var(--color-alert)" : "var(--color-primary)",
                        border: "none",
                        cursor: state.isRecording ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem",
                        fontSize: "1.5rem",
                        boxShadow: state.isRecording ? "0 0 0 12px rgba(220,38,38,0.15)" : "0 4px 16px rgba(26,107,74,0.35)",
                        transition: "all 0.2s ease",
                      }}
                      aria-label={state.isRecording ? "Recording..." : "Start voice recording"}
                    >
                      {state.isRecording ? "⏹" : "🎙️"}
                    </button>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-slate-mid)", marginBottom: "0.5rem" }}>
                      {state.isRecording
                        ? `Recording… ${voiceSeconds}s (tap to stop)`
                        : "Tap to start recording"}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-slate-light)" }}>
                      Speak in any language — TraceIt AI will transcribe and structure your report
                    </p>
                  </>
                ) : (
                  <>
                    {!state.aiProcessed ? (
                      <div>
                        <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>⚙️</div>
                        <p style={{ fontSize: "0.85rem", color: "var(--color-slate-mid)" }}>AI is processing your voice report…</p>
                      </div>
                    ) : (
                      <div style={{ textAlign: "left" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: "0.875rem",
                            padding: "0.5rem 0.75rem",
                            background: "var(--color-verified-light)",
                            borderRadius: 8,
                          }}
                        >
                          <span style={{ color: "var(--color-verified)" }}>✓</span>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-verified)" }}>AI transcription complete — please review before submitting</span>
                        </div>
                        <div
                          style={{
                            background: "white",
                            border: "1px solid var(--color-mist)",
                            borderRadius: 10,
                            padding: "0.875rem",
                            fontSize: "0.82rem",
                            color: "var(--color-slate-mid)",
                            lineHeight: 1.7,
                            whiteSpace: "pre-line",
                            marginBottom: "0.75rem",
                            maxHeight: 200,
                            overflowY: "auto",
                          }}
                        >
                          {state.aiSummary}
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--color-slate-light)" }}>
                          This is an AI-generated summary of your recording. You can edit it in the next step.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Photo upload area */}
            {(state.evidenceType === "photo" || state.evidenceType === "video") && (
              <div
                style={{
                  border: "2px dashed var(--color-primary-muted)",
                  borderRadius: 14,
                  padding: "2rem",
                  textAlign: "center",
                  marginBottom: "1rem",
                  background: state.hasEvidence ? "var(--color-primary-light)" : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => set({ hasEvidence: true })}
                onKeyDown={(e) => e.key === "Enter" && set({ hasEvidence: true })}
                tabIndex={0}
                role="button"
                aria-label="Upload media"
              >
                {state.hasEvidence ? (
                  <div>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)" }}>Media uploaded successfully</p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📁</div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-slate)", marginBottom: "0.25rem" }}>
                      Tap to upload {state.evidenceType}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--color-slate-light)" }}>
                      JPG, PNG, MP4 up to 50MB · Location metadata removed automatically
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Text report */}
            {state.evidenceType === "text" && (
              <div className="mb-4">
                <label htmlFor="text-report" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-slate)", marginBottom: "0.5rem" }}>
                  Describe what you observed
                </label>
                <textarea
                  id="text-report"
                  rows={5}
                  placeholder="Write your report here. Include what you saw, when, and where. You can write in any language."
                  value={state.description}
                  onChange={(e) => set({ description: e.target.value, hasEvidence: e.target.value.length > 20 })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--color-mist)",
                    borderRadius: 10,
                    background: "var(--color-parchment)",
                    fontSize: "0.875rem",
                    color: "var(--color-slate)",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "var(--font-body)",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; }}
                />
                <p style={{ fontSize: "0.75rem", color: "var(--color-slate-light)", marginTop: "0.375rem" }}>
                  {state.description.length} / 2000 characters
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => set({ step: 2 })}
                disabled={!state.hasEvidence && state.evidenceType !== null ? false : !state.hasEvidence}
                style={{
                  padding: "0.75rem 1.75rem",
                  background: state.hasEvidence || state.evidenceType ? "var(--color-primary)" : "var(--color-mist)",
                  color: state.hasEvidence || state.evidenceType ? "white" : "var(--color-slate-light)",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: state.evidenceType ? "pointer" : "not-allowed",
                }}
              >
                Next: Add Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {state.step === 2 && (
          <div className="animate-slide-in">
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-slate)", marginBottom: "0.375rem" }}>
              Report Details
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)", marginBottom: "1.5rem" }}>
              Help us understand the context of your report.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="project" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-slate)", marginBottom: "0.5rem" }}>
                  Related project (optional)
                </label>
                <input
                  id="project"
                  type="text"
                  placeholder="Search for a project or leave blank to add a new one"
                  value={state.projectName}
                  onChange={(e) => set({ projectName: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    border: "1px solid var(--color-mist)",
                    borderRadius: 10,
                    background: "var(--color-parchment)",
                    fontSize: "0.875rem",
                    color: "var(--color-slate)",
                    outline: "none",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; }}
                />
              </div>

              <div>
                <label htmlFor="location" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-slate)", marginBottom: "0.5rem" }}>
                  Location (optional)
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    id="location"
                    type="text"
                    placeholder="Describe the location (e.g. 'km 47-50, near Sagamu interchange')"
                    value={state.location}
                    onChange={(e) => set({ location: e.target.value })}
                    style={{
                      flex: 1,
                      padding: "0.625rem 0.875rem",
                      border: "1px solid var(--color-mist)",
                      borderRadius: 10,
                      background: "var(--color-parchment)",
                      fontSize: "0.875rem",
                      color: "var(--color-slate)",
                      outline: "none",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; }}
                  />
                  <button
                    style={{
                      padding: "0.625rem 0.875rem",
                      border: "1px solid var(--color-mist)",
                      borderRadius: 10,
                      background: "var(--color-parchment)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      color: "var(--color-slate-mid)",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => set({ location: "Current GPS location" })}
                    aria-label="Use current location"
                  >
                    📍 Use GPS
                  </button>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--color-slate-light)", marginTop: "0.375rem" }}>
                  Location is optional. If provided, exact coordinates are generalized for privacy.
                </p>
              </div>

              {state.aiSummary && (
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-slate)", marginBottom: "0.5rem" }}>
                    AI-generated summary (review and edit)
                  </label>
                  <textarea
                    rows={6}
                    value={state.aiSummary}
                    onChange={(e) => set({ aiSummary: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid var(--color-mist)",
                      borderRadius: 10,
                      background: "var(--color-parchment)",
                      fontSize: "0.85rem",
                      color: "var(--color-slate)",
                      resize: "vertical",
                      outline: "none",
                      fontFamily: "var(--font-body)",
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-mist)"; }}
                  />
                  <div
                    style={{
                      padding: "0.5rem 0.75rem",
                      background: "var(--color-warning-light)",
                      borderRadius: 8,
                      fontSize: "0.75rem",
                      color: "#92400E",
                      marginTop: "0.375rem",
                    }}
                  >
                    ⚠ Always review AI-generated text before submitting. You are responsible for your report content.
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => set({ step: 1 })}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "transparent",
                  color: "var(--color-slate-mid)",
                  border: "1px solid var(--color-mist)",
                  borderRadius: 10,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => set({ step: 3 })}
                style={{
                  padding: "0.75rem 1.75rem",
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Next: Privacy →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Privacy */}
        {state.step === 3 && (
          <div className="animate-slide-in">
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-slate)", marginBottom: "0.375rem" }}>
              Choose Privacy Level
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)", marginBottom: "1.5rem" }}>
              We default to the safest option. Only change this if you're comfortable being identified.
            </p>

            <div className="flex flex-col gap-3 mb-5" role="radiogroup" aria-label="Privacy level">
              {PRIVACY_OPTIONS.map(({ mode, icon, title, desc, recommended }) => (
                <label
                  key={mode}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "1rem 1.125rem",
                    border: `2px solid ${state.privacy === mode ? "var(--color-primary)" : "var(--color-mist)"}`,
                    borderRadius: 14,
                    background: state.privacy === mode ? "var(--color-primary-light)" : "var(--color-canvas)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value={mode}
                    checked={state.privacy === mode}
                    onChange={() => set({ privacy: mode })}
                    style={{ marginTop: 2 }}
                    aria-describedby={`privacy-desc-${mode}`}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: "1.1rem" }} aria-hidden="true">{icon}</span>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-slate)" }}>{title}</span>
                      {recommended && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-primary)", background: "var(--color-primary-muted)", padding: "0.1rem 0.4rem", borderRadius: 4 }}>
                          Recommended
                        </span>
                      )}
                    </div>
                    <p id={`privacy-desc-${mode}`} style={{ fontSize: "0.82rem", color: "var(--color-slate-mid)", lineHeight: 1.55, margin: 0 }}>
                      {desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div
              style={{
                padding: "0.875rem",
                background: "var(--color-parchment)",
                borderRadius: 10,
                fontSize: "0.78rem",
                color: "var(--color-slate-light)",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              🔒 <strong>Data protection:</strong> TraceIt stores minimal data. We never share your identity with government institutions or contractors without your explicit consent. Read our <button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem", padding: 0 }}>Privacy Policy</button>.
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => set({ step: 2 })}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "transparent",
                  color: "var(--color-slate-mid)",
                  border: "1px solid var(--color-mist)",
                  borderRadius: 10,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => set({ step: 4 })}
                style={{
                  padding: "0.75rem 1.75rem",
                  background: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Submit */}
        {state.step === 4 && (
          <div className="animate-slide-in">
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-slate)", marginBottom: "0.375rem" }}>
              Review & Submit
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-slate-light)", marginBottom: "1.5rem" }}>
              Check your report before submitting. Once submitted, you'll receive a private tracking ID.
            </p>

            {/* Summary */}
            <div
              style={{
                background: "var(--color-parchment)",
                borderRadius: 14,
                padding: "1.25rem",
                marginBottom: "1rem",
              }}
            >
              {[
                { label: "Evidence type", val: state.evidenceType ?? "—" },
                { label: "Related project", val: state.projectName || "Not specified" },
                { label: "Location", val: state.location || "Not specified" },
                { label: "Privacy", val: state.privacy.charAt(0).toUpperCase() + state.privacy.slice(1) },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--color-mist)",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--color-slate-light)" }}>{label}</span>
                  <span style={{ fontWeight: 600, color: "var(--color-slate)" }}>{val}</span>
                </div>
              ))}
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "0.875rem",
                background: "var(--color-parchment)",
                borderRadius: 10,
                cursor: "pointer",
                marginBottom: "1.5rem",
                fontSize: "0.83rem",
                color: "var(--color-slate-mid)",
                lineHeight: 1.55,
              }}
            >
              <input
                type="checkbox"
                checked={state.agreed}
                onChange={(e) => set({ agreed: e.target.checked })}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              I confirm that this report is based on my genuine observations. I understand that TraceIt presents this as community evidence, not verified fact, and that it may be reviewed before publication.
            </label>

            <div className="flex justify-between">
              <button
                onClick={() => set({ step: 3 })}
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "transparent",
                  color: "var(--color-slate-mid)",
                  border: "1px solid var(--color-mist)",
                  borderRadius: 10,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => state.agreed && onNavigate("report-tracking")}
                disabled={!state.agreed}
                style={{
                  padding: "0.75rem 1.75rem",
                  background: state.agreed ? "var(--color-primary)" : "var(--color-mist)",
                  color: state.agreed ? "white" : "var(--color-slate-light)",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: state.agreed ? "pointer" : "not-allowed",
                  boxShadow: state.agreed ? "0 4px 12px rgba(26,107,74,0.3)" : "none",
                }}
              >
                Submit Report ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
