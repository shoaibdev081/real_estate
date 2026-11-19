import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { apiRequest } from '../../../lib/apiClient';
import { trackEvent } from '../../../lib/metaPixel';

const DEFAULT_WHATSAPP = '923150111999';

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP);
  const [showTooltip, setShowTooltip] = useState(false);

  // Fetch configured WhatsApp number from backend settings (Footer config)
  useEffect(() => {
    apiRequest('/footer')
      .then((res) => {
        if (res?.data?.whatsapp) {
          const digits = String(res.data.whatsapp).replace(/\D/g, '');
          if (digits) setWhatsappNumber(digits);
        }
      })
      .catch(() => {
        // Fallback to default
      });
  }, []);

  const handleClick = (e) => {
    // Track Meta Pixel Contact event
    try {
      trackEvent('Contact', {
        method: 'whatsapp_floating_button',
        value: whatsappNumber,
      });
    } catch {}

    const text = encodeURIComponent(
      'Hello Monda Brothers! I visited your website and would like to inquire about your architectural & interior design services.'
    );
    const waUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center group">
      {/* Tooltip on hover (Desktop) */}
      <div
        className="hidden md:flex items-center mr-3 px-3.5 py-1.5 rounded-full bg-neutral-900/90 text-white text-xs font-semibold shadow-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
        Chat with Us on WhatsApp
      </div>

      {/* Floating Button */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
        aria-label="Chat on WhatsApp"
        title="Chat with Monda Brothers on WhatsApp"
      >
        {/* Subtle Pulse Radar Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping -z-10 pointer-events-none" />

        {/* WhatsApp Icon */}
        <FaWhatsapp className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
      </button>
    </div>
  );
}

