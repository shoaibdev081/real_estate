import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Menu, Moon, Search, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ProfileMenu from '../common/ProfileMenu';
import NotificationSidebar from '../common/NotificationSidebar';
import { apiRequest } from '../../lib/apiClient';

const ROUTE_MAP = {
  projects: '/projects',
  services: '/services',
  reviews: '/reviews',
  team: '/team',
  gallery: '/gallery',
  owner: '/owner',
};

const TITLES = {
  '/dashboard': 'Overview',
  '/projects': 'Projects',
  '/services': 'Services',
  '/reviews': 'Client Reviews',
  '/team': 'Team',
  '/gallery': 'Gallery',
  '/owner': 'Company Profile',
  '/blogs': 'Blogs Management',
  '/main-areas': 'Main Areas',
  '/home': 'Home Page Manager',
  '/about': 'About Page Manager',
  '/footer': 'Footer Settings',
  '/contact': 'Inquiries & Contact',
  '/newsletter': 'Newsletter Subscribers',
  '/meta-pixel': 'Meta Pixel & Tracking',
  '/flash-news': 'Flash News & Updates',
};

export default function Topbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const title = TITLES[location.pathname] || 'Overview';

  // Dynamic color for icons and title based on theme
  const iconColor = theme === 'dark' ? 'text-[var(--brand-camel-light)]' : 'text-[var(--brand-camel-dark)]';
  const titleColor = theme === 'dark' ? 'text-[var(--brand-camel-light)]' : 'text-[var(--brand-camel-dark)]';
  const searchBg = theme === 'dark' ? 'bg-[var(--brand-black)] border-[var(--brand-camel-dark)]' : 'bg-[var(--surface-elevated)] border-[var(--brand-camel)]';
  const themeBtnBg = theme === 'dark' ? 'bg-[var(--brand-black)] border-[var(--brand-camel-dark)]' : 'bg-[var(--surface-elevated)] border-[var(--brand-camel)]';

  // Search state
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef();

  const handleResultClick = (section, id) => {
    const normalized = section?.toLowerCase().trim();
    const route = ROUTE_MAP[normalized];
    if (!route) return;
    setShowDropdown(false);
    setSearch('');
    navigate(route, { state: { scrollTo: id } });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setShowDropdown(!!val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!val) {
      setSearchResults(null);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await apiRequest(`/search?q=${encodeURIComponent(val)}`);
        setSearchResults(res?.results || null);
      } catch {
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-(--brand-camel-dark) bg-(--surface-card)/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* Mobile: hamburger, logo, title center, right icons */}
        <div className="flex flex-1 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-(--brand-camel-dark) bg-(--brand-camel) text-(--brand-black) hover:bg-(--brand-camel-dark)"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <img src="/images/Monda%20Brothers%20Logo%20Fiall.png" alt="Logo" className="h-8 w-auto mx-2" />
          <div className="flex-1 flex justify-center">
            {/* Hide title on <sm screens */}
            <h1 className={`truncate text-base font-semibold ${titleColor} sm:text-lg hidden sm:block`}>{title}</h1>
          </div>
        </div>

        {/* Desktop: title left, right icons */}
        <div className="hidden lg:flex min-w-0 flex-1 items-center gap-2">
          <h1 className={`truncate text-base font-semibold ${titleColor} sm:text-lg`}>{title}</h1>
        </div>

        {/* Search */}
        <div className={`relative hidden min-w-50 items-center gap-2 rounded-full border px-2 py-1.5 text-xs sm:flex ${searchBg}`}>
          <Search className={`h-3.5 w-3.5 ${iconColor}`} />
          <input
            placeholder="Quick search (title, client, role...)"
            className={`w-full bg-transparent text-[11px] ${titleColor} outline-none placeholder:text-(--brand-camel-light)/60`}
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(!!search)}
            onBlur={handleBlur}
            autoComplete="off"
          />
          {showDropdown && (
            <div className="absolute left-0 top-full mt-1 w-full rounded-xl border border-(--brand-camel) bg-(--surface-card) shadow-lg z-50 max-h-80 overflow-auto">
              {searchLoading ? (
                <div className="p-3 text-xs text-(--text-muted)">Searching…</div>
              ) : searchResults ? (
                <>
                  {Object.entries(searchResults).every(([k, v]) => v.count === 0) ? (
                    <div className="p-3 text-xs text-(--text-muted)">No results found.</div>
                  ) : (
                    Object.entries(searchResults).map(([section, { count, data }]) =>
                      count > 0 && (
                        <div key={section}>
                          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase text-(--brand-camel-dark)">{section}</div>
                          {data.map((item, idx) => (
                            <div
                              key={item._id || idx}
                              onMouseDown={() => handleResultClick(section, item._id)}
                              className="px-3 py-2 text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors truncate"
                            >
                              {item.title || item.name || item.role || item.feedback || item.category || item.description || 'Untitled'}
                            </div>
                          ))}
                        </div>
                      )
                    )
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-2">
          <NotificationSidebar />
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${themeBtnBg} ${iconColor} hover:bg-(--brand-camel-dark) hover:text-white transition-colors`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Profile Avatar Menu */}
        <ProfileMenu />

        {/* Direct Logout Button */}
        <button
          type="button"
          onClick={logout}
          title="Log out of Admin Panel"
          className="inline-flex h-9 items-center gap-1.5 px-3 rounded-lg border border-red-500/40 bg-red-500/10 text-xs font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
