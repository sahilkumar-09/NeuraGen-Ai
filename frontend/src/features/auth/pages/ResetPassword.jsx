import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';

const ResetPassword = () => {

    const {token} = useParams()
    const navigate = useNavigate()

    const { handleResetPassword } = useAuth();

    const [password, setPassword] = useState("")

    const submitHandler = async (e) => {
        e.preventDefault()

        await handleResetPassword({ token, password })
        
        navigate("/auth/user/login")
    }

return (
  <div className="min-h-screen flex justify-center items-center bg-[#1c1d1d]">
    <form
      onSubmit={submitHandler}
      className="bg-[#ebf3ff15] p-8 rounded-xl w-[400px]"
    >
      <h2 className="text-white text-xl mb-4">Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        className="w-full p-3 mb-4 bg-transparent border text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full bg-[#948979] py-2 rounded">
        Reset Password
      </button>
    </form>
  </div>
);
}

export default ResetPassword
