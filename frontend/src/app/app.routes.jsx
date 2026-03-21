import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import ForgetPassword from "../features/auth/pages/ForgetPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import EmailChecked from "../features/auth/pages/EmailChecked";

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
    path: "/auth/user/email-checked",
    element: <EmailChecked/>
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
    path: "/auth/user/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/auth/user/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/chat-dashboard",
    element: <Navigate to="/" replace />,
  },
]);
