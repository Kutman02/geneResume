// @ts-ignore
import html2pdf from "html2pdf.js";

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

const A4_WIDTH_PX = 794; // ~210mm @ 96dpi

export async function exportToPdf(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Элемент с ID "${elementId}" не найден`);
  }

  try {
    const cloned = cloneNodeWithInlineStyles(element) as HTMLElement;
    const sourceWidth = element.getBoundingClientRect().width || A4_WIDTH_PX;

    cloned.style.boxSizing = "border-box";
    cloned.style.width = `${A4_WIDTH_PX}px`;
    cloned.style.maxWidth = `${A4_WIDTH_PX}px`;
    cloned.style.margin = "0 auto";

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = `${A4_WIDTH_PX}px`;
    container.style.padding = "0";

    const scaleFactor =
      sourceWidth > 0 ? Math.min(1, A4_WIDTH_PX / sourceWidth) : 1;

    if (scaleFactor !== 1) {
      cloned.style.transformOrigin = "top left";
      cloned.style.transform = `scale(${scaleFactor})`;
      cloned.dataset.scaleFactor = String(scaleFactor);
      const rect = cloned.getBoundingClientRect();
      container.style.height = `${rect.height}px`;
    }

    container.appendChild(cloned);
    document.body.appendChild(container);

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
      },
      pagebreak: { mode: ["css", "legacy"] as const }
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
