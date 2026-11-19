import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaYoutube, 
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa'
import { apiRequest } from '../../lib/apiClient'
import { trackEvent } from '../../lib/metaPixel'

const DEFAULT_FOOTER = {
  companyName: 'Monda brothers',
  tagline: 'We Transform Your Vision Into Beautifully Crafted Spaces.',
  address: 'DHA Multan, Punjab, Pakistan',
  phone: '+923016624449',
  phoneDisplay: '+92 301 6624449',
  whatsapp: '+923150111999',
  whatsappDisplay: '+92 315 0111999',
  email: 'monda_brothers@outlook.com',
  facebookUrl: 'https://www.facebook.com/monda.brother/',
  instagramUrl: 'https://www.instagram.com/monda_brothers/',
  youtubeUrl: 'https://www.youtube.com/@MondaBrothersBuilder',
  linkedinUrl: 'https://www.linkedin.com/company/monda-brothers/',
  copyrightText: '© Copyright 2026 Monda brothers. All rights reserved.',
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Our Team', href: '/team' },
    { label: 'Projects', href: '/projects' },
    { label: 'Main Areas', href: '/main-areas' },
    { label: 'Blogs & Insights', href: '/blogs' },
    { label: 'Contact Us', href: '/contact' },
  ]
}

function formatTel(phone) {
  if (!phone) return 'tel:+923016624449'
  const cleaned = phone.replace(/[^+\d]/g, '')
  return `tel:${cleaned}`
}

