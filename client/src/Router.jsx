import React from "react";
import { createHashRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./pages/HomePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListenPage from "./pages/ListenPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";

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
      {
        path: "/listen/:artistIds/:deviceId",
        element: <ListenPage />,
      },
      {
        path: "/create",
        element: <CreatePage />,
      },
    ],
  },
]);
