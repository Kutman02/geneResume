import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import WizardPage from "./pages/WizardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/wizard" element={<WizardPage />} />
    </Routes>
  );
}
