import React from 'react'
import { useUI } from '../../context/UIContext'
import { IoClose } from 'react-icons/io5'
import { AiOutlineCheckCircle, AiOutlineInfoCircle, AiOutlineWarning, AiOutlineCloseCircle } from 'react-icons/ai'

export default function ToastStack() {
  const { toasts, removeToast } = useUI()

  const icons = {
    success: <AiOutlineCheckCircle className="w-5 h-5 text-green-500" />,
    info: <AiOutlineInfoCircle className="w-5 h-5 text-blue-500" />,
    warning: <AiOutlineWarning className="w-5 h-5 text-yellow-500" />,
    error: <AiOutlineCloseCircle className="w-5 h-5 text-red-500" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgColors[toast.type]} border rounded-lg p-4 shadow-lg flex items-center gap-3 pointer-events-auto max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300`}
        >
          {icons[toast.type]}
          <p className="text-sm font-medium text-gray-800">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto p-1 hover:bg-white rounded transition"
          >
            <IoClose className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
