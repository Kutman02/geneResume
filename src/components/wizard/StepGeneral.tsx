import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "../../context/ResumeContext";

// схема данных
const schema = z.object({
  fullName: z.string().min(2, "Введите полное имя"),
  email: z.string().email("Некорректный email"),
  phone: z.string().optional(),
  summary: z
    .string()
    .min(10, "Минимум 10 символов")
    .max(300, "Максимум 300 символов")
});

// 🔥 ВАЖНО: тип данных формы
type FormData = z.infer<typeof schema>;

// 🔥 ВАЖНО: тип пропсов компонента
interface StepGeneralProps {
  onNext: () => void;
}

export default function StepGeneral({ onNext }: StepGeneralProps) {
  const { state, dispatch } = useResume();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: state.fullName,
      email: state.email,
      phone: state.phone,
      summary: state.summary
    }
  });

  // 🔥 ВАЖНО: здесь строго типизируем data
  const onSubmit = (data: FormData) => {
    dispatch({ type: "UPDATE_FIELD", field: "fullName", value: data.fullName });
    dispatch({ type: "UPDATE_FIELD", field: "email", value: data.email });
    dispatch({ type: "UPDATE_FIELD", field: "phone", value: data.phone });
    dispatch({ type: "UPDATE_FIELD", field: "summary", value: data.summary });

    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div>
        <label className="block font-medium">Полное имя</label>
        <input
          {...register("fullName")}
          className="w-full border p-2 rounded"
          placeholder="Иван Иванов"
        />
        {errors.fullName && (
          <p className="text-red-600 text-sm">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          {...register("email")}
          className="w-full border p-2 rounded"
          placeholder="example@gmail.com"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Телефон</label>
        <input
          {...register("phone")}
          className="w-full border p-2 rounded"
          placeholder="+996..."
        />
      </div>

      <div>
        <label className="block font-medium">Краткое описание</label>
        <textarea
          {...register("summary")}
          className="w-full border p-2 rounded min-h-[120px]"
          placeholder="Опыт работы 2+ года, React/Next.js..."
        ></textarea>
        {errors.summary && (
          <p className="text-red-600 text-sm">{errors.summary.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Далее →
      </button>
    </form>
  );
}
