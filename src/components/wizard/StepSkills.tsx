import React, { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillCategories } from "../../constants/skillCategories";

// схема
const schema = z.object({
  skills: z.array(z.string().min(1)).min(1, "Добавьте хотя бы один навык")
});

type FormData = z.infer<typeof schema>;

interface StepSkillsProps {
  onNext: () => void;
  onBack: () => void;
}

// Предустановленные навыки по категориям

export default function StepSkills({ onNext, onBack }: StepSkillsProps) {
  const { state, dispatch } = useResume();

  const [inputValue, setInputValue] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof typeof skillCategories | null>(null);
  const [showCategories, setShowCategories] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: state.skills || []
    }
  });

  const skills = watch("skills");

  function handleAddSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();

      const trimmed = inputValue.trim();
      if (!trimmed) return;

      if (!skills.includes(trimmed)) {
        const updated = [...skills, trimmed];
        setValue("skills", updated);
      }

      setInputValue("");
    }
  }

  function addSkillFromCategory(skill: string) {
    if (!skills.includes(skill)) {
      setValue("skills", [...skills, skill]);
    }
  }

  function removeSkill(skill: string) {
    setValue(
      "skills",
      skills.filter((s) => s !== skill)
    );
  }

  const onSubmit = (data: FormData) => {
    dispatch({ type: "UPDATE_FIELD", field: "skills", value: data.skills });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      <div>
        <label className="block font-medium mb-2">Выберите категорию навыков или добавьте вручную</label>

        {/* Toggle categories */}
        <button
          type="button"
          onClick={() => setShowCategories(!showCategories)}
          className="mb-3 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          {showCategories ? "🔽 Скрыть категории" : "▶️ Показать категории"}
        </button>

        {/* Категории навыков */}
        {showCategories && (
          <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(skillCategories) as Array<keyof typeof skillCategories>).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={`px-4 py-2 rounded font-medium transition ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category === "frontend" && "💻 Frontend"}
                {category === "backend" && "🔧 Backend"}
                {category === "fullstack" && "🚀 Fullstack"}
              </button>
            ))}
          </div>
        )}

        {/* Навыки из выбранной категории */}
        {activeCategory && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">
              {activeCategory === "frontend" && "💻 Frontend навыки"}
              {activeCategory === "backend" && "🔧 Backend навыки"}
              {activeCategory === "fullstack" && "🚀 Fullstack навыки"}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {skillCategories[activeCategory].map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkillFromCategory(skill)}
                  disabled={skills.includes(skill)}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    skills.includes(skill)
                      ? "bg-green-200 text-green-700 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                  }`}
                >
                  {skills.includes(skill) ? "✓ " : "+ "}
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ручное добавление */}
        <div>
          <label className="block text-sm font-medium mb-2">Добавить навык вручную</label>
          <input
            type="text"
            value={inputValue}
            placeholder="Введите навык и нажмите Enter..."
            className="w-full border p-2 rounded"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddSkill}
          />
        </div>

        {errors.skills && (
          <p className="text-red-600 text-sm mt-1">
            {errors.skills.message as string}
          </p>
        )}
      </div>

      {/* Добавленные навыки */}
      {skills.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Ваши навыки ({skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2 text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 font-bold"
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2 rounded-full border bg-gray-100 hover:bg-gray-200"
        >
          ← Назад
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        >
          Далее →
        </button>
      </div>
    </form>
  );
}
