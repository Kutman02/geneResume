import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import WizardPage from "./pages/WizardPage";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wizard" element={<WizardPage />} />
        </Routes>
      </main>
    </div>
  );
}
