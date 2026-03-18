import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()
  const { handleRegister } = useAuth();

  const submitHandler = async(e) => {
    e.preventDefault();
    
    await handleRegister({ username, email, password })
    console.log({ username, email, password });
    navigate("/")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1d1d]">
      <form
        onSubmit={submitHandler}
        className="bg-[#ebf3ff15] p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl text-center text-[#ecd9b9] mb-6 font-bold">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-transparent border border-gray-500 text-[#FAF7F3] focus:outline-none"
        />

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
          className="w-full p-3 mb-6 rounded-lg bg-transparent border border-gray-500 text-[#FAF7F3] focus:outline-none"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#948979] text-[#FAF7F3] font-semibold transition hover:bg-white hover:text-[#b69a6c] cursor-pointer"
        >
          Sign Up
        </button>

        <p className="text-center text-[#FAF7F3] mt-4">
          Already have an account?{" "}
          <Link
            to="/auth/user/login"
            className="text-[#cfb386] hover:text-[#b69a6c] transition"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
