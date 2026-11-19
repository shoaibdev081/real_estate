import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaRegCheckCircle } from 'react-icons/fa'
import PageHeader from '../../components/common/PageHeader'
import { apiRequest, getImageUrl } from '../../lib/apiClient'
import { servicesData } from '../../data/servicesData'

const DEFAULT_FAQS = [
  {
    q: 'What Pre-Construction Services Do You Offer?',
    a: 'We provide site evaluation, planning support, budgeting, design coordination, material guidance, and permit assistance to prepare your project for construction.',
  },
  {
    q: 'What Services Do You Offer?',
    a: 'Our services cover feasibility studies, cost estimation, scheduling, approvals, and early design planning for residential and commercial projects.',
  },
  {
    q: 'What Is Your Pre-Construction Process?',
    a: 'We begin with consultation, followed by site analysis, planning, budgeting, coordination, and documentation — ensuring full readiness before construction.',
  },
  {
    q: 'How Do You Establish Your Fees?',
    a: 'Pricing depends on project size, complexity, and service scope. We provide transparent estimates upfront with no hidden costs.',
  },
]

export default function ServiceDetail() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(-1)
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allServices, setAllServices] = useState([])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [serviceId])

  useEffect(() => {
    async function fetchService() {
      // Find fallback from servicesData first
      const normalizedId = String(serviceId || '').toLowerCase().trim()
      const fallbackService =
        servicesData.find(
          (s) =>
            s.slug === normalizedId ||
            s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedId ||
            s.title.toLowerCase() === normalizedId
        ) || servicesData[0]

      try {
        setLoading(true)
        const [detailRes, listRes] = await Promise.all([
          apiRequest(`/services/slug/${serviceId}`).catch(() => null),
          apiRequest('/services').catch(() => null),
        ])

        if (detailRes && detailRes.success && detailRes.data) {
          // Merge API data with fallback features/points/faqs if API data is partial
          setService({
            ...fallbackService,
            ...detailRes.data,
            features:
              Array.isArray(detailRes.data.features) && detailRes.data.features.length > 0
                ? detailRes.data.features
                : fallbackService?.features || [],
            points:
              Array.isArray(detailRes.data.points) && detailRes.data.points.length > 0
                ? detailRes.data.points
                : fallbackService?.points || [],
            faqs:
              Array.isArray(detailRes.data.faqs) && detailRes.data.faqs.length > 0
                ? detailRes.data.faqs
                : fallbackService?.faqs || DEFAULT_FAQS,
          })
        } else if (fallbackService) {
          setService(fallbackService)
        } else {
          setService(null)
        }

        if (listRes && listRes.success && Array.isArray(listRes.data) && listRes.data.length > 0) {
          setAllServices(listRes.data)
        } else {
          setAllServices(servicesData)
        }
      } catch (err) {
        if (fallbackService) {
          setService(fallbackService)
        } else {
          setService(null)
        }
        setAllServices(servicesData)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [serviceId])

  if (loading && !service) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-(--brand-camel) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-gray-500 mb-6">The requested service could not be located.</p>
        <button
          onClick={() => navigate('/services')}
          className="px-6 py-2.5 rounded-xl bg-(--brand-camel) text-white font-semibold hover:bg-(--brand-camel-dark) transition-colors"
        >
          View All Services
        </button>
      </div>
    )
  }

  const serviceImage = getImageUrl(service.image) || '/images/service-detail.jpg'
  const faqsList =
    Array.isArray(service.faqs) && service.faqs.length > 0 ? service.faqs : DEFAULT_FAQS

  return (
    <>
      <PageHeader title={service.title} breadcrumb={['HOME', 'SERVICES', service.title]} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Sidebar: Service List + Contact Card */}
          <aside className="order-2 lg:order-1 lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Other Services Navigation Card */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 pb-3 border-b-2 border-(--brand-camel)">
                  Our Services
                </h4>
                <ul className="space-y-2">
                  {allServices.map((s) => {
                    const targetSlug = s.slug || s._id
                    const isCurrent =
                      targetSlug === serviceId ||
                      s.title?.toLowerCase() === service.title?.toLowerCase()

                    return (
                      <li key={s._id || s.slug || s.title}>
                        <a
                          href={`/services/${targetSlug}`}
                          onClick={(e) => {
                            e.preventDefault()
                            navigate(`/services/${targetSlug}`)
                          }}
                          className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all group font-medium text-sm sm:text-base ${
                            isCurrent
                              ? 'bg-(--brand-camel) text-white shadow-md font-semibold'
                              : 'text-gray-700 hover:text-(--brand-camel-dark) hover:bg-(--brand-camel)/10'
                          }`}
                        >
                          <span className="truncate">{s.title}</span>
                          <span
                            className={`text-lg transition-transform group-hover:translate-x-1 ${
                              isCurrent ? 'text-white' : 'text-(--brand-camel)'
                            }`}
                          >
                            →
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Contact Assistance Card */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{ minHeight: '520px', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                >
                  <img
                    src="/images/service-side.jpg"
                    alt="Contact assistance"
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                      e.target.src = '/images/history-side.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center h-full">
                    {/* Brand Logo */}
                    <div className="mb-6">
                      <div className="bg-white rounded-full p-2 inline-flex mx-auto shadow-md">
                        <img
                          src="/assets/images1/Monda/logo_monda.png"
                          alt="Monda brothers"
                          className="w-20 h-20 object-contain"
                          onError={(e) => {
                            e.target.src = '/images/logo.png'
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-xs uppercase tracking-widest text-(--brand-camel-light) font-bold mb-2">
                      Need Personalized Advice?
                    </p>
                    <div className="text-white text-xl sm:text-2xl font-bold mb-3">
                      Have a Project in Mind?
                    </div>

                    <a
                      href="tel:+923016624449"
                      className="text-2xl sm:text-3xl font-extrabold mb-1 text-(--brand-camel) hover:brightness-110 transition-all tracking-wide"
                    >
                      +92 301 6624449
                    </a>
                    <p className="text-xs text-gray-300 mb-2">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <a
                      href="mailto:monda_brothers@outlook.com"
                      className="text-gray-300 text-sm hover:text-white transition-colors mb-8 break-all"
                    >
                      monda_brothers@outlook.com
                    </a>

                    {/* Quick Consultation Button */}
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-center font-bold text-white transition-all bg-(--brand-camel) hover:bg-(--brand-camel-dark) shadow-lg hover:scale-105 cursor-pointer text-sm sm:text-base leading-tight"
                    >
                      <span>Get A</span>
                      <span>Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="order-1 lg:order-2 lg:col-span-2 space-y-8">
            {/* Full-Width Featured Image */}
            <div className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-100">
              <img
                src={serviceImage}
                alt={service.title}
                className="w-full h-72 sm:h-96 lg:h-[460px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                onError={(e) => {
                  e.target.src = '/images/service-detail.jpg'
                }}
              />
            </div>

            {/* About The Service Content Card */}
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-sm border border-gray-100 space-y-8">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-(--brand-camel)/10 text-(--brand-camel-dark) font-bold text-xs uppercase tracking-wider mb-3">
                  Service Overview
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                  About {service.title}
                </h2>
              </div>

              {/* Primary Descriptions */}
              <div className="space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed">
                <p>{service.desc || service.description}</p>
                {service.desc2 && <p className="text-gray-700 font-normal">{service.desc2}</p>}
              </div>

              {/* Service Features Grid */}
              {Array.isArray(service.features) && service.features.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    What We Deliver in This Service
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-(--brand-camel)/50 transition-all group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-(--brand-camel) text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <FaRegCheckCircle size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-(--brand-camel-dark) transition-colors">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scope & Methodology Points */}
              {Array.isArray(service.points) && service.points.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    Key Methodology & Execution Pillars
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
                    Our execution framework guarantees total transparency, structural safety, and
                    world-class architectural precision at every step:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {service.points.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/70 border border-gray-100"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-(--brand-camel) mt-1.5 shrink-0" />
                        <p className="text-gray-800 text-sm font-medium leading-snug">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Frequently Asked Questions Accordion */}
              <div className="pt-8 border-t border-gray-100">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-widest text-(--brand-camel) font-bold block mb-1">
                    Got Questions?
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="divide-y divide-gray-200">
                  {faqsList.map((faq, idx) => {
                    const isOpen = openFaq === idx
                    return (
                      <div key={idx} className="py-2">
                        <button
                          type="button"
                          className="w-full py-4 flex justify-between items-center text-left gap-4 hover:text-(--brand-camel) transition-colors cursor-pointer group"
                          onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        >
                          <span
                            className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                              isOpen ? 'text-(--brand-camel)' : 'text-gray-900'
                            }`}
                          >
                            {faq.q}
                          </span>
                          <span
                            className={`text-2xl font-light w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isOpen
                                ? 'bg-(--brand-camel) text-white rotate-180'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-(--brand-camel)/20'
                            }`}
                          >
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="pb-5 pt-1 text-gray-600 text-sm sm:text-base leading-relaxed pl-1 pr-6 animate-fadeIn">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Call to Action Banner */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold mb-1">
                    Ready to Start Your {service.title}?
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Consult with our senior architects and get a customized proposal today.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-3 rounded-xl bg-(--brand-camel) hover:bg-(--brand-camel-dark) text-white font-bold text-sm tracking-wide transition-all shadow-md shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                >
                  Book Free Consultation
                </button>
              </div>
            </div>
          </main>
        </div>
      </section>
    </>
  )
}
