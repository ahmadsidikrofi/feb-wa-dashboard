'use client'

import { useRouter } from "next/navigation"
import { createContext, useEffect, useState } from "react"

const AuthContext = createContext({
    user: null,
    token: null,
    login: (token, adminData) => { },
    logout: () => { },
    isLoading: true,
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const storedToken = sessionStorage.getItem('auth_token')
        const storedUser = sessionStorage.getItem('auth_user')

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = (token, adminData) => {
        sessionStorage.setItem('auth_token', token)
        sessionStorage.setItem('auth_user', JSON.stringify(adminData))
        setToken(token)
        setUser(adminData)
        router.push('/dashboard')
    }

    const logout = () => {
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_user')
        setToken(null)
        setUser(null)
        toast.success('Jangan lupa kembali lagi ya!')
        router.push('/')
    }

    const value = {
        user,
        token,
        isLoading,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export default AuthContext