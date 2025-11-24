import React from "react";

export type FeedbackTone = "info" | "success" | "warning" | "error";

export interface FeedbackAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export interface FeedbackCardProps {
  title?: string;
  message: string;
  tone?: FeedbackTone;
  actions?: FeedbackAction[];
  onClose?: () => void;
}

const toneTokens: Record<
  FeedbackTone,
  {
    border: string;
    glow: string;
    iconBg: string;
    iconColor: string;
    primaryBtn: string;
    secondaryBtn: string;
  }
> = {
  info: {
    border: "border-sky-200",
    glow: "bg-sky-100",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
    primaryBtn: "bg-sky-600 hover:bg-sky-700 text-white",
    secondaryBtn: "border border-sky-200 text-sky-700 hover:bg-sky-50"
  },
  success: {
    border: "border-emerald-200",
    glow: "bg-emerald-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    primaryBtn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    secondaryBtn:
      "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
  },
  warning: {
    border: "border-amber-200",
    glow: "bg-amber-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    primaryBtn: "bg-amber-500 hover:bg-amber-600 text-white",
    secondaryBtn: "border border-amber-200 text-amber-700 hover:bg-amber-50"
  },
  error: {
    border: "border-rose-200",
    glow: "bg-rose-100",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    primaryBtn: "bg-rose-600 hover:bg-rose-700 text-white",
    secondaryBtn: "border border-rose-200 text-rose-700 hover:bg-rose-50"
  }
};

const iconPaths: Record<FeedbackTone, JSX.Element> = {
  info: (
    <>
      <path d="M12 8h.01" stroke="currentColor" strokeWidth="2" />
      <path
        d="M11 12h1v4h1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </>
  ),
  success: (
    <>
      <path
        d="M9.5 12.5l2 2.5 4-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </>
  ),
  warning: (
    <>
      <path
        d="M12 8v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 15h.01" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 4l8 14H4l8-14z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </>
  ),
  error: (
    <>
      <path
        d="M9.5 9.5l5 5m0-5l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </>
  )
};

export default function FeedbackCard({
  title,
  message,
  tone = "info",
  actions,
  onClose
}: FeedbackCardProps) {
  const palette = toneTokens[tone];

  return (
    <div
      className={`relative isolate overflow-hidden rounded-2xl border bg-white shadow-2xl ${palette.border}`}
    >
      <div
        className={`pointer-events-none absolute -inset-4 blur-3xl opacity-60 ${palette.glow}`}
        aria-hidden
      />
      <div className="relative flex gap-4 p-5">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${palette.iconBg} ${palette.iconColor}`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            {iconPaths[tone]}
          </svg>
        </span>

        <div className="flex-1">
          {title && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              {title}
            </p>
          )}
          <p className="text-base font-medium text-gray-900">{message}</p>

          {actions?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {actions.map(({ label, onClick, variant = "primary" }, index) => (
                <button
                  key={`${label}-${index}`}
                  type="button"
                  onClick={onClick}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    variant === "primary" ? palette.primaryBtn : palette.secondaryBtn
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Закрыть уведомление"
          >
            <span className="text-base leading-none">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
}

