import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import {router} from "./app.routes"
import { useAuth } from '../features/auth/hook/useAuth'
import { useSelector } from 'react-redux'

const App = () => {

  const { handleGetMe } = useAuth();
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    handleGetMe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#ecd9b9] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <RouterProvider router={router}/>
  )
}

export default App