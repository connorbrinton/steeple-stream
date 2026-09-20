import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../../public/assets/app.css";
import { AdminApp, Overview, People, Schedules, Units } from "../manage/AdminApp.tsx";

const root = document.querySelector("#root");
if (!root) throw new Error("Admin app root element was not found");

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminApp />,
    children: [
      { index: true, element: <Overview /> },
      { path: "units", element: <Units /> },
      { path: "schedules", element: <Schedules /> },
      { path: "people", element: <People /> },
    ],
  },
]);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
