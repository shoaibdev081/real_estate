import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { apiRequest } from '../../lib/apiClient';
import {
  ChevronLeft,
  ChevronDown,
  Home,
  FolderOpen,
  Image,
  MessageSquare,
  Search,
  Sparkles,
  Users,
  Mail,
  Building2,
  UserCheck,
  Send,
  LayoutDashboard,
  Info,
  BookOpen,
  MapPin,
  PanelBottom,
  Activity,
  Megaphone,
} from 'lucide-react';

export default function Sidebar({ open, onOpenChange, collapsed, onCollapsedChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobileOpen = open;

  // Unread contact inquiries badge
  const [unreadContactCount, setUnreadContactCount] = useState(0);

  // Company submenu open state (automatically opens if on a company route)
  const isCompanyActive = ['/owner', '/team', '/gallery', '/about'].includes(location.pathname);
  const [companyOpen, setCompanyOpen] = useState(isCompanyActive);

  useEffect(() => {
    if (isCompanyActive) {
      setCompanyOpen(true);
    }
  }, [isCompanyActive]);

  useEffect(() => {
    // Fetch notifications to get unread contact count
    apiRequest('/notifications')
      .then((res) => {
        const unread = (res?.notifications || []).filter((n) => !n.read).length;
        setUnreadContactCount(unread);
      })
      .catch(() => {});
  }, [location.pathname]);

  // Search state
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef();

  const handleResultClick = (section, id) => {
    const ROUTE_MAP = {
      dashboard: '/dashboard',
      home: '/home',
      homepage: '/home',
      projects: '/projects',
      services: '/services',
      reviews: '/reviews',
      about: '/about',
      team: '/team',
      gallery: '/gallery',
      blogs: '/blogs',
      blog: '/blogs',
      areas: '/main-areas',
      'main areas': '/main-areas',
      mainareas: '/main-areas',
      newsletter: '/newsletter',
      owner: '/owner',
      company: '/owner',
      contact: '/contact',
      footer: '/footer',
      'footer settings': '/footer',
    };
    const normalized = section?.toLowerCase().trim();
    const route = ROUTE_MAP[normalized];
    if (!route) return;
    setShowDropdown(false);
    setSearch('');
    navigate(route, { state: { scrollTo: id } });
    onOpenChange?.(false);
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

  const logoSrc = '/images/logo.png';
  const widthClass = collapsed ? 'w-16' : 'w-56';

  return (
    <>
      <div
        className={[
          'fixed top-0 left-0 z-40 flex flex-col border-r bg-(--surface-card)/95 px-3 py-4 shadow-xl backdrop-blur-lg transition-all duration-200',
          'h-screen',
          widthClass,
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
        style={{ minHeight: '100vh', height: '100dvh' }}
      >
        {/* Logo and Mobile Header */}
        <div className="relative mb-5 flex flex-col items-center justify-center px-1">
          <Link to="/dashboard" onClick={() => onOpenChange?.(false)}>
            <img
              src={logoSrc}
              alt="Monda Brother"
              className={collapsed ? 'h-9 w-9 object-contain' : 'h-11 w-auto max-w-44 object-contain'}
            />
          </Link>

          {isMobileOpen && (
            <button
              type="button"
              onClick={() => onOpenChange?.(false)}
              className="absolute top-1 right-1 p-1.5 rounded-lg transition-colors lg:hidden bg-(--surface-card) text-(--brand-camel-dark) hover:bg-(--brand-camel)"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Mobile search bar */}
          <div className="w-full mt-3 sm:hidden">
            <div className="relative flex flex-row items-center gap-2 rounded-full border border-(--brand-camel) bg-(--surface-elevated) px-2 py-1.5 text-xs">
              <Search className="h-3.5 w-3.5 text-(--brand-camel-dark) shrink-0" />
              <input
                placeholder="Quick search..."
                className="flex-1 bg-transparent text-[11px] text-(--brand-camel-dark) outline-none placeholder:text-(--brand-camel-light)/60"
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
          </div>
        </div>

        {/* Navigation Section aligned with Website UI */}
        <nav className="flex-1 space-y-1 text-sm overflow-y-auto no-scrollbar">
          {/* Section: Website Pages */}
          {!collapsed && (
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--text-muted)">
              Website UI Navigation
            </div>
          )}

          {/* 1. Dashboard */}
          <Link
            to="/dashboard"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Dashboard' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/dashboard'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Dashboard</span>}
          </Link>

          {/* 2. Home Page Management */}
          <Link
            to="/home"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Home' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/home'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Home</span>}
          </Link>

          {/* 2. Services */}
          <Link
            to="/services"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Services' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/services'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Services</span>}
          </Link>

          {/* 3. Projects */}
          <Link
            to="/projects"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Projects' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/projects'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <FolderOpen className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Projects</span>}
          </Link>

          {/* Blogs */}
          <Link
            to="/blogs"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Blogs' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/blogs'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Blogs & Videos</span>}
          </Link>

          {/* Main Areas */}
          <Link
            to="/main-areas"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Main Areas' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/main-areas'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <MapPin className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Main Areas</span>}
          </Link>

          {/* 4. Company (Dropdown/Collapsible Group matching Website Navbar) */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                if (collapsed) {
                  onCollapsedChange?.(false);
                  setCompanyOpen(true);
                } else {
                  setCompanyOpen((prev) => !prev);
                }
              }}
              title={collapsed ? 'Company' : undefined}
              className={[
                'w-full group flex items-center justify-between rounded-lg px-3 py-2 transition-colors text-left',
                isCompanyActive
                  ? 'text-(--brand-camel-dark) font-semibold'
                  : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="font-medium">Company</span>}
              </div>
              {!collapsed && (
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    companyOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Sub-items under Company: Profile, Team, Gallery */}
            {(!collapsed && companyOpen) && (
              <div className="ml-3 pl-3 border-l border-(--border-subtle) space-y-1 py-1">
                <Link
                  to="/owner"
                  onClick={() => onOpenChange?.(false)}
                  className={[
                    'group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                    location.pathname === '/owner'
                      ? 'bg-(--brand-camel)/20 text-(--brand-camel-dark) font-semibold'
                      : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
                  ].join(' ')}
                >
                  <UserCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Company Profile</span>
                </Link>

                <Link
                  to="/about"
                  onClick={() => onOpenChange?.(false)}
                  className={[
                    'group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                    location.pathname === '/about'
                      ? 'bg-(--brand-camel)/20 text-(--brand-camel-dark) font-semibold'
                      : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
                  ].join(' ')}
                >
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>About Page</span>
                </Link>

                <Link
                  to="/team"
                  onClick={() => onOpenChange?.(false)}
                  className={[
                    'group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                    location.pathname === '/team'
                      ? 'bg-(--brand-camel)/20 text-(--brand-camel-dark) font-semibold'
                      : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
                  ].join(' ')}
                >
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>Team</span>
                </Link>

                <Link
                  to="/gallery"
                  onClick={() => onOpenChange?.(false)}
                  className={[
                    'group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                    location.pathname === '/gallery'
                      ? 'bg-(--brand-camel)/20 text-(--brand-camel-dark) font-semibold'
                      : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
                  ].join(' ')}
                >
                  <Image className="h-3.5 w-3.5 shrink-0" />
                  <span>Gallery</span>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Contact (Inquiries & Messages from Contact page) */}
          <Link
            to="/contact"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Contact' : undefined}
            className={[
              'group flex items-center justify-between rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/contact'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="font-medium">Contact</span>}
            </div>
            {!collapsed && unreadContactCount > 0 && (
              <span className="min-w-4.5 h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadContactCount}
              </span>
            )}
          </Link>

          {/* 6. Footer & Social Settings */}
          <Link
            to="/footer"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Footer & Social' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/footer'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <PanelBottom className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Footer Settings</span>}
          </Link>

          {/* Section: Additional Engagement */}
          {!collapsed && (
            <div className="pt-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--text-muted)">
              Engagement
            </div>
          )}

          {/* Client Reviews */}
          <Link
            to="/reviews"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Client Reviews' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/reviews'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Client Reviews</span>}
          </Link>

          {/* Newsletter */}
          <Link
            to="/newsletter"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Newsletter' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/newsletter'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <Send className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Newsletter</span>}
          </Link>

          {/* Section: Tracking & Marketing */}
          {!collapsed && (
            <div className="pt-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--text-muted)">
              Marketing
            </div>
          )}

          {/* Meta Pixel Tracking */}
          <Link
            to="/meta-pixel"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Meta Pixel Tracking' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/meta-pixel'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <Activity className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Meta Pixel</span>}
          </Link>

          {/* Flash News & Project Updates */}
          <Link
            to="/flash-news"
            onClick={() => onOpenChange?.(false)}
            title={collapsed ? 'Flash News & Updates' : undefined}
            className={[
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors',
              location.pathname === '/flash-news'
                ? 'bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) text-(--brand-black) font-semibold shadow-xs'
                : 'text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)',
            ].join(' ')}
          >
            <Megaphone className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="font-medium">Flash News</span>}
          </Link>
        </nav>

        {/* Collapse Button */}
        <div className="mt-4 border-t border-(--border-subtle) pt-3">
          <button
            type="button"
            onClick={() => onCollapsedChange?.(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--surface-elevated) px-2 py-1.5 text-[11px] font-medium text-(--text-muted) hover:text-(--text-primary)"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={[
                'h-3.5 w-3.5 transition-transform',
                collapsed ? 'rotate-180' : '',
              ].join(' ')}
            />
            <span className={collapsed ? 'sr-only' : ''}>Collapse</span>
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange?.(false)}
        ></div>
      )}
    </>
  );
}
