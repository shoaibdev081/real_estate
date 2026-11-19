/**
 * Meta (Facebook & Instagram) Pixel Tracking Utility for Monda Brothers
 * Enables tracking website visitors, leads, contact clicks, and orders
 * for Facebook & Instagram Retargeting / Custom Audience campaigns.
 */

let isInitialized = false;
let currentPixelId = '';

export function initMetaPixel(pixelId) {
  if (!pixelId || typeof window === 'undefined') return;

  const cleanId = String(pixelId).trim();
  if (!cleanId || (isInitialized && currentPixelId === cleanId)) return;

  // Initialize fbq function queue
  if (!window.fbq) {
    const fbq = function () {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, arguments);
      } else {
        fbq.queue.push(arguments);
      }
    };
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];

    // Inject Meta script tag
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  try {
    window.fbq('init', cleanId);
    window.fbq('track', 'PageView');
    isInitialized = true;
    currentPixelId = cleanId;
    console.log(`[Meta Pixel] Initialized successfully with ID: ${cleanId}`);
  } catch (err) {
    console.warn('[Meta Pixel] Failed to initialize:', err);
  }
}

/**
 * Track route / page view on page navigation
 */
export function trackPageView(pagePath = '') {
  if (typeof window === 'undefined' || !window.fbq) return;
  try {
    window.fbq('track', 'PageView', {
      page_path: pagePath || window.location.pathname,
      page_title: document.title,
    });
  } catch (err) {
    console.warn('[Meta Pixel] PageView tracking error:', err);
  }
}

/**
 * Track standard or custom conversion events:
 * - 'Lead': When user submits quote / contact form
 * - 'Contact': When user clicks WhatsApp or Call
 * - 'ViewContent': When user views a service / project / product
 * - 'InitiateCheckout': When user visits cart / checkout
 * - 'Purchase': When user completes an order
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !window.fbq) return;
  try {
    window.fbq('track', eventName, params);
    console.log(`[Meta Pixel] Event tracked: ${eventName}`, params);
  } catch (err) {
    console.warn(`[Meta Pixel] Error tracking event ${eventName}:`, err);
  }
}

export function isPixelInitialized() {
  return isInitialized;
}
