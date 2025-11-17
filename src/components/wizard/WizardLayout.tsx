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
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-4 my-6">
        {wizardSteps.map((s, i) => (
          <div
            key={s.key}
            className={`h-2 flex-1 rounded ${
              i <= stepIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">
        {step.id}. {step.label}
      </h2>

      {/* Actual Step */}
      <div>{renderStep()}</div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
      

        {stepIndex < wizardSteps.length - 1 && (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={next}
          >
            Пропустить
          </button>
        )}
      </div>
    </div>
  );
}
