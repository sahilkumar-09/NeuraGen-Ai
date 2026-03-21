import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const { handleForgetPassword } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();

    const success = await handleForgetPassword({ email });

    if (success) {
      alert("Reset link sent to your email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-800">
      <form
        onSubmit={submitHandler}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl text-center text-neutral-200 mb-6 font-bold">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-full bg-neutral-800 border border-neutral-500 text-neutral-200 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-neutral-200 hover:bg-neutral-300 active:scale-95 font-semibold transition cursor-pointer"
        >
          Send Reset Link
        </button>

        <p className="text-center text-neutral-200 mt-4">
          Remember your password?{" "}
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

export default ForgetPassword;
