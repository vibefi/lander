import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import "./index.css";
import { Landing } from "./pages/Landing";
import { Download } from "./pages/Download";
import { Placeholder } from "./pages/Placeholder";
import { useEffect } from "react";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, "");
      requestAnimationFrame(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView();
          return;
        }
        window.scrollTo(0, 0);
      });
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function RootLayout() {
  return (
    <>
      <ScrollManager />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "download", element: <Download /> },
      { path: "changelog", element: <Placeholder title="Changelog" /> },
      { path: "status", element: <Placeholder title="Status" /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
