import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { handleRegister } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();

    const success = await handleRegister({ username, email, password })

    const verifiedEmail = success.data.verified;

    if (verifiedEmail === false) {
      navigate("/auth/user/email-checked")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-800">
      <form
        onSubmit={submitHandler}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl text-center text-neutral-200 leading-tight mb-6 font-bold">
          Create your account
        </h2>

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-full bg-neutral-800 border border-neutral-500 text-neutral-200 focus:outline-none"
        />

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
          className="w-full p-3 mb-4 rounded-full bg-neutral-800 border border-neutral-500 text-neutral-200 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-neutral-200 hover:bg-neutral-300 active:scale-95 font-semibold transition cursor-pointer"
        >
          Sign Up
        </button>

        <p className="text-center text-neutral-200 mt-4">
          Already have an account?{" "}
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

export default Register;
