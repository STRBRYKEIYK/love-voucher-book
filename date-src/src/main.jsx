import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/fraunces/latin-700.css";
import "@fontsource/fraunces/latin-700-italic.css";
import "@fontsource/fraunces/latin-900-italic.css";
import "@fontsource/outfit/latin-400.css";
import "@fontsource/outfit/latin-500.css";
import "@fontsource/outfit/latin-600.css";
import "@fontsource/outfit/latin-700.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
