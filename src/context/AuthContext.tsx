'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  username: string;
  platform: 'java' | 'bedrock';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, platform: 'java' | 'bedrock') => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoginModalOpen, setLoginModalOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('veltrix_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const login = (username: string, platform: 'java' | 'bedrock') => {
    const newUser = { username, platform }
    setUser(newUser)
    localStorage.setItem('veltrix_user', JSON.stringify(newUser))
    setLoginModalOpen(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('veltrix_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoginModalOpen, setLoginModalOpen }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
