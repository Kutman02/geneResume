import React, { useRef } from "react";
import { useResume } from "../../context/ResumeContext";
import { exportToPdf } from "../../utils/exportToPdf";

interface StepReviewProps {
  onBack: () => void;
  onNext: () => void; // на генерацию PDF
}

export default function StepReview({ onBack, onNext }: StepReviewProps) {
  const { state } = useResume();
  const resumeRef = useRef<HTMLDivElement | null>(null);

  // Проверяем, что контейнер существует и не пустой, затем вызываем экспорт
  function handleExport() {
    const el = document.getElementById("resume-preview");
    if (!el) {
      alert("Контейнер превью резюме (#resume-preview) не найден. Проверьте разметку.");
      return;
    }
    if (!el.innerHTML || el.innerHTML.trim() === "") {
      alert("Контейнер превью пуст — нечего экспортировать.");
      return;
    }
    // вызов утилиты экспорта
    exportToPdf("resume-preview");
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
        {/* Здесь всё резюме */}
        <div className="flex items-center gap-6 justify-center mb-6">
          {/* Фото (если есть) */}
          {state.photoDataUrl && (
            <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
              <img
                src={state.photoDataUrl}
                alt="Photo"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-center">
            <h1 className="text-3xl font-bold">{state.fullName}</h1>
            <p className="text-gray-600">{state.email}</p>
            {state.phone && <p className="text-gray-600">{state.phone}</p>}
          </div>
        </div>

        {/* Summary */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b pb-1 mb-3">
            О себе
          </h2>
          <p className="text-gray-700 leading-relaxed">{state.summary}</p>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b pb-1 mb-3">
            Навыки
          </h2>
          <div className="flex flex-wrap gap-2">
            {state.skills?.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Experience */}
        {state.experiences && state.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">
              Опыт работы
            </h2>

            <div className="grid gap-4">
              {state.experiences.map((exp, index) => {
                // допускаем разные структуры в state: { jobTitle, period } или { position, startDate, endDate }
                const title = (exp as any).jobTitle ?? (exp as any).position ?? "";
                const company = (exp as any).company ?? "";
                const period =
                  (exp as any).period ??
                  (((exp as any).startDate && (exp as any).endDate)
                    ? `${(exp as any).startDate} — ${(exp as any).endDate}`
                    : "");
                const description = (exp as any).description ?? "";
                return (
                  <div key={index} className="border-l-4 border-blue-400 pl-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-gray-700 font-medium">{company}</p>
                    <p className="text-gray-500 text-sm mb-2">{period}</p>
                    <p className="text-gray-700 whitespace-pre-line">
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
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">
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
                  <div key={index} className="border p-4 rounded-md">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-gray-700 font-medium">{role}</p>

                    <p className="mt-2 text-gray-700 whitespace-pre-line">
                      {description}
                    </p>

                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline mt-2 block"
                      >
                        {link}
                      </a>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {techs.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
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
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Скачать PDF →
          </button>
        </div>
      </div>
    );
}
