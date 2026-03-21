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
    <div className="min-h-screen flex items-center justify-center bg-neutral-800">
      <form
        onSubmit={submitHandler}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl text-center text-neutral-200 leading-tight mb-6 font-bold">
          Welcome to sign in page
        </h2> 

        {/* <label id="email" htmlFor="">Email</label> */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-full bg-neutral-800 border border-neutral-500 text-neutral-200 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-2 rounded-full bg-neutral-800 border border-neutral-500 text-neutral-200 focus:outline-none"
        />

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <Link
            to="/auth/user/forget-password"
            className="text-neutral-200 hover:text-neutral-400 text-sm transition"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-neutral-200 hover:bg-neutral-300 active:scale-95 font-semibold transition  cursor-pointer"
        >
          Sign In
        </button>

        <p className="text-center text-neutral-200 mt-4">
          Don't have an account?{" "}
          <Link
            to="/auth/user/register"
            className="text-neutral-500 hover:text-neutral-600 transition"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
