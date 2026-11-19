import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-(--brand-camel) text-xs font-semibold text-(--brand-black) shadow-md hover:bg-(--brand-camel-dark)"
        onClick={() => setOpen((prev) => !prev)}
        title="Admin menu"
      >
        AD
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-(--brand-camel-dark) bg-(--surface-card) shadow-xl">
          <div className="border-b border-(--brand-camel-dark) px-3 py-2">
            <div className="text-xs font-semibold text-(--text-primary)">Admin</div>
          </div>
          {/* Removed Account settings button as requested */}
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-xs text-red-500 hover:bg-red-500/10 hover:text-red-400"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

