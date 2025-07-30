import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/Game";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;