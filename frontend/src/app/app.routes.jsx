import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/auth/user/login",
    element: <Login />,
  },
  {
    path: "/auth/user/register",
    element: <Register />,
  },
  {
    path: "/chat-dashboard",
    element: <Navigate to="/" replace />
  }
]);
