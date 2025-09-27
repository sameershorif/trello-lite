import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Boards from "./pages/Boards";
import Login from "./pages/Login";
import "./index.css"; // keep if it exists; otherwise remove this line

const router = createBrowserRouter([
  { path: "/", element: <div style={{padding:16}}>Home • <a href="/login">Login</a></div> },
  { path: "/login", element: <Login /> },
  { path: "/boards", element: <Boards /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
