import React from "react";
import { createHashRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./pages/HomePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListenPage from "./pages/ListenPage.jsx";
import CreatePage from "./pages/CreatePage.tsx";
import AccountPage from "./pages/AccountPage.jsx";
import { accountService } from "./services/AccountService.js";
import AuthGuard from "./utils/AuthGuard.jsx";

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
      {
        path: "account",
        loader: accountService.getAccount,
        element: (
          <AuthGuard>
            <AccountPage />
          </AuthGuard>
        ),
      },
    ],
  },
]);
