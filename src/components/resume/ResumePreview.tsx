import React from "react";
import type { ResumeState } from "../../context/ResumeContext";

interface ResumePreviewProps {
  resume: ResumeState;
  previewId: string;
  className?: string;
  responsive?: boolean;
}

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
      className={`${widthClass} mx-auto bg-white p-6 sm:p-10 shadow-lg text-black rounded-3xl border border-slate-200 ${className}`}
    >
      <div className="flex flex-col items-center gap-4 justify-center mb-8 text-center md:flex-row md:text-left">
        {resume.photoDataUrl && (
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-blue-600 shadow">
            <img
              src={resume.photoDataUrl}
              alt="Photo"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900">
            {resume.fullName}
          </h1>
          {resume.role && (
            <p className="text-base sm:text-lg font-semibold text-blue-600">
              {resume.role}
            </p>
          )}
          <div className="flex flex-col gap-1 text-gray-600 text-sm">
            <p>{resume.email}</p>
            {resume.phone && <p>{resume.phone}</p>}
          </div>
        </div>
      </div>

      <div className="h-1 bg-linear-to-r from-transparent via-blue-600 to-transparent mb-8"></div>

      {resume.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            О себе
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">{resume.summary}</p>
        </section>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            Навыки
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {resume.experiences && resume.experiences.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
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
                <div key={index} className="border-l-2 border-blue-300 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                    {period && <p className="text-xs text-gray-500">{period}</p>}
                  </div>
                  <p className="text-xs text-blue-600 font-medium mb-2">
                    {company}
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
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
          <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
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
                <div key={index} className="border-l-2 border-blue-300 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                  </div>
                  {role && (
                    <p className="text-xs text-blue-600 font-medium mb-2">{role}</p>
                  )}

                  <p className="text-xs text-gray-700 leading-relaxed mb-3 whitespace-pre-line">
                    {description}
                  </p>

                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-xs mb-3 block"
                    >
                      {link}
                    </a>
                  )}

                  {techs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
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

