import React, { useState } from "react";
import { wizardSteps } from "../../utils/wizardSteps";
import StepGeneral from "./StepGeneral";
import StepSkills from "./StepSkills";
import StepExperience from "./StepExperience";
import StepProjects from "./StepProjects";
import StepReview from "./StepReview";
import StepPhoto from "./StepPhoto";






export default function WizardLayout() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = wizardSteps[stepIndex];

  function next() {
    if (stepIndex < wizardSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  }

  function back() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  }

 function renderStep() {
  switch (step.key) {
    case "general":
      return <StepGeneral onNext={next} />;

    case "skills":
      return <StepSkills onNext={next} onBack={back} />;

    case "experience":
      return <StepExperience onNext={next} onBack={back} />;

    case "projects":
      return <StepProjects onNext={next} onBack={back} />;

    case "review":
      return <StepReview onBack={back} onNext={next} />;

    case "photo":
      return <StepPhoto onNext={next} onBack={back} />;

    default:
      return <div>Шаг в разработке...</div>;
  }
}
  const totalSteps = wizardSteps.length;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
              шаг {step.id} / {totalSteps}
            </p>
            <h2 className="text-2xl font-bold text-slate-900">{step.label}</h2>
          </div>
          <span className="text-sm font-semibold text-slate-500">
            {progress}% готово
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
            aria-label={`Прогресс ${progress}%`}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
        {renderStep()}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {stepIndex < wizardSteps.length - 1 && (
          <button
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold shadow-sm"
            onClick={next}
          >
            Пропустить шаг
          </button>
        )}
      </div>
    </div>
  );
}