function formatWhatsAppUrl(whatsappNumber) {
  if (!whatsappNumber) return 'https://wa.me/923150111999'
  // Remove all non-digits for wa.me format
  const digits = whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}`
}

function Footer() {
  const [footerData, setFooterData] = useState(DEFAULT_FOOTER)

  useEffect(() => {
    let isMounted = true
    apiRequest('/footer')
      .then((res) => {
        if (isMounted && res?.data) {
          setFooterData((prev) => ({
            ...prev,
            ...res.data,
            quickLinks: res.data.quickLinks?.length ? res.data.quickLinks : prev.quickLinks
          }))
        }
      })
      .catch(() => {
        // Silently fallback to DEFAULT_FOOTER
      })

    return () => {
      isMounted = false
    }
  }, [])

  const socialLinks = [
    {
      icon: FaFacebook,
      href: footerData.facebookUrl || 'https://www.facebook.com/monda.brother/',
      label: 'Facebook',
      color: 'hover:text-[#1877F2]'
    },
    {
      icon: FaInstagram,
      href: footerData.instagramUrl || 'https://www.instagram.com/monda_brothers/',
      label: 'Instagram',
      color: 'hover:text-[#E4405F]'
    },
    {
      icon: FaWhatsapp,
      href: formatWhatsAppUrl(footerData.whatsapp),
      label: 'WhatsApp',
      color: 'hover:text-[#25D366]'
    },
    {
      icon: FaYoutube,
      href: footerData.youtubeUrl || 'https://www.youtube.com/@MondaBrothersBuilder',
      label: 'YouTube',
      color: 'hover:text-[#FF0000]'
    },
    {
      icon: FaLinkedin,
      href: footerData.linkedinUrl || 'https://www.linkedin.com/company/monda-brothers/',
      label: 'LinkedIn',
      color: 'hover:text-[#0A66C2]'
    },
  ].filter((item) => Boolean(item.href))

  const telLink = formatTel(footerData.phone)
  const waLink = formatWhatsAppUrl(footerData.whatsapp)

  return (
    <footer className="relative bg-white border-t border-gray-100 shadow-xs">
      <div className="relative">
        {/* Main Footer Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            
            {/* Column 1 - Company Info */}
            <div className="text-gray-900 space-y-4">
              <div className="inline-flex items-center">
                <img 
                  src="/assets/images1/Monda/logo_monda.png" 
                  alt={footerData.companyName || 'Monda brothers'} 
                  className="h-12 w-auto object-contain" 
                  onError={(e) => {
                    // Fallback if image path differs
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xl font-bold tracking-tight text-gray-900 ml-2">
                  {footerData.companyName || 'Monda Brothers'}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {footerData.tagline || 'We Transform Your Vision Into Beautifully Crafted Spaces.'}
              </p>
              <div className="flex items-start gap-2.5 text-xs text-gray-600 pt-1">
                <FaMapMarkerAlt className="w-4 h-4 text-camel shrink-0 mt-0.5" />
                <span>{footerData.address || 'DHA Multan, Punjab, Pakistan'}</span>
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div className="text-gray-900">
              <h4 className="text-base font-semibold uppercase tracking-wider text-gray-900 mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-0.5 after:bg-camel">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {(footerData.quickLinks || []).map((link, idx) => (
                  <li key={link.href || idx}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-camel hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Direct Contact (Call & WhatsApp) */}
            <div className="text-gray-900">
              <h4 className="text-base font-semibold uppercase tracking-wider text-gray-900 mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-0.5 after:bg-camel">
                Direct Contact
              </h4>
              
              <div className="space-y-3.5">
                {/* Phone / Call Direct Link */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-1">
                    Call Directly
                  </p>
                  <a 
                    href={telLink} 
                    onClick={() => trackEvent('Contact', { method: 'phone_call', value: footerData.phone })}
                    className="inline-flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 hover:bg-camel/10 text-gray-900 hover:text-camel transition-all border border-gray-100 group w-full"
                    title="Click to call directly"
                  >
                    <div className="w-8 h-8 rounded-md bg-camel/15 group-hover:bg-camel group-hover:text-white text-camel flex items-center justify-center transition-colors shrink-0">
                      <FaPhoneAlt className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-gray-500 font-medium">Click to Call</span>
                      <span className="text-sm font-semibold tracking-wide">
                        {footerData.phoneDisplay || footerData.phone || '+92 301 6624449'}
                      </span>
                    </div>
                  </a>
                </div>

                {/* WhatsApp Direct Link */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-1">
                    WhatsApp Chat
                  </p>
                  <a 
                    href={waLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('Contact', { method: 'whatsapp', value: footerData.whatsapp })}
                    className="inline-flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 transition-all border border-emerald-100 group w-full"
                    title="Click to chat directly on WhatsApp"
                  >
                    <div className="w-8 h-8 rounded-md bg-[#25D366] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
                      <FaWhatsapp className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Chat on WhatsApp
                      </span>
                      <span className="text-sm font-semibold tracking-wide text-emerald-950">
                        {footerData.whatsappDisplay || footerData.whatsapp || '+92 315 0111999'}
                      </span>
                    </div>
                  </a>
                </div>

                {/* Email Direct Link */}
                {footerData.email && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-1">
                      Email
                    </p>
                    <a 
                      href={`mailto:${footerData.email}`} 
                      className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-camel transition-colors group"
                    >
                      <FaEnvelope className="w-3.5 h-3.5 text-gray-400 group-hover:text-camel transition-colors" />
                      <span className="break-all">{footerData.email}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Column 4 - Social Media Profiles */}
            <div className="text-gray-900">
              <h4 className="text-base font-semibold uppercase tracking-wider text-gray-900 mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-8 after:h-0.5 after:bg-camel">
                Follow Us
              </h4>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Stay updated with our latest architectural masterpieces, design ideas, and construction projects.
              </p>

              {/* Real Clickable Social Icons */}
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${social.color}`}
                      aria-label={social.label}
                      title={`Visit ${social.label}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>

              {/* Direct Quick Action Badges */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href={footerData.facebookUrl || 'https://www.facebook.com/monda.brother/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-[#1877F2] transition-colors"
                >
                  <FaFacebook className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>Facebook Profile</span>
                </a>
                <a
                  href={footerData.instagramUrl || 'https://www.instagram.com/monda_brothers/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-[#E4405F] transition-colors"
                >
                  <FaInstagram className="w-3.5 h-3.5 text-[#E4405F]" />
                  <span>Instagram Profile</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200/80"></div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-600">
              {footerData.copyrightText || (
                <>
                  © Copyright {new Date().getFullYear()}{' '}
                  <span className="text-camel font-semibold">Monda brothers</span>. All rights reserved.
                </>
              )}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Architectural Design</span>
              <span>•</span>
              <span>Interior & Construction</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer