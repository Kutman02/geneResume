import type { ResumeRole, ResumeState } from "../context/ResumeContext";

export const SAVED_TEMPLATES_STORAGE_KEY = "geneResume_saved_templates";

export interface SavedResumeTemplate {
  id: string;
  name: string;
  role: ResumeRole;
  updatedAt: string;
  data: ResumeState;
}

const isBrowser = typeof window !== "undefined";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function generateId() {
  if (isBrowser && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `resume-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadSavedTemplates(): SavedResumeTemplate[] {
  if (!isBrowser) return [];
  return (
    safeParse<SavedResumeTemplate[]>(
      window.localStorage.getItem(SAVED_TEMPLATES_STORAGE_KEY)
    ) ?? []
  );
}

export function persistSavedTemplates(templates: SavedResumeTemplate[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(
    SAVED_TEMPLATES_STORAGE_KEY,
    JSON.stringify(templates)
  );
}

export function saveResumeTemplate(state: ResumeState): SavedResumeTemplate {
  const templates = loadSavedTemplates();
  const templateId = state.templateId ?? generateId();

  const normalizedData: ResumeState = {
    ...state,
    templateId
  };

  const entry: SavedResumeTemplate = {
    id: templateId,
    name: state.fullName || "Без названия",
    role: state.role,
    updatedAt: new Date().toISOString(),
    data: normalizedData
  };

  const existingIndex = templates.findIndex((item) => item.id === templateId);
  if (existingIndex >= 0) {
    templates[existingIndex] = entry;
  } else {
    templates.unshift(entry);
  }

  persistSavedTemplates(templates);
  return entry;
}

export function deleteResumeTemplate(templateId: string): SavedResumeTemplate[] {
  const templates = loadSavedTemplates();
  const next = templates.filter((template) => template.id !== templateId);
  persistSavedTemplates(next);
  return next;
}

