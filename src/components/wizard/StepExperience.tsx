import React from "react";
import { useResume } from "../../context/ResumeContext";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// схема единичного опыта (для формы)
const experienceSchema = z.object({
  jobTitle: z.string().min(2, "Введите должность"),
  company: z.string().min(2, "Введите название компании"),
  period: z.string().min(2, "Введите период работы"),
  description: z.string().min(10, "Минимум 10 символов")
});

const schema = z.object({
  experience: z.array(experienceSchema).min(1, "Добавьте хотя бы один опыт")
});

type FormData = z.infer<typeof schema>;

interface StepExperienceProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepExperience({ onNext, onBack }: StepExperienceProps) {
  const { state, dispatch } = useResume();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      experience: state.experiences && state.experiences.length
        ? state.experiences.map((exp) => {
            // exp может иметь разную форму (position/startDate/endDate) — приводим к форме формы
            const anyExp = exp as any;
            const jobTitle = anyExp.jobTitle ?? anyExp.position ?? "";
            const company = anyExp.company ?? "";
            const period =
              (anyExp.startDate && anyExp.endDate)
                ? `${anyExp.startDate} — ${anyExp.endDate}`
                : anyExp.period ?? "";
            const description = anyExp.description ?? "";
            return {
              jobTitle,
              company,
              period,
              description
            };
          })
        : [
            {
              jobTitle: "",
              company: "",
              period: "",
              description: ""
            }
          ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience"
  });

  function addExperience() {
    append({
      jobTitle: "",
      company: "",
      period: "",
      description: ""
    });
  }

  const onSubmit = (data: FormData) => {
    // Преобразуем назад в структуру, ожидаемую в контексте (position, company, startDate, endDate, description)
    const payload = data.experience.map((e) => {
      const parts = e.period ? e.period.split("—").map((p) => p.trim()) : [];
      return {
        // сохраняем position из jobTitle — это соответствует возможной структуре контекста
        position: e.jobTitle,
        company: e.company,
        description: e.description,
        startDate: parts[0] ?? "",
        endDate: parts[1] ?? ""
      };
    });

    dispatch({
      type: "UPDATE_FIELD",
      field: "experiences",
      value: payload
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <h2 className="text-xl font-semibold">Опыт работы</h2>

      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 rounded-lg grid gap-3">
          <div className="grid gap-1">
            <label>Должность</label>
            <input
              {...register(`experience.${index}.jobTitle`)}
              className="border p-2 rounded"
              placeholder="Frontend Developer"
            />
            {errors.experience?.[index]?.jobTitle && (
              <p className="text-red-600">
                {errors.experience[index]?.jobTitle?.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label>Компания</label>
            <input
              {...register(`experience.${index}.company`)}
              className="border p-2 rounded"
              placeholder="Google"
            />
            {errors.experience?.[index]?.company && (
              <p className="text-red-600">
                {errors.experience[index]?.company?.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label>Период</label>
            <input
              {...register(`experience.${index}.period`)}
              className="border p-2 rounded"
              placeholder="2022 — 2024"
            />
            {errors.experience?.[index]?.period && (
              <p className="text-red-600">
                {errors.experience[index]?.period?.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label>Описание обязанностей</label>
            <textarea
              {...register(`experience.${index}.description`)}
              className="border p-2 rounded min-h-[100px]"
              placeholder="Разработка UI компонентов, оптимизация рендера, работа с API..."
            />
            {errors.experience?.[index]?.description && (
              <p className="text-red-600">
                {errors.experience[index]?.description?.message}
              </p>
            )}
          </div>

          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-700 text-sm mt-2"
            >
              Удалить опыт
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        + Добавить опыт
      </button>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          ← Назад
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Далее →
        </button>
      </div>
    </form>
  );
}
