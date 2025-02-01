import React from "react";
import { createHashRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./pages/HomePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ListenPage from "./pages/ListenPage.jsx";
import CreatePage from "./pages/CreatePage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import { accountService } from "./services/AccountService.js";
import AuthGuard from "./utils/AuthGuard.jsx";
import PostsPage from "./pages/PostsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

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
        path: "/listen",
        element: <ListenPage />,
      },
      {
        path: "/create",
        element: <CreatePage />,
      },
      {
        path: "/posts",
        element: <PostsPage />,
      },
      {
        path: "/profiles/:profileId",
        element: <ProfilePage />,
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
