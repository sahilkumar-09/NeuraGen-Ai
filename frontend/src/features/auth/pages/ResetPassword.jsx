import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { handleResetPassword } = useAuth();

  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const success = await handleResetPassword({ token, password });

    if (success) {
      navigate("/auth/user/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-800">
      <form
        onSubmit={submitHandler}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl text-center text-neutral-200 mb-6 font-bold">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-full bg-neutral-800 border border-neutral-500 text-neutral-200 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-neutral-200 hover:bg-neutral-300 active:scale-95 font-semibold transition cursor-pointer"
        >
          Reset Password
        </button>

        <p className="text-center text-neutral-200 mt-4">
          Back to{" "}
          <Link
            to="/auth/user/login"
            className="text-neutral-500 hover:text-neutral-600 transition"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
