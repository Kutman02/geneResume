// @ts-ignore
import html2pdf from "html2pdf.js";

// ===============================
//  СТИЛИ ДЛЯ КРАСИВОГО PDF-КОНТЕНТА
// ===============================
const PDF_GLOBAL_STYLE = `
  .pdf-wrapper {
    background: #ffffff;
    border-radius: 16px;
    padding: 32px;
    max-width: 900px;
    margin: 40px auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.2);
    font-family: "Inter", sans-serif;
  }

  .pdf-wrapper h1,
  .pdf-wrapper h2,
  .pdf-wrapper h3 {
    font-weight: 600;
    color: #1a1a1a;
  }

  .pdf-wrapper p {
    color: #333;
    line-height: 1.6;
    font-size: 16px;
  }

  @media (max-width: 600px) {
    .pdf-wrapper {
      padding: 20px;
      margin: 20px;
    }
  }
`;

// ===============================
//  КЛОНИРОВАНИЕ С INLINE СТИЛЯМИ
// ===============================
function cloneNodeWithInlineStyles(element: Element): Element {
  const clone = element.cloneNode(false) as Element;

  if (element instanceof HTMLElement || element instanceof SVGElement) {
    const computed = window.getComputedStyle(element);
    for (const property of computed) {
      (clone as HTMLElement).style.setProperty(
        property,
        computed.getPropertyValue(property)
      );
    }
  }

  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      clone.appendChild(cloneNodeWithInlineStyles(child as Element));
    } else {
      clone.appendChild(child.cloneNode(true));
    }
  });

  return clone;
}

// ===============================
//  ОСНОВНОЙ МЕТОД ЭКСПОРТА В PDF
// ===============================
const A4_WIDTH_PX = 794; // ~210mm @ 96dpi

export async function exportToPdf(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Элемент с ID "${elementId}" не найден`);
  }

  try {
    // Добавляем глобальные стили для PDF
    const styleTag = document.createElement("style");
    styleTag.innerHTML = PDF_GLOBAL_STYLE;
    document.head.appendChild(styleTag);

    // Клонируем блок с inline-стилями
    const cloned = cloneNodeWithInlineStyles(element) as HTMLElement;
    const sourceWidth = element.getBoundingClientRect().width || A4_WIDTH_PX;

    cloned.style.boxSizing = "border-box";
    cloned.style.width = `${A4_WIDTH_PX}px`;
    cloned.style.maxWidth = `${A4_WIDTH_PX}px`;
    cloned.style.margin = "0 auto";

    // Контейнер для рендера
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = `${A4_WIDTH_PX}px`;
    container.style.padding = "0";

    // Авто-масштабирование
    const scaleFactor = sourceWidth > 0 ? Math.min(1, A4_WIDTH_PX / sourceWidth) : 1;

    if (scaleFactor !== 1) {
      cloned.style.transformOrigin = "top left";
      cloned.style.transform = `scale(${scaleFactor})`;
      cloned.dataset.scaleFactor = String(scaleFactor);
      const rect = cloned.getBoundingClientRect();
      container.style.height = `${rect.height}px`;
    }

    container.appendChild(cloned);
    document.body.appendChild(container);

    // Параметры html2pdf.js
    const options = {
      margin: 10,
      filename,
      image: { type: "png" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      },
      jsPDF: {
        orientation: "portrait" as const,
        unit: "mm" as const,
        format: "a4" as const,
        compress: true,
      },
      pagebreak: { mode: ["css", "legacy"] as const },
    };

    // Генерируем PDF
    await html2pdf().set(options).from(cloned).save();

    document.body.removeChild(container);
    document.head.removeChild(styleTag);

  } catch (error) {
    console.error("Ошибка при генерации PDF:", error);
    throw error;
  }
}
