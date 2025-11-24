import React, { useRef } from "react";
import { useResume } from "../../context/ResumeContext";
import { exportToPdf } from "../../utils/exportToPdf";

interface StepReviewProps {
  onBack: () => void;
  onNext: () => void;
}

export default function StepReview({ onBack, onNext }: StepReviewProps) {
  const { state } = useResume();
  const resumeRef = useRef<HTMLDivElement | null>(null);

  async function handleExport() {
    const el = document.getElementById("resume-preview");
    if (!el) {
      alert("Контейнер превью не найден");
      return;
    }
    if (!el.innerHTML?.trim()) {
      alert("Контейнер превью пуст");
      return;
    }

    try {
      await exportToPdf("resume-preview", `Resume_${state.fullName}.pdf`);
    } catch (error) {
      console.error("Ошибка при экспорте PDF:", error);
      alert("Не удалось экспортировать PDF. Попробуйте ещё раз.");
    }
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Предпросмотр резюме</h2>

      {/* Обёртка превью резюме */}
      <div
        id="resume-preview"
        ref={resumeRef}
        className="w-[800px] mx-auto bg-white p-10 shadow-lg text-black"
      >
        {/* Header with name and contacts */}
        <div className="flex items-center gap-6 justify-center mb-8">
          {/* Фото (если есть) */}
          {state.photoDataUrl && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-600 shadow">
              <img
                src={state.photoDataUrl}
                alt="Photo"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              {state.fullName}
            </h1>
            <div className="flex flex-col gap-1 text-gray-600">
              <p className="text-sm">{state.email}</p>
              {state.phone && <p className="text-sm">{state.phone}</p>}
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="h-1 bg-linear-to-r from-transparent via-blue-600 to-transparent mb-8"></div>

        {/* Summary */}
        {state.summary && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              О себе
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {state.summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {state.skills && state.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Навыки
            </h2>
            <div className="flex flex-wrap gap-2">
              {state.skills.map((skill) => (
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

        {/* Experience */}
        {state.experiences && state.experiences.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Опыт работы
            </h2>

            <div className="grid gap-4">
              {state.experiences.map((exp, index) => {
                const title =
                  (exp as any).jobTitle ?? (exp as any).position ?? "";
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
                      {period && (
                        <p className="text-xs text-gray-500">{period}</p>
                      )}
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

        {/* Projects */}
        {state.projects && state.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Проекты
            </h2>

            <div className="grid gap-4">
              {state.projects.map((project, index) => {
                const title = (project as any).title ?? (project as any).name ?? "";
                const role = (project as any).role ?? "";
                const description = (project as any).description ?? "";
                const link = (project as any).link ?? "";
                const techs: string[] = (project as any).techs ?? (project as any).technologies ?? [];
                return (
                  <div key={index} className="border-l-2 border-blue-300 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                    </div>
                    {role && <p className="text-xs text-blue-600 font-medium mb-2">{role}</p>}

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

      {/* Buttons */}
      <div className="flex justify-between max-w-3xl mx-auto mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          ← Назад
        </button>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Скачать PDF →
        </button>
      </div>
    </div>
  );
}
