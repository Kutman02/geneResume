import React, { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// схема
const schema = z.object({
  skills: z.array(z.string().min(1)).min(1, "Добавьте хотя бы один навык")
});

type FormData = z.infer<typeof schema>;

interface StepSkillsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepSkills({ onNext, onBack }: StepSkillsProps) {
  const { state, dispatch } = useResume();

  const [inputValue, setInputValue] = useState("");

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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <label className="block font-medium">Навыки</label>

        <input
          type="text"
          value={inputValue}
          placeholder="Введите навык и нажмите Enter..."
          className="w-full border p-2 rounded"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddSkill}
        />

        {errors.skills && (
          <p className="text-red-600 text-sm mt-1">
            {errors.skills.message as string}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2"
          >
            {skill}
            <button
              type="button"
              className="text-red-500 hover:text-red-700"
              onClick={() => removeSkill(skill)}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
        >
          Назад
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
