import React, { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import TitleBadge from '../components/common/TitleBadge';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import { trackEvent } from '../lib/metaPixel';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  Tag,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Contact() {
  const [contactInfo, setContactInfo] = useState({
    badge: 'GET IN TOUCH',
    heading: "Have a Project in Mind? Let's Make It Happen",
    subheading:
      "We're excited to hear about your vision. Contact us today and let's discuss how we can transform your space into something extraordinary.",
    address: 'DHA Multan, Punjab, Pakistan',
    phone: '+92 301 6624449',
    secondaryPhone: '+92 300 1234567',
    email: 'monda_brothers@outlook.com',
    supportEmail: 'info@mondabrothers.com',
    workingHours: 'Monday – Saturday: 9:00 AM – 7:00 PM',
    image: '/images/service-detail.jpg',
    mapUrl:
      'https://www.google.com/maps?q=Momda%20Brothers%20DHA%20Multan%20Punjab%20Pakistan&output=embed',
    formButtonText: 'Request Quote',
  });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch dynamic contact info from backend
  useEffect(() => {
    apiRequest('/contact/info')
      .then((res) => {
        if (res?.success && res.data) {
          setContactInfo(res.data);
        }
      })
      .catch((err) => {
        console.warn('Using default contact info:', err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res?.success) {
        // Track Meta Pixel Lead event
        trackEvent('Lead', {
          content_name: formData.subject || 'Website Contact Inquiry',
          content_category: 'Contact Form',
        });

        setSuccessMsg(
          res.message ||
            'Thank you! Your inquiry has been sent successfully. Our team will contact you shortly.'
        );
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        setErrorMsg(res?.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Contact Us" breadcrumb={['HOME', 'CONTACT']} />

      {/* Hero Header Section */}
      <section className="relative py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
            <div className="flex shrink-0">
              <div className="py-2">
                <TitleBadge
                  text={contactInfo.badge || 'GET IN TOUCH'}
                  className="text-black"
                />
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="border-l-2 border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold text-gray-900 leading-tight">
                <span>{contactInfo.heading || "Have a Project in Mind? Let's Make It Happen"}</span>
              </div>
              <div className="pl-4 sm:pl-6 lg:pl-8">
                <p className="max-w-2xl text-gray-500 pt-4 text-sm sm:text-base leading-relaxed">
                  {contactInfo.subheading ||
                    "We're excited to hear about your vision. Contact us today and let's discuss how we can transform your space into something extraordinary."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section: Info Cards + Form */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top 4 Luxury Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Address */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-(--brand-camel) flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin size={22} />
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                  Studio Location
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                  {contactInfo.address || 'DHA Multan, Punjab, Pakistan'}
                </h3>
              </div>
              <span className="text-xs text-(--brand-camel) font-semibold mt-4 block">
                Visit Us & Site Inspections →
              </span>
            </div>

            {/* Card 2: Phone */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone size={22} />
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                  Call & WhatsApp
                </span>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-base sm:text-lg font-bold text-gray-900 hover:text-(--brand-camel) transition-colors block"
                >
                  {contactInfo.phone || '+92 301 6624449'}
                </a>
                {contactInfo.secondaryPhone && (
                  <a
                    href={`tel:${contactInfo.secondaryPhone}`}
                    className="text-xs text-gray-500 hover:text-gray-800 transition-colors block mt-0.5"
                  >
                    {contactInfo.secondaryPhone}
                  </a>
                )}
              </div>
              <span className="text-xs text-emerald-600 font-semibold mt-4 block">
                Direct Line Available 24/7 →
              </span>
            </div>

            {/* Card 3: Email */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail size={22} />
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                  Email Inquiries
                </span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-sm sm:text-base font-bold text-gray-900 hover:text-(--brand-camel) transition-colors block truncate"
                  title={contactInfo.email}
                >
                  {contactInfo.email || 'monda_brothers@outlook.com'}
                </a>
                {contactInfo.supportEmail && (
                  <span className="text-xs text-gray-500 block mt-0.5 truncate">
                    {contactInfo.supportEmail}
                  </span>
                )}
              </div>
              <span className="text-xs text-blue-600 font-semibold mt-4 block">
                Send Project Brief →
              </span>
            </div>

            {/* Card 4: Working Hours */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock size={22} />
                </div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                  Studio Hours
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                  {contactInfo.workingHours || 'Mon – Sat: 9:00 AM – 7:00 PM'}
                </h3>
              </div>
              <span className="text-xs text-purple-600 font-semibold mt-4 block">
                Sunday Closed / By Appointment →
              </span>
            </div>
          </div>

          {/* Showcase Frame & Interactive Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left: Showcase Image Frame (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200/70 group h-full min-h-[460px] bg-black">
                <img
                  src={getImageUrl(contactInfo.image || '/images/service-detail.jpg')}
                  alt="Monda Brothers Studio Showcase"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Glassmorphic Luxury Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-semibold w-fit mb-3">
                    <Sparkles size={14} />
                    <span>Architectural Excellence</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                    Transforming Architectural Dreams into Timeless Reality
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                    Personalized space planning, modern residential villas, and iconic commercial landmarks crafted with passion.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Modern Form Card (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-gray-200/80 shadow-md">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-camel) mb-1.5">
                  <MessageSquare size={15} />
                  <span>Send a Direct Message</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Request a Consultation or Quote
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Fill in your project details below and our lead architects will contact you within 24 hours.
                </p>
              </div>

              {/* Status Notifications */}
              {successMsg && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 mb-6 animate-fade-in">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold">Submission Confirmed</h4>
                    <p className="text-xs mt-0.5 leading-relaxed">{successMsg}</p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-6">
                  {errorMsg}
                </div>
              )}

              {/* Form Elements */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                      <span>Full Name *</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Malik Tariq"
                        className="w-full text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) focus:border-transparent transition-all bg-gray-50/50 text-gray-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      <span>Phone / WhatsApp *</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className="w-full text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) focus:border-transparent transition-all bg-gray-50/50 text-gray-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      <span>Email Address *</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) focus:border-transparent transition-all bg-gray-50/50 text-gray-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      <span>Project Subject *</span>
                    </label>
                    <div className="relative">
                      <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Modern Villa Architecture"
                        className="w-full text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) focus:border-transparent transition-all bg-gray-50/50 text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    <span>Project Details / Your Message *</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please share details such as plot size, desired architectural style, location, or estimated timeline..."
                      className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-(--brand-camel) focus:border-transparent transition-all bg-gray-50/50 text-gray-900 font-medium resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-(--brand-camel) text-white text-xs sm:text-sm font-bold hover:opacity-90 shadow-lg hover:shadow-xl transition-all cursor-pointer group disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending Your Request...</span>
                    ) : (
                      <>
                        <span>{contactInfo.formButtonText || 'Request Quote'}</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      {contactInfo.mapUrl && (
        <section className="relative w-full h-80 sm:h-[450px] md:h-[550px] lg:h-[650px] border-t border-gray-200">
          <iframe
            title="Studio Location Map"
            className="w-full h-full border-0 filter saturate-110"
            src={contactInfo.mapUrl}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}
    </>
  );
}