import React from "react";
import { useNavigate } from "react-router-dom";

const EmailChecked = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg text-center">
        {/* Icon */}
        <div className="text-5xl mb-4">📧</div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-white mb-2">
          Check Your Email
        </h1>

        {/* Description */}
        <p className="text-zinc-400 text-sm mb-6">
          We've sent you a verification link. Please verify your email to
          continue.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-2 rounded-full bg-neutral-200 hover:bg-neutral-300 transition-all duration-200 text-neutral-700 font-medium"
        >
          I’ve Verified My Email
        </button>

        {/* Footer */}
        <p className="text-xs text-zinc-500 mt-4">
          Didn’t receive the email? Check spam or try again.
        </p>
      </div>
    </div>
  );
};

export default EmailChecked;
