import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResume } from "../../context/ResumeContext";
import { saveResumeTemplate } from "../../utils/storage";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useResume();

  const hasResumeData =
    Boolean(
      state.role ||
        state.fullName ||
        state.email ||
        state.phone ||
        state.summary ||
        state.skills.length ||
        state.projects.length ||
        state.experiences.length ||
        state.photoDataUrl
    ) && location.pathname !== "/";

  function requestGoHome() {
    setIsMenuOpen(false);

    if (location.pathname === "/") {
      navigate("/");
      return;
    }

    if (hasResumeData) {
      setIsConfirmOpen(true);
      return;
    }

    navigate("/");
  }

  async function handleConfirm(saveTemplate: boolean) {
    if (saveTemplate) {
      try {
        setIsSaving(true);
        const template = saveResumeTemplate(state);
        dispatch({
          type: "UPDATE_FIELD",
          field: "templateId",
          value: template.id
        });
      } finally {
        setIsSaving(false);
      }
    }

    setIsConfirmOpen(false);
    navigate("/");
  }

  function cancelConfirm() {
    setIsSaving(false);
    setIsConfirmOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-4 rounded-full bg-white/60 backdrop-blur border border-white/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold">
            G
          </div>
          <div className="text-sm leading-tight">
            <p className="uppercase tracking-[0.4em] text-xs text-blue-500">
              geneResume
            </p>
            <p className="font-semibold text-gray-900">Смарт-конструктор CV</p>
          </div>
        </div>

        <div className="relative">
          <button
            className="flex flex-col justify-center items-center w-12 h-12 rounded-full border border-gray-300 bg-white/80 hover:bg-white transition"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Открыть меню"
          >
            <span
              className={`h-0.5 w-6 bg-gray-800 transition-transform ${
                isMenuOpen ? "translate-y-1 rotate-45" : ""
              }`}
            ></span>
            <span
              className={`h-0.5 w-6 bg-gray-800 my-1 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`h-0.5 w-6 bg-gray-800 transition-transform ${
                isMenuOpen ? "-translate-y-1 -rotate-45" : ""
              }`}
            ></span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-xl p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                меню
              </p>
              <button
                onClick={requestGoHome}
                className="w-full text-left px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Главная
              </button>
              {hasResumeData && (
                <p className="text-[11px] text-gray-500 mt-3">
                  Перед выходом мы предложим сохранить текущий черновик как
                  шаблон.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {isConfirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-500">
              подтверждение
            </p>
            <h3 className="text-2xl font-semibold text-gray-900">
              Сохранить резюме как шаблон?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Если сохраните, шаблон появится в разделе «Мои резюме» и вы сможете
              вернуться к нему позже. Если нет — черновик будет очищен при
              старте нового резюме.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleConfirm(true)}
                disabled={isSaving}
                className="w-full px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? "Сохраняем..." : "Сохранить и выйти"}
              </button>
              <button
                onClick={() => handleConfirm(false)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition"
              >
                Выйти без сохранения
              </button>
              <button
                onClick={cancelConfirm}
                className="w-full px-4 py-3 text-sm text-gray-500 hover:text-gray-700"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

