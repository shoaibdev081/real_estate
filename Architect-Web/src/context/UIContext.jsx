import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'

const UIContext = createContext(null)

let toastIdCounter = 0

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((toast) => {
    const id = ++toastIdCounter
    const payload = {
      id,
      type: toast.type || 'info',
      message: toast.message || '',
      icon: toast.icon,
      image: toast.image,
    }
    setToasts((prev) => [...prev, payload])
    setTimeout(() => removeToast(id), toast.duration || 2800)
    return id
  }, [removeToast])

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
    }),
    [toasts, showToast, removeToast],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
