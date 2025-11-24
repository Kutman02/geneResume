import React from "react";
import type { ResumeState } from "../../context/ResumeContext";

interface ResumePreviewProps {
  resume: ResumeState;
  previewId: string;
  className?: string;
  responsive?: boolean;
}

const palette = {
  surface: "#ffffff",
  border: "#e2e8f0",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  accent: "#2563eb",
  accentDark: "#1d4ed8",
  accentSoft: "#eff6ff",
  accentBorder: "#bfdbfe",
  accentMuted: "#dbeafe",
  timelineBorder: "#93c5fd"
};

export default function ResumePreview({
  resume,
  previewId,
  className = "",
  responsive = false
}: ResumePreviewProps) {
  const widthClass = responsive ? "w-full max-w-[800px]" : "w-[800px]";

  return (
    <div
      id={previewId}
      className={`${widthClass} mx-auto p-6 sm:p-10 shadow-lg rounded-3xl border ${className}`}
      style={{
        backgroundColor: palette.surface,
        borderColor: palette.border,
        color: palette.textPrimary
      }}
    >
      <div className="flex flex-col items-center gap-4 justify-center mb-8 text-center md:flex-row md:text-left">
        {resume.photoDataUrl && (
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 shadow"
            style={{ borderColor: palette.accent }}
          >
            <img
              src={resume.photoDataUrl}
              alt="Photo"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-2">
          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: palette.accentDark }}
          >
            {resume.fullName}
          </h1>
          {resume.role && (
            <p
              className="text-base sm:text-lg font-semibold"
              style={{ color: palette.accent }}
            >
              {resume.role}
            </p>
          )}
          <div
            className="flex flex-col gap-1 text-sm"
            style={{ color: palette.textSecondary }}
          >
            <p>{resume.email}</p>
            {resume.phone && <p>{resume.phone}</p>}
          </div>
        </div>
      </div>

      <div
        className="mb-8"
        style={{
          height: "4px",
          borderRadius: "999px",
          backgroundImage: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`
        }}
      ></div>

      {resume.summary && (
        <section className="mb-8">
          <h2
            className="text-lg font-bold mb-3 flex items-center gap-2"
            style={{ color: palette.accentDark }}
          >
            <span
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: palette.accent }}
            ></span>
            О себе
          </h2>
          <p
            className="leading-relaxed text-sm"
            style={{ color: palette.textSecondary }}
          >
            {resume.summary}
          </p>
        </section>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-lg font-bold mb-3 flex items-center gap-2"
            style={{ color: palette.accentDark }}
          >
            <span
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: palette.accent }}
            ></span>
            Навыки
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: palette.accentSoft,
                  color: palette.accentDark,
                  borderColor: palette.accentBorder
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {resume.experiences && resume.experiences.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-lg font-bold mb-3 flex items-center gap-2"
            style={{ color: palette.accentDark }}
          >
            <span
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: palette.accent }}
            ></span>
            Опыт работы
          </h2>

          <div className="grid gap-4">
            {resume.experiences.map((exp, index) => {
              const title = (exp as any).jobTitle ?? (exp as any).position ?? "";
              const company = (exp as any).company ?? "";
              const period =
                (exp as any).period ??
                (((exp as any).startDate && (exp as any).endDate)
                  ? `${(exp as any).startDate} — ${(exp as any).endDate}`
                  : "");
              const description = (exp as any).description ?? "";
              return (
                <div
                  key={index}
                  className="border-l-2 pl-4"
                  style={{ borderColor: palette.timelineBorder }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold">{title}</h3>
                    {period && (
                      <p
                        className="text-xs"
                        style={{ color: palette.textSecondary }}
                      >
                        {period}
                      </p>
                    )}
                  </div>
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: palette.accent }}
                  >
                    {company}
                  </p>
                  <p
                    className="text-xs leading-relaxed whitespace-pre-line"
                    style={{ color: palette.textSecondary }}
                  >
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <section>
          <h2
            className="text-lg font-bold mb-3 flex items-center gap-2"
            style={{ color: palette.accentDark }}
          >
            <span
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: palette.accent }}
            ></span>
            Проекты
          </h2>

          <div className="grid gap-4">
            {resume.projects.map((project, index) => {
              const title = (project as any).title ?? (project as any).name ?? "";
              const role = (project as any).role ?? "";
              const description = (project as any).description ?? "";
              const link = (project as any).link ?? "";
              const techs: string[] =
                (project as any).techs ?? (project as any).technologies ?? [];
              return (
                <div
                  key={index}
                  className="border-l-2 pl-4"
                  style={{ borderColor: palette.timelineBorder }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold">{title}</h3>
                  </div>
                  {role && (
                    <p
                      className="text-xs font-medium mb-2"
                      style={{ color: palette.accent }}
                    >
                      {role}
                    </p>
                  )}

                  <p
                    className="text-xs leading-relaxed mb-3 whitespace-pre-line"
                    style={{ color: palette.textSecondary }}
                  >
                    {description}
                  </p>

                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs mb-3 block underline-offset-2"
                      style={{ color: palette.accent }}
                    >
                      {link}
                    </a>
                  )}

                  {techs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: palette.accentMuted,
                            color: palette.accentDark,
                            borderColor: palette.accentBorder
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
