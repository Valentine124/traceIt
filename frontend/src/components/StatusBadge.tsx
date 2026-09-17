import type { ProjectStatus, ReportStatus } from "../types";

interface StatusBadgeProps {
  status: ProjectStatus | ReportStatus | "verified" | "unverified" | "disputed";
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  "on-track": { label: "On Track", bg: "var(--color-verified-light)", color: "var(--color-verified)", dot: "var(--color-verified)" },
  "completed": { label: "Completed", bg: "var(--color-primary-light)", color: "var(--color-primary)", dot: "var(--color-primary)" },
  "delayed": { label: "Delayed", bg: "var(--color-warning-light)", color: "var(--color-warning)", dot: "var(--color-warning)" },
  "stalled": { label: "Stalled", bg: "var(--color-alert-light)", color: "var(--color-alert)", dot: "var(--color-alert)" },
  "disputed": { label: "Disputed", bg: "#FEF0E7", color: "var(--color-terra)", dot: "var(--color-terra)" },
  "verified": { label: "Verified", bg: "var(--color-verified-light)", color: "var(--color-verified)", dot: "var(--color-verified)" },
  "unverified": { label: "Unverified", bg: "var(--color-unverified-light)", color: "var(--color-unverified)", dot: "var(--color-unverified)" },
  "submitted": { label: "Submitted", bg: "var(--color-unverified-light)", color: "var(--color-unverified)", dot: "var(--color-unverified)" },
  "under-review": { label: "Under Review", bg: "var(--color-warning-light)", color: "var(--color-warning)", dot: "var(--color-warning)" },
  "institution-response": { label: "Institution Response", bg: "var(--color-primary-light)", color: "var(--color-primary)", dot: "var(--color-primary)" },
  "resolved": { label: "Resolved", bg: "var(--color-verified-light)", color: "var(--color-verified)", dot: "var(--color-verified)" },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG["unverified"];
  const padding = size === "sm" ? "0.2rem 0.5rem" : "0.25rem 0.625rem";
  const fontSize = size === "sm" ? "0.7rem" : "0.75rem";

  return (
    <span
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding,
        background: config.bg,
        color: config.color,
        borderRadius: 20,
        fontSize,
        fontWeight: 600,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        className="status-dot"
        aria-hidden="true"
        style={{ background: config.dot }}
      />
      {config.label}
    </span>
  );
}

interface VerificationBadgeProps {
  status: "verified" | "unverified" | "disputed";
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "0.2rem 0.5rem",
        background: config.bg,
        color: config.color,
        borderRadius: 6,
        fontSize: "0.72rem",
        fontWeight: 600,
      }}
    >
      {status === "verified" && "✓ Verified"}
      {status === "unverified" && "? Unverified"}
      {status === "disputed" && "⚠ Disputed"}
    </span>
  );
}
