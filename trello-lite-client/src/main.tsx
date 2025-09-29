import React from "react";
import ReactDOM from "react-dom/client";
import RequireAuth from "./components/RequireAuth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Boards from "./pages/Boards";
import Login from "./pages/Login";
import BoardView from "./pages/BoardView";
import "./index.css"; // keep if it exists; otherwise remove this line

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <RequireAuth><Boards /></RequireAuth> },
  { path: "/boards", element: <RequireAuth><Boards /></RequireAuth> },
  { path: "/boards/:id", element: <RequireAuth><BoardView /></RequireAuth> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
