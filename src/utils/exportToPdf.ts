// @ts-ignore
import html2pdf from "html2pdf.js";

const tailwindStyles: Record<string, Record<string, string>> = {
  // Цвета текста
  "text-black": { color: "#000" },
  "text-white": { color: "#fff" },
  "text-gray-500": { color: "#6b7280" },
  "text-gray-600": { color: "#4b5563" },
  "text-gray-700": { color: "#374151" },
  "text-gray-900": { color: "#111827" },
  "text-blue-600": { color: "#2563eb" },
  "text-blue-700": { color: "#1e40af" },
  "text-blue-900": { color: "#1e3a8a" },
  "text-green-700": { color: "#15803d" },

  // Фоновые цвета
  "bg-white": { backgroundColor: "#fff" },
  "bg-gray-50": { backgroundColor: "#f9fafb" },
  "bg-gray-100": { backgroundColor: "#f3f4f6" },
  "bg-gray-200": { backgroundColor: "#e5e7eb" },
  "bg-blue-50": { backgroundColor: "#eff6ff" },
  "bg-blue-100": { backgroundColor: "#dbeafe" },
  "bg-blue-600": { backgroundColor: "#2563eb" },
  "bg-blue-700": { backgroundColor: "#1d4ed8" },
  "bg-green-100": { backgroundColor: "#dcfce7" },

  // Границы
  "border": { border: "1px solid #d1d5db" },
  "border-2": { border: "2px solid #d1d5db" },
  "border-b": { borderBottom: "1px solid #d1d5db" },
  "border-l-2": { borderLeft: "2px solid #d1d5db" },
  "border-l-4": { borderLeft: "4px solid #d1d5db" },
  "border-blue-200": { borderColor: "#bfdbfe" },
  "border-blue-300": { borderColor: "#93c5fd" },
  "border-blue-400": { borderColor: "#60a5fa" },
  "border-blue-600": { borderColor: "#2563eb" },

  // Скругление
  "rounded": { borderRadius: "0.375rem" },
  "rounded-full": { borderRadius: "9999px" },
  "rounded-md": { borderRadius: "0.375rem" },
  "rounded-lg": { borderRadius: "0.5rem" },

  // Паддинг
  "p-2": { padding: "0.5rem" },
  "p-4": { padding: "1rem" },
  "p-10": { padding: "2.5rem" },
  "px-2": { paddingLeft: "0.5rem", paddingRight: "0.5rem" },
  "px-3": { paddingLeft: "0.75rem", paddingRight: "0.75rem" },
  "py-1": { paddingTop: "0.25rem", paddingBottom: "0.25rem" },
  "pb-1": { paddingBottom: "0.25rem" },
  "pl-4": { paddingLeft: "1rem" },

  // Маржин
  "m-0": { margin: "0" },
  "mb-1": { marginBottom: "0.25rem" },
  "mb-2": { marginBottom: "0.5rem" },
  "mb-3": { marginBottom: "0.75rem" },
  "mb-6": { marginBottom: "1.5rem" },
  "mb-8": { marginBottom: "2rem" },
  "mt-1": { marginTop: "0.25rem" },
  "mt-2": { marginTop: "0.5rem" },
  "mt-3": { marginTop: "0.75rem" },

  // Гэп
  "gap-1": { gap: "0.25rem" },
  "gap-2": { gap: "0.5rem" },
  "gap-4": { gap: "1rem" },
  "gap-6": { gap: "1.5rem" },

  // Шрифт
  "font-bold": { fontWeight: "700" },
  "font-semibold": { fontWeight: "600" },
  "font-medium": { fontWeight: "500" },
  "text-xs": { fontSize: "0.75rem" },
  "text-sm": { fontSize: "0.875rem" },
  "text-lg": { fontSize: "1.125rem" },
  "text-xl": { fontSize: "1.25rem" },
  "text-2xl": { fontSize: "1.5rem" },
  "text-3xl": { fontSize: "1.875rem" },
  "text-4xl": { fontSize: "2.25rem" },

  // Высота строки
  "leading-relaxed": { lineHeight: "1.625" },

  // Flex/Grid
  "flex": { display: "flex" },
  "grid": { display: "grid" },
  "flex-wrap": { flexWrap: "wrap" },
  "flex-col": { flexDirection: "column" },
  "items-center": { alignItems: "center" },
  "items-start": { alignItems: "flex-start" },
  "justify-center": { justifyContent: "center" },
  "justify-between": { justifyContent: "space-between" },
  "overflow-hidden": { overflow: "hidden" },
  "block": { display: "block" },

  // Размеры
  "w-full": { width: "100%" },
  "w-32": { width: "8rem" },
  "h-32": { height: "8rem" },
  "h-full": { height: "100%" },
  "h-1": { height: "0.25rem" },
  "h-6": { height: "1.5rem" },
  "object-cover": { objectFit: "cover" },

  // Тень
  "shadow": { boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  "shadow-lg": { boxShadow: "0 10px 15px rgba(0,0,0,0.1)" },

  // Прочее
  "whitespace-pre-line": { whiteSpace: "pre-line" },
  "underline": { textDecoration: "underline" },
  "mx-auto": { marginLeft: "auto", marginRight: "auto" },
  "text-center": { textAlign: "center" }
};

export async function exportToPdf(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Элемент с ID "${elementId}" не найден`);
  }

  try {
    // Клонируем элемент
    const cloned = element.cloneNode(true) as HTMLElement;

    // Создаём временный контейнер
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.appendChild(cloned);
    document.body.appendChild(container);

    // Конвертируем все классы в inline стили
    const allElements = cloned.querySelectorAll("*");
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const classList = htmlEl.className;
      htmlEl.className = "";

      const styles: Record<string, string> = {};

      // Разбираем все классы
      classList.split(" ").forEach((className) => {
        const className_trimmed = className.trim();
        if (className_trimmed && tailwindStyles[className_trimmed]) {
          Object.assign(styles, tailwindStyles[className_trimmed]);
        }
      });

      // Обработка градиента
      if (classList.includes("bg-gradient-to-r")) {
        styles.background =
          "linear-gradient(to right, transparent, #2563eb, transparent)";
      }

      // Применяем стили
      Object.assign(htmlEl.style, styles);
    });

    // Параметры html2pdf
    const options = {
      margin: 10,
      filename,
      image: { type: "png" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      },
      jsPDF: {
        orientation: "portrait" as const,
        unit: "mm" as const,
        format: "a4" as const,
        compress: true
      }
    };

    // Генерируем и скачиваем PDF
    await html2pdf().set(options).from(cloned).save();

    // Удаляем контейнер
    document.body.removeChild(container);
  } catch (error) {
    console.error("Ошибка при генерации PDF:", error);
    throw error;
  }
}
