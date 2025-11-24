import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import WizardPage from "./pages/WizardPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />
      <main className="pt-24 flex-1 w-full px-4 pb-10 sm:px-6 lg:px-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wizard" element={<WizardPage />} />
        </Routes>
      </main>
    </div>
  );
}
