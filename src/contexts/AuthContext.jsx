import { createContext, useContext, useState, useEffect } from 'react'

const AUTH_KEY = 'melo_auth_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(AUTH_KEY))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const setToken = (t) => {
    if (t) {
      localStorage.setItem(AUTH_KEY, t)
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
    setTokenState(t)
  }

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_KEY)
}
