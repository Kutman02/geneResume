import React, { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// схема проекта
const projectSchema = z.object({
  title: z.string().min(2, "Введите название проекта"),
  role: z.string().min(2, "Укажите вашу роль"),
  description: z.string().min(10, "Минимум 10 символов"),
  link: z.string().url("Некорректная ссылка").optional().or(z.literal("")),
  techs: z.array(z.string().min(1)).min(1, "Добавьте хотя бы 1 технологию")
});

// схема формы
const schema = z.object({
  projects: z.array(projectSchema).min(1, "Добавьте хотя бы один проект")
});

type FormData = z.infer<typeof schema>;

interface StepProjectsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepProjects({ onNext, onBack }: StepProjectsProps) {
  const { state, dispatch } = useResume();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projects: state.projects?.length
        ? state.projects
        : [
            {
              title: "",
              role: "",
              description: "",
              link: "",
              techs: []
            }
          ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects"
  });

  // обработка techs (чипы)
  const handleAddTech = (index: number, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const currentTechs = watch(`projects.${index}.techs`);
    if (currentTechs.includes(trimmed)) return;

    setValue(`projects.${index}.techs`, [...currentTechs, trimmed]);
  };

  const removeTech = (projectIndex: number, tech: string) => {
    const current = watch(`projects.${projectIndex}.techs`);
    setValue(
      `projects.${projectIndex}.techs`,
      current.filter((t) => t !== tech)
    );
  };

  const onSubmit = (data: FormData) => {
    dispatch({ type: "UPDATE_FIELD", field: "projects", value: data.projects });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <h2 className="text-xl font-semibold">Проекты</h2>

      {fields.map((field, index) => {
        const techInput = `techInput_${index}`;
        return (
          <div key={field.id} className="border p-4 rounded-lg grid gap-3">
            {/* Название */}
            <div>
              <label className="block">Название проекта</label>
              <input
                {...register(`projects.${index}.title`)}
                className="border p-2 rounded w-full"
                placeholder="CV Generator"
              />
              {errors.projects?.[index]?.title && (
                <p className="text-red-600 text-sm">
                  {errors.projects[index]?.title?.message}
                </p>
              )}
            </div>

            {/* Роль */}
            <div>
              <label className="block">Роль</label>
              <input
                {...register(`projects.${index}.role`)}
                className="border p-2 rounded w-full"
                placeholder="Frontend Developer"
              />
              {errors.projects?.[index]?.role && (
                <p className="text-red-600 text-sm">
                  {errors.projects[index]?.role?.message}
                </p>
              )}
            </div>

            {/* Описание */}
            <div>
              <label className="block">Описание</label>
              <textarea
                {...register(`projects.${index}.description`)}
                className="border p-2 rounded w-full min-h-[100px]"
                placeholder="Проект для генерации резюме с PDF экспортом..."
              />
              {errors.projects?.[index]?.description && (
                <p className="text-red-600 text-sm">
                  {errors.projects[index]?.description?.message}
                </p>
              )}
            </div>

            {/* Ссылка */}
            <div>
              <label className="block">Ссылка на проект (GitHub или сайт)</label>
              <input
                {...register(`projects.${index}.link`)}
                className="border p-2 rounded w-full"
                placeholder="https://github.com/username/project"
              />
              {errors.projects?.[index]?.link && (
                <p className="text-red-600 text-sm">
                  {errors.projects[index]?.link?.message}
                </p>
              )}
            </div>

            {/* Технологии */}
            <div>
              <label className="block font-medium">Технологии</label>

              <input
                id={techInput}
                className="border p-2 rounded w-full"
                placeholder="Введите технологию и нажмите Enter (React, Vite...)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // @ts-ignore
                    handleAddTech(index, e.target.value);
                    // @ts-ignore
                    e.target.value = "";
                  }
                }}
              />

              {/* Ошибка */}
              {errors.projects?.[index]?.techs && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.projects[index]?.techs?.message as string}
                </p>
              )}

              {/* Теги */}
              <div className="flex flex-wrap gap-2 mt-2">
                {watch(`projects.${index}.techs`).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
                  >
                    {tech}
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeTech(index, tech)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Удалить проект
              </button>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          append({
            title: "",
            role: "",
            description: "",
            link: "",
            techs: []
          })
        }
        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        + Добавить проект
      </button>

      <div className="flex justify-between mt-6">
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
