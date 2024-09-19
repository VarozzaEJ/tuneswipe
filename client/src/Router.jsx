import React from "react";
import { createHashRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./pages/HomePage.jsx";
import HomePage from "./pages/HomePage.jsx";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },
]);
