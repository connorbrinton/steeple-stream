import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../../public/assets/app.css";
import { App } from "../landing/App.tsx";

const root = document.querySelector("#root");
if (!root) throw new Error("Landing page root element was not found");

const router = createBrowserRouter([{ path: "/", element: <App /> }]);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
