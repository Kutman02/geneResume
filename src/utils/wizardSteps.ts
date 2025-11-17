const steps = [
  { key: "general", label: "Общее" },
  { key: "skills", label: "Навыки" },
  { key: "experience", label: "Опыт" },
  { key: "projects", label: "Проекты" },
  { key: "photo", label: "Фото" },
  { key: "review", label: "Просмотр" },
];

export const wizardSteps = steps.map((s, i) => ({ ...s, id: i + 1 }));
