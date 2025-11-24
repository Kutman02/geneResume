// context/ResumeContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// ------------------------
// Types (СИНХРОНИЗИРОВАНО)
// ------------------------

export interface Experience {
  id: string;
  jobTitle: string;        // было ReactNode — исправлено на string
  company: string;
  period: string;          // объединяем startDate и endDate в одну строку (как в StepReview)
  description: string;
}

export interface Project {
  id: string;
  title: string;            // было name
  role: string;             // добавлено
  description: string;
  link: string;
  techs: string[];          // было technologies
}

export type ResumeRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "Fullstack Developer"
  | null;

export interface ResumeState {
  templateId: string | null;
  role: ResumeRole;
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  projects: Project[];
  experiences: Experience[];
  photoDataUrl: string | null;
}

type ResumeAction =
  | { type: "SET_ROLE"; payload: ResumeRole }
  | { type: "SET_RESUME"; payload: ResumeState }
  | { type: "UPDATE_FIELD"; field: keyof ResumeState; value: unknown }
  | { type: "RESET" };

interface ResumeContextType {
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
}

// ------------------------
// Context
// ------------------------

const ResumeContext = createContext<ResumeContextType | null>(null);

// ------------------------
// Initial State
// ------------------------

const initialState: ResumeState = {
  templateId: null,
  role: null,
  fullName: "",
  email: "",
  phone: "",
  summary: "",
  skills: [],
  projects: [],
  experiences: [],
  photoDataUrl: null,
};

// ------------------------
// Reducer
// ------------------------

function reducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_RESUME":
      return { ...action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ------------------------
// Provider
// ------------------------

interface ResumeProviderProps {
  children: ReactNode;
}

export function ResumeProvider({ children }: ResumeProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
}

// ------------------------
// Hook
// ------------------------

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
