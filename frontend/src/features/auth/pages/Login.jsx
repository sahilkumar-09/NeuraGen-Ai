import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const navigate = useNavigate();
  const { handleLogin, handleGetMe } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log({ email, password });

    const success = await handleLogin({ email, password });

    if (success) {
      await handleGetMe();
      navigate("/");
    }
  };
  if (!loading && user) {
    return <Navigate to="/" replace/>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1d1d]">
      <form
        onSubmit={submitHandler}
        className="bg-[#ebf3ff15] p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl text-center text-[#ecd9b9] mb-6 font-bold">
          Welcome to sign in page
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-transparent border border-gray-500 text-[#FAF7F3] focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-2 rounded-lg bg-transparent border border-gray-500 text-[#FAF7F3] focus:outline-none"
        />

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <Link
            to="/auth/user/forgot-password"
            className="text-[#cfb386] text-sm hover:text-white transition"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#948979] text-[#FAF7F3] font-semibold transition hover:bg-white hover:text-[#b69a6c] cursor-pointer"
        >
          Sign In
        </button>

        <p className="text-center text-[#FAF7F3] mt-4">
          Don't have an account?{" "}
          <Link
            to="/auth/user/register"
            className="text-[#cfb386] hover:text-[#b69a6c] transition"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
