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
        <label className="block font-medium mb-2">Телефон</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
        className="border p-2 rounded w-full sm:w-36"
        defaultValue="+996"
          >
        <option value="+7">🇷🇺 Россия +7</option>
        <option value="+996">🇰🇬 Кыргызстан +996</option>
        <option value="+992">🇹🇯 Таджикистан +992</option>
        <option value="+998">🇺🇿 Узбекистан +998</option>
        <option value="+993">🇹🇲 Туркменистан +993</option>
        <option value="+375">🇧🇾 Беларусь +375</option>
        <option value="+380">🇺🇦 Украина +380</option>
        <option value="+373">🇲🇩 Молдавия +373</option>
          </select>
          <input
        {...register("phone")}
        className="flex-1 border p-2 rounded w-full"
        placeholder="555-12-34"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">О себе краткое описание</label>
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
