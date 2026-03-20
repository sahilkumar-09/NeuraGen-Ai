import {useDispatch} from "react-redux"
import { register, login, logout, getMe, forgetPassword, resetPassword } from "../services/auth.api"
import {setUser, setLoading, setError} from "../auth.slice"

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true))
            await register({ username, email, password })
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            await login({ email, password })
            return true
        } catch (error) {
            dispatch(setError(error?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const userData = await getMe()
            dispatch(setUser(userData))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true))
            await logout()
            dispatch(setUser(null))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Logout failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleForgetPassword({ email }) {
        try {
            dispatch(setLoading(true))
            await forgetPassword({ email })
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to send reset password link"))
        } finally {
            dispatch(setLoading(false))
        }
    }
 
    async function handleResetPassword({ token, password }) {
        try {
            dispatch(setLoading(true))
            await resetPassword({ token, password })
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to reset password"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
        handleForgetPassword,
        handleResetPassword,
    }
}