import React, { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { FiChevronDown } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { apiRequest, getImageUrl } from '../../lib/apiClient'

const Sidebar = ({ isOpen, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])

  // Fetch gallery data from backend
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await apiRequest('/gallery');
        // Map backend gallery data to get all images and take first 6
        const allImages = (response.data || []).flatMap((item) => {
          const images = [item.mainImage, ...(item.otherImages || [])].filter(Boolean);
          return images.map((image, imgIndex) => ({
            id: `${item._id}-${imgIndex}`,
            src: image,
          }));
        });
        // Take only first 6 images
        setGalleryImages(allImages.slice(0, 6).map(img => img.src));
      } catch (error) {
        console.error('Failed to fetch gallery data:', error);
        // Fallback to static images if backend fails
        setGalleryImages([
          '/images/gallery-1.jpg',
          '/images/gallery-3.jpg',
          '/images/gallery-4.jpg',
          '/images/gallery-6.jpg',
          '/images/gallery-7.jpg',
          '/images/gallery-9.jpg',
        ]);
      }
    };

    fetchGalleryData();
  }, []);

  const pagesMenu = [
    { label: 'Main Areas', href: '/main-areas' },
    { label: 'Flash News & Updates', href: '/flash-news' },
    { label: 'About', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blogs & Videos', href: '/blogs' },
    // { label: 'Shop', href: '/shop' },
    // { label: 'Cart', href: '/cart' },
    // { label: 'Wishlist', href: '/wishlist' },
    // { label: 'Pricing', href: '/pricing' },
    { label: 'Team', href: '/team' },
  ]

  const toggleDropdown = (key) => setOpenDropdown((o) => (o === key ? null : key))

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#3b2b1f]/80 backdrop-blur-md border-l border-white/10 shadow-lg z-50 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 hover:bg-gray-800 rounded-full transition pointer-events-auto"
            aria-label="Close sidebar"
          >
            <IoClose className="w-6 h-6 text-white" />
          </button>

          {/* Mobile Menu - mirror desktop dropdowns for small screens */}
            <div className="lg:hidden mt-8">
            <nav className="mt-2 flex flex-col gap-2">
              <Link to="/" onClick={onClose} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5">Home</Link>

              <Link to="/services" onClick={onClose} className="block mt-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5">Services</Link>

              <Link to="/projects" onClick={onClose} className="block mt-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5">Projects</Link>
              <Link to="/main-areas" onClick={onClose} className="block mt-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5">Main Areas</Link>
              <Link to="/blogs" onClick={onClose} className="block mt-2 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5">Blogs</Link>
              <Link to="/flash-news" onClick={onClose} className="block mt-2 px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-white/5 flex items-center justify-between">
                <span>Flash News & Updates</span>
                <span className="text-[10px] bg-amber-500 text-black font-extrabold px-1.5 py-0.5 rounded">NEW</span>
              </Link>

              {/* Company Dropdown */}
              <div className="mt-2">
                <button
                  onClick={() => toggleDropdown('pages')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5 transition"
                >
                  <span>Company</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'pages' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'pages' && (
                  <div className="flex flex-col mt-1 ml-2 border-l border-white/20 pl-3">
                    {pagesMenu.map((p, i) => (
                      <Link key={i} to={p.href} onClick={onClose} className="block px-3 py-2 text-sm text-white hover:bg-white/5 rounded-md">{p.label}</Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/contact" onClick={onClose} className="block mt-3 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5">Contact</Link>

            </nav>

            {/* Contact Info on Mobile */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-300">DHA Multan</p>
              <p className="text-sm text-amber-400 font-semibold mt-3">+92 301 6624449</p>
              <p className="text-sm text-gray-300 mt-2">monda_brothers@outlook.com</p>
              <p className="text-sm text-gray-300 mt-2">Office hours: 24/7</p>
            </div>
          </div>

          {/* Desktop Content - Show only on lg and above */}
            <div className="hidden lg:flex lg:flex-col h-full">
            {/* Logo and Company Name */}
            <div className="flex flex-col gap-3">

              <h2 className="text-2xl font-bold text-white">Monda brothers</h2>
            </div>

            {/* Tagline */}
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              We Shape Interior Designs, Crafting Timeless And Inspiring Spaces
            </p>

            {/* Gallery Grid */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="h-20 rounded-lg overflow-hidden">
                  <img src={getImageUrl(img)} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-auto pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-300">DHA Multan</p>
              <p className="text-sm text-amber-600 font-semibold mt-3">+92 301 6624449</p>
              <p className="text-sm text-gray-300 mt-2">monda_brothers@outlook.com</p>
              <p className="text-sm text-gray-300 mt-2">Office hours: 24/7</p>

              {/* Social Icons */}
              <div className="flex gap-3 mt-4">
                <a href="https://www.facebook.com/monda.brother/" className="text-gray-400 hover:bg-camel rounded-full p-2 w-9 h-9 flex items-center justify-center transition hover:text-white">
                  <FaFacebook size={18} />
                </a>
                <a href="https://www.instagram.com/monda_brothers/" className="text-gray-400 hover:bg-camel rounded-full p-2 w-9 h-9 flex items-center justify-center transition hover:text-white">
                  <FaInstagram size={18} />
                </a>
                <a href="https://www.linkedin.com/company/monda-brothers/" className="text-gray-400 hover:bg-camel rounded-full p-2 w-9 h-9 flex items-center justify-center transition hover:text-white">
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
