import React from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import type { ResumeRole } from "../context/ResumeContext";

const roles = [
  { key: "frontend", label: "Frontend Developer" },
  { key: "backend", label: "Backend Developer" },
  { key: "fullstack", label: "Fullstack Developer" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { dispatch } = useResume();

  function handleSelect(role: string) {
    const roleMap: Record<string, ResumeRole> = {
      frontend: "Frontend Developer",
      backend: "Backend Developer",
      fullstack: "Fullstack Developer"
    };
    
    dispatch({ type: "SET_ROLE", payload: roleMap[role] });
    navigate("/wizard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Выберите направление резюме
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl px-4">
        {roles.map((r) => (
          <button
            key={r.key}
            className="p-6 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-300 text-xl font-semibold transition"
            onClick={() => handleSelect(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
