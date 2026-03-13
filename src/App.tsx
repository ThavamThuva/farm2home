import { HashRouter } from "react-router-dom";
import { Router } from "./app/router"; // your routes as JSX elements

export default function App() {
  return (
    <HashRouter>
      <Router /> {/* Render your route components */}
    </HashRouter>
  );
}
