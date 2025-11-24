import React from "react";
import { useResume } from "../context/ResumeContext";
import WizardLayout from "../components/wizard/WizardLayout";

export default function WizardPage() {
  const { state } = useResume();

  if (!state.role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Роль не выбрана
        </h1>
        <p className="text-gray-700">
          Перейдите на главную и выберите направление разработчика.
        </p>
        <a href="/" className="mt-4 text-blue-600 underline">Вернуться назад</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full rounded-3xl border border-white/60 bg-white/70 backdrop-blur px-4 py-10 sm:px-6 lg:px-12 shadow-sm">
      <WizardLayout />
    </div>
  );
}
