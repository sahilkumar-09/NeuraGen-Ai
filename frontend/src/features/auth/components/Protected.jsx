import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const Protected = ({children}) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

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

    if (!user) {
        return <Navigate to="/auth/user/login"/>
    }
  return (
    children
  )
}

export default Protected
