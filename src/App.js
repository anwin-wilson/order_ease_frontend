import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import MenuPage from "./components/MenuPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/menu/:category" element={<MenuPage />} />
    </Routes>
  );
}

export default App;
