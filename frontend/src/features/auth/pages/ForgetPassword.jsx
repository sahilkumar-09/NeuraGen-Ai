import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth';

const ForgetPassword = () => {
    const [email, setEmail] = useState("")
    const { handleForgetPassword } = useAuth();

    const submitHandler = async (e) => {
        e.preventDefault()
        await handleForgetPassword({email})
        alert("Reset lint sent to email")
    }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#1c1d1d]">
      <form
        onSubmit={submitHandler}
        className="bg-[#ebf3ff15] p-8 rounded-xl w-[400px]"
      >
        <h2 className="text-white text-xl mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 mb-4 rounded-lg bg-transparent border border-gray-500 text-[#FAF7F3] focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#948979] text-[#FAF7F3] font-semibold transition hover:bg-white hover:text-[#b69a6c] cursor-pointer"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );

}

export default ForgetPassword
