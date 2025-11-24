import React, { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { exportToPdf } from "../../utils/exportToPdf";
import { saveResumeTemplate } from "../../utils/storage";
import ResumePreview from "../resume/ResumePreview";
import FeedbackCard, {
  FeedbackCardProps
} from "../common/FeedbackCard";

interface StepReviewProps {
  onBack: () => void;
  onNext: () => void;
}

export default function StepReview({ onBack, onNext }: StepReviewProps) {
  const { state, dispatch } = useResume();
  const [feedback, setFeedback] = useState<Omit<FeedbackCardProps, "onClose"> | null>(null);

  const closeFeedback = () => setFeedback(null);

  async function handleExport() {
    closeFeedback();
    const el = document.getElementById("resume-preview");
    if (!el) {
      const retry = () => {
        closeFeedback();
        void handleExport();
      };
      setFeedback({
        tone: "error",
        title: "Предпросмотр недоступен",
        message: "Контейнер превью не найден.",
        actions: [
          { label: "Попробовать снова", onClick: retry, variant: "primary" },
          { label: "Закрыть", onClick: closeFeedback, variant: "secondary" }
        ]
      });
      return;
    }
    if (!el.innerHTML?.trim()) {
      const retry = () => {
        closeFeedback();
        void handleExport();
      };
      setFeedback({
        tone: "error",
        title: "Пустой превью",
        message: "Контейнер превью пуст. Убедитесь, что все поля заполнены.",
        actions: [
          { label: "Заполнить данные", onClick: onBack, variant: "primary" },
          { label: "Попробовать снова", onClick: retry, variant: "secondary" }
        ]
      });
      return;
    }

    try {
      await exportToPdf("resume-preview", `Resume_${state.fullName}.pdf`);
      const template = saveResumeTemplate(state);
      dispatch({
        type: "UPDATE_FIELD",
        field: "templateId",
        value: template.id
      });
    } catch (error) {
      console.error("Ошибка при экспорте PDF:", error);
      const retry = () => {
        closeFeedback();
        void handleExport();
      };
      setFeedback({
        tone: "error",
        title: "Экспорт не удался",
        message: "Не удалось экспортировать PDF. Попробуйте ещё раз.",
        actions: [
          { label: "Повторить попытку", onClick: retry, variant: "primary" },
          { label: "Закрыть", onClick: closeFeedback, variant: "secondary" }
        ]
      });
    }
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

      <div className="grid gap-6">
        <h2 className="text-2xl font-bold">Предпросмотр резюме</h2>

        {/* Обёртка превью резюме */}
        <ResumePreview
          resume={state}
          previewId="resume-preview"
          responsive
        />

        {/* Buttons */}
        <div className="flex justify-between max-w-3xl mx-auto mt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            ← Назад
          </button>

          <button
            onClick={() => void handleExport()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Скачать PDF →
          </button>
        </div>
      </div>
    </>
  );
}
