import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Landing } from "./pages/Landing";
import { Download } from "./pages/Download";
import { Placeholder } from "./pages/Placeholder";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/download", element: <Download /> },
  { path: "/changelog", element: <Placeholder title="Changelog" /> },
  { path: "/status", element: <Placeholder title="Status" /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
