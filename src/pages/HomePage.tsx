import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import type { ResumeRole } from "../context/ResumeContext";
import {
  deleteResumeTemplate,
  loadSavedTemplates,
  SavedResumeTemplate,
  SAVED_TEMPLATES_STORAGE_KEY
} from "../utils/storage";
import { exportToPdf } from "../utils/exportToPdf";
import ResumePreview from "../components/resume/ResumePreview";
import FeedbackCard, {
  FeedbackCardProps
} from "../components/common/FeedbackCard";

const roles = [
  { key: "frontend", label: "Frontend Developer" },
  { key: "backend", label: "Backend Developer" },
  { key: "fullstack", label: "Fullstack Developer" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { dispatch } = useResume();
  const [savedResumes, setSavedResumes] = useState<SavedResumeTemplate[]>([]);
  const [feedback, setFeedback] = useState<Omit<FeedbackCardProps, "onClose"> | null>(null);
  const [confirmingTemplate, setConfirmingTemplate] = useState<SavedResumeTemplate | null>(null);

  const closeFeedback = () => setFeedback(null);
  const closeConfirm = () => setConfirmingTemplate(null);

  useEffect(() => {
    setSavedResumes(loadSavedTemplates());

    function handleStorage(event: StorageEvent) {
      if (event.key === SAVED_TEMPLATES_STORAGE_KEY) {
        setSavedResumes(loadSavedTemplates());
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function handleSelect(role: string) {
    const roleMap: Record<string, ResumeRole> = {
      frontend: "Frontend Developer",
      backend: "Backend Developer",
      fullstack: "Fullstack Developer"
    };
    
    dispatch({ type: "RESET" });
    dispatch({ type: "SET_ROLE", payload: roleMap[role] });
    navigate("/wizard");
  }

  function handleEdit(template: SavedResumeTemplate) {
    dispatch({ type: "SET_RESUME", payload: template.data });
    navigate("/wizard");
  }

  async function handleDownload(template: SavedResumeTemplate) {
    closeFeedback();
    const previewId = `resume-preview-${template.id}`;
    const element = document.getElementById(previewId);
    if (!element) {
      const retry = () => {
        closeFeedback();
        void handleDownload(template);
      };
      setFeedback({
        tone: "error",
        title: "PDF недоступен",
        message: "Не удалось подготовить шаблон для экспорта.",
        actions: [
          { label: "Попробовать снова", onClick: retry, variant: "primary" },
          { label: "Закрыть", onClick: closeFeedback, variant: "secondary" }
        ]
      });
      return;
    }

    try {
      const baseName =
        template.data.fullName || template.name || `Resume_${template.id}`;
      await exportToPdf(
        previewId,
        `Resume_${baseName.replace(/\s+/g, "_")}.pdf`
      );
    } catch (error) {
      console.error("Ошибка скачивания PDF:", error);
      const retry = () => {
        closeFeedback();
        void handleDownload(template);
      };
      setFeedback({
        tone: "error",
        title: "Скачивание не удалось",
        message: "Не удалось скачать PDF. Попробуйте ещё раз.",
        actions: [
          { label: "Повторить попытку", onClick: retry, variant: "primary" },
          { label: "Закрыть", onClick: closeFeedback, variant: "secondary" }
        ]
      });
    }
  }

  function requestDelete(template: SavedResumeTemplate) {
    setConfirmingTemplate(template);
  }

  function confirmDelete() {
    if (!confirmingTemplate) {
      return;
    }
    const next = deleteResumeTemplate(confirmingTemplate.id);
    setSavedResumes(next);
    setConfirmingTemplate(null);
    setFeedback({
      tone: "success",
      title: "Шаблон удалён",
      message: `Шаблон «${confirmingTemplate.name}» успешно удалён.`,
      actions: [{ label: "Готово", onClick: closeFeedback, variant: "primary" }]
    });
  }

  return (
    <>
      {feedback && (
        <div
          className="fixed inset-x-4 bottom-6 z-50 sm:left-auto sm:w-96 sm:inset-x-auto sm:right-6"
          aria-live="assertive"
          role="status"
        >
          <FeedbackCard {...feedback} onClose={closeFeedback} />
        </div>
      )}

      <div className="min-h-screen w-full bg-linear-to-b from-slate-50 via-white to-slate-100 rounded-3xl border border-white/60 shadow-sm px-4 py-12 sm:px-6 lg:px-10">
      <header className="max-w-5xl mx-auto text-center space-y-6">
        <p className="inline-flex items-center text-xs font-semibold tracking-[0.3em] uppercase text-blue-500 mb-4">
          resume builder 2.0
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Создавайте выразительные резюме за минуты и сохраняйте их как шаблоны
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
          GeneResume — это современный мастер по созданию резюме, который
          помогает быстро подготовить отклик под любую роль, сохранить результат
          и вернуться к нему всего в один клик.
        </p>

        <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Гибкость",
              text: "Frontend, Backend и Fullstack роли с адаптированными блоками навыков."
            },
            {
              title: "Автосохранение",
              text: "Все шаги автоматически попадают в localStorage и доступны на главном экране."
            },
            {
              title: "Экспорт",
              text: "Готовый pdf в один клик, плюс архив шаблонов с возможностью редактировать."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 bg-white/70 border border-slate-200 rounded-2xl shadow-sm"
            >
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
                {item.title}
              </p>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="flex flex-col items-center text-center mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Выберите направление резюме
        </h2>

        <div className="grid grid-cols-1 gap-4 w-full max-w-3xl md:grid-cols-3">
        {roles.map((r) => (
          <button
            key={r.key}
            className="p-6 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 text-lg font-semibold transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            onClick={() => handleSelect(r.key)}
          >
            {r.label}
          </button>
        ))}
        </div>
      </section>

      {savedResumes.length > 0 && (
        <div className="w-full max-w-4xl mt-12 space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Мои резюме
          </h2>
          <div className="grid gap-4">
            {savedResumes.map((template) => (
              <div
                key={template.id}
                className="p-5 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white shadow-sm"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </p>
                  {template.role && (
                    <p className="text-sm text-blue-700">{template.role}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Обновлено{" "}
                    {new Date(template.updatedAt).toLocaleString("ru-RU")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full sm:flex-row sm:flex-wrap sm:w-auto">
                  <button
                    onClick={() => handleEdit(template)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm shadow"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => void handleDownload(template)}
                    className="w-full sm:w-auto px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full font-semibold text-sm"
                  >
                    Скачать PDF →
                  </button>
                  <button
                    onClick={() => requestDelete(template)}
                    className="w-full sm:w-auto px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-full font-semibold text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "1px",
          height: "1px",
          overflow: "hidden"
        }}
      >
        {savedResumes.map((template) => (
          <ResumePreview
            key={`preview-${template.id}`}
            resume={template.data}
            previewId={`resume-preview-${template.id}`}
            className="shadow-none"
          />
        ))}
      </div>
      </div>
      {confirmingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Закрыть окно подтверждения"
            className="absolute inset-0 bg-slate-900/40"
            onClick={closeConfirm}
          />
          <div className="relative z-10 w-full max-w-md">
            <FeedbackCard
              tone="warning"
              title="Удалить шаблон?"
              message={`Шаблон «${confirmingTemplate.name}» будет удалён без возможности восстановления.`}
              onClose={closeConfirm}
              actions={[
                { label: "Отмена", onClick: closeConfirm, variant: "secondary" },
                { label: "Удалить", onClick: confirmDelete, variant: "primary" }
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}
