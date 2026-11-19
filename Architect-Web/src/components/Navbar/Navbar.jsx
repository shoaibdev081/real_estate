import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { PiCirclesFour } from "react-icons/pi";
import { FiPhoneCall } from "react-icons/fi";
import Sidebar from "./Sidebar";

const Navbar = ({ isHome = false }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const pagesMenu = [
    { label: "Main Areas", href: "/main-areas" },
    { label: "Flash News & Updates", href: "/flash-news" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blogs & Videos", href: "/blogs" },
    // { label: 'Shop', href: '/shop' },
    // { label: 'Cart', href: '/cart' },
    // { label: 'Wishlist', href: '/wishlist' },
    // { label: 'Pricing', href: '/pricing' },
    { label: "Team", href: "/team" },
  ];

  const toggleDropdown = (key) =>
    setOpenDropdown((o) => (o === key ? null : key));

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <nav className="w-full m-0 p-0 fixed top-0 z-40 transition-all bg-white text-gray-900 shadow-md">
        <div className="w-full m-0 p-0 bg-white">
          <div className="px-4 sm:px-6 lg:px-8 m-0">
            <div className="flex justify-between h-16 items-center">
              {/* Left Side - Logo and Menu */}
              <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center">
                  <img
                    src="/assets/images1/Monda/logo_monda.png"
                    alt="Monda brothers"
                    className="h-12 w-auto"
                  />
                </Link>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/"
                    className={`px-3 py-2 text-sm font-medium transition relative group inline-block text-gray-900`}
                  >
                    <span className="relative">
                      Home
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px transition-all origin-left ${location.pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        style={{ backgroundColor: "var(--brand-camel)" }}
                      ></span>
                    </span>
                  </Link>

                  <Link
                    to="/services"
                    className={`px-3 py-2 text-sm font-medium transition relative group inline-block text-gray-900`}
                  >
                    <span className="relative">
                      Services
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px transition-all origin-left ${location.pathname === "/services" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        style={{ backgroundColor: "var(--brand-camel)" }}
                      ></span>
                    </span>
                  </Link>

                  <Link
                    to="/projects"
                    className={`px-3 py-2 text-sm font-medium transition relative group inline-block text-gray-900`}
                  >
                    <span className="relative">
                      Projects
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px transition-all origin-left ${location.pathname === "/projects" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        style={{ backgroundColor: "var(--brand-camel)" }}
                      ></span>
                    </span>
                  </Link>

                  <Link
                    to="/main-areas"
                    className={`px-3 py-2 text-sm font-medium transition relative group inline-block text-gray-900`}
                  >
                    <span className="relative">
                      Main Areas
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px transition-all origin-left ${location.pathname.startsWith("/main-areas") || location.pathname.startsWith("/areas") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        style={{ backgroundColor: "var(--brand-camel)" }}
                      ></span>
                    </span>
                  </Link>

                  <Link
                    to="/blogs"
                    className={`px-3 py-2 text-sm font-medium transition relative group inline-block text-gray-900`}
                  >
                    <span className="relative">
                      Blogs
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px transition-all origin-left ${location.pathname.startsWith("/blogs") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        style={{ backgroundColor: "var(--brand-camel)" }}
                      ></span>
                    </span>
                  </Link>

                  <Link
                    to="/flash-news"
                    className={`px-3 py-2 text-sm font-medium transition relative group inline-flex items-center gap-1.5 text-gray-900`}
                  >
                    <span className="relative flex items-center gap-1">
                      Flash News
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px transition-all origin-left ${location.pathname.startsWith("/flash-news") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        style={{ backgroundColor: "var(--brand-camel)" }}
                      ></span>
                    </span>
                  </Link>

                  {/* Pages Dropdown */}
                  <div className="relative group">
                    <button
                      className={`items-center gap-1 px-3 py-2 text-sm font-medium transition relative inline-flex text-gray-900`}
                    >
                      <span className="relative inline-block">
                        Company
                        <span
                          className="absolute bottom-0 left-0 right-0 h-px transition-all origin-left scale-x-0 group-hover:scale-x-100"
                          style={{ backgroundColor: "var(--brand-camel)" }}
                        ></span>
                      </span>
                      <FiChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 ml-1" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg invisible group-hover:visible group-hover:opacity-100 opacity-0 transition-all pointer-events-none z-50">
                      <div className="py-1 pointer-events-auto">
                        {pagesMenu.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <span className="relative inline-block hover:text-camel group/item">
                              {item.label}
                              <span
                                className="absolute bottom-0 left-0 right-0 h-px transition-all origin-left scale-x-0 group-hover/item:scale-x-100"
                                style={{
                                  backgroundColor: "var(--brand-camel)",
                                }}
                              ></span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    className={`px-3 py-2 text-sm font-medium transition relative group inline-block text-gray-900`}
                  >
                    <span className="relative">
                      Contact
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px transition-all origin-left ${location.pathname === "/contact" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                        style={{ backgroundColor: "var(--brand-camel)" }}
                      ></span>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right Side - Phone, Quote Button, Icons */}
              <div className="hidden lg:flex items-center gap-6">
                {/* Phone */}
                <div
                  className={`flex items-center gap-2 text-sm font-medium text-gray-900`}
                >
                  <FiPhoneCall
                    size={20}
                    style={{ color: "var(--brand-camel)" }}
                  />
                  <div className="flex flex-col">
                    <span>Call Us:</span>
                    <span> +92 301 6624449</span>
                  </div>
                </div>

                {/* Search Icon */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 rounded-full transition text-gray-900 hover:bg-gray-100`}
                >
                  {searchOpen ? (
                    <FiX
                      className="w-5 h-5"
                      style={{ color: "var(--brand-camel)" }}
                    />
                  ) : (
                    <FiSearch
                      className="w-5 h-5"
                      style={{ color: "var(--brand-camel)" }}
                    />
                  )}
                </button>

                {/* Sidebar Toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 rounded-full transition text-gray-900 hover:bg-gray-100`}
                >
                  <PiCirclesFour className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Right Side */}
              <div className="flex lg:hidden items-center gap-3">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 rounded-full transition hover:bg-gray-100`}
                >
                  {searchOpen ? (
                    <FiX
                      className="w-5 h-5"
                      style={{ color: "var(--brand-camel)" }}
                    />
                  ) : (
                    <FiSearch
                      className="w-5 h-5"
                      style={{ color: "var(--brand-camel)" }}
                    />
                  )}
                </button>

                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 rounded-full transition hover:bg-gray-100`}
                >
                  <PiCirclesFour
                    className="w-5 h-5"
                    style={{ color: "var(--brand-camel)" }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu now handled by Sidebar - no inline full-screen mobile menu */}
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className={`border-t bg-gray-50 border-gray-200`}>
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-3">
                <FiSearch className={`w-5 h-5 text-gray-900`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400`}
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className={`p-2 rounded-full transition text-gray-900 hover:bg-gray-100`}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
