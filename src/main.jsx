
import React from "react";
import ReactDOM from "react-dom/client";


import App from "./App.jsx";
import "./index.css";

// ==========================================
// ROOT ELEMENT
// ==========================================

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Unable to start BiteRush: <div id="root"></div> is missing in index.html.'
  );
}

// ==========================================
// RENDER APP
// ==========================================

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
