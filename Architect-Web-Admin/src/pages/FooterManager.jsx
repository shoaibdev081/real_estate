import { useEffect, useState } from 'react';
import {
  Save,
  RotateCcw,
  ExternalLink,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Globe,
  Share2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sparkles,
  Link as LinkIcon,
  Target,
  Activity,
  Eye,
  HelpCircle
} from 'lucide-react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaYoutube, 
  FaLinkedin 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest } from '../lib/apiClient';

const DEFAULT_FOOTER_VALUES = {
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
    { label: 'Contact Us', href: '/contact' }
  ],
  metaPixelId: '',
  metaPixelEnabled: true
};

export default function FooterManager() {
  const { token } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FOOTER_VALUES);
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' | 'social' | 'company' | 'links' | 'preview'

  // New Quick Link input state
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkHref, setNewLinkHref] = useState('');

  // Fetch footer data
  const fetchFooterData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/footer');
      if (res?.data) {
        setFormData({
          ...DEFAULT_FOOTER_VALUES,
          ...res.data,
          quickLinks: res.data.quickLinks?.length ? res.data.quickLinks : DEFAULT_FOOTER_VALUES.quickLinks
        });
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to fetch footer settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Save changes (Update)
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await apiRequest('/footer', {
        method: 'PUT',
        body: formData,
        token
      });

      if (res?.success) {
        toast.showSuccess('Footer settings saved and updated successfully!');
        if (res.data) {
          setFormData(res.data);
        }
      } else {
        toast.showError(res?.message || 'Failed to update footer');
      }
    } catch (err) {
      toast.showError(err.message || 'Error updating footer');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default / Delete custom changes
  const handleReset = async () => {
    setResetting(true);
    try {
      const res = await apiRequest('/footer', {
        method: 'DELETE',
        token
      });

      if (res?.success) {
        toast.showSuccess('Footer reset to default values successfully!');
        setFormData(res.data || DEFAULT_FOOTER_VALUES);
        setShowResetConfirm(false);
      } else {
        toast.showError(res?.message || 'Failed to reset footer');
      }
    } catch (err) {
      toast.showError(err.message || 'Error resetting footer');
    } finally {
      setResetting(false);
    }
  };

  // Quick Links handlers
  const handleAddLink = () => {
    if (!newLinkLabel.trim() || !newLinkHref.trim()) {
      toast.showError('Please provide both link label and URL');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      quickLinks: [...(prev.quickLinks || []), { label: newLinkLabel.trim(), href: newLinkHref.trim() }]
    }));
    setNewLinkLabel('');
    setNewLinkHref('');
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, idx) => idx !== index)
    }));
  };

  const handleUpdateLink = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.quickLinks || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, quickLinks: updated };
    });
  };

  // Direct URLs helpers
  const waDirectUrl = `https://wa.me/${(formData.whatsapp || '').replace(/\D/g, '')}`;
  const telDirectUrl = `tel:${(formData.phone || '').replace(/[^+\d]/g, '')}`;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-camel)] border-t-transparent"></div>
          <p className="text-sm text-[var(--text-muted)]">Loading footer configuration…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-camel)]/15 text-[var(--brand-camel-dark)]">
              <Share2 className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                Footer & Social Settings
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage live Facebook, Instagram, WhatsApp, Phone calling, Quick Links & Copyright.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            disabled={saving || resetting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all cursor-pointer"
            title="Reset to default links and clear edits"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || resetting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--brand-camel-dark)] to-[var(--brand-camel)] px-4 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Saving Changes…</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-2">
        {[
          { id: 'contact', label: 'Call & WhatsApp Direct', icon: Phone },
          { id: 'social', label: 'Social Media Profiles', icon: Share2 },
          { id: 'company', label: 'Company Info & Copyright', icon: Building2 },
          { id: 'links', label: 'Quick Links', icon: LinkIcon },
          { id: 'pixel', label: 'Meta Pixel & Retargeting', icon: Target },
          { id: 'preview', label: 'Live Test Preview', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--brand-camel)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Direct Contact & WhatsApp */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone / Direct Dialing */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[var(--brand-camel)]/10 text-[var(--brand-camel-dark)]">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Direct Call Phone</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">Clicking triggers phone dialer immediately</p>
                </div>
              </div>
              <a
                href={telDirectUrl}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                title="Test calling on your device"
              >
                <span>Test Dial</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                  Raw Dial Number (e.g. +923016624449)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+923016624449"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                  Display Text (What visitors read)
                </label>
                <input
                  type="text"
                  value={formData.phoneDisplay}
                  onChange={(e) => handleChange('phoneDisplay', e.target.value)}
                  placeholder="+92 301 6624449"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Chat */}
          <div className="rounded-2xl border border-emerald-500/20 bg-[var(--surface-card)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <FaWhatsapp className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">WhatsApp Direct Chat</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">Opens WhatsApp chat with Monda Brothers directly</p>
                </div>
              </div>
              <a
                href={waDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-xs"
                title="Open WhatsApp chat now"
              >
                <span>Test WhatsApp</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                  WhatsApp Number (with country code e.g. +923150111999)
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="+923150111999"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                  WhatsApp Display Text
                </label>
                <input
                  type="text"
                  value={formData.whatsappDisplay}
                  onChange={(e) => handleChange('whatsappDisplay', e.target.value)}
                  placeholder="+92 315 0111999"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-4 shadow-sm md:col-span-2">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
              <span className="p-2 rounded-lg bg-[var(--brand-camel)]/10 text-[var(--brand-camel-dark)]">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Official Email</h3>
                <p className="text-[11px] text-[var(--text-muted)]">Shown in footer contact section</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="monda_brothers@outlook.com"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Social Media Profiles */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Facebook Link */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
                    <FaFacebook className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">Facebook Page Link</span>
                </div>
                {formData.facebookUrl && (
                  <a
                    href={formData.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#1877F2] hover:underline"
                  >
                    <span>Visit Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://www.facebook.com/monda.brother/"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[#1877F2] transition-colors"
              />
            </div>

            {/* Instagram Link */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-[#E4405F]/10 text-[#E4405F]">
                    <FaInstagram className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">Instagram Account Link</span>
                </div>
                {formData.instagramUrl && (
                  <a
                    href={formData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#E4405F] hover:underline"
                  >
                    <span>Visit Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://www.instagram.com/monda_brothers/"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[#E4405F] transition-colors"
              />
            </div>

            {/* YouTube Link */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-[#FF0000]/10 text-[#FF0000]">
                    <FaYoutube className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">YouTube Channel Link</span>
                </div>
                {formData.youtubeUrl && (
                  <a
                    href={formData.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#FF0000] hover:underline"
                  >
                    <span>Visit Channel</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                placeholder="https://www.youtube.com/@MondaBrothersBuilder"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[#FF0000] transition-colors"
              />
            </div>

            {/* LinkedIn Link */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2]">
                    <FaLinkedin className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">LinkedIn Company Page</span>
                </div>
                {formData.linkedinUrl && (
                  <a
                    href={formData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#0A66C2] hover:underline"
                  >
                    <span>Visit Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                placeholder="https://www.linkedin.com/company/monda-brothers/"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[#0A66C2] transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Company Info & Copyright */}
      {activeTab === 'company' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                Company Brand Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Monda brothers"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                Office Address / Location
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="DHA Multan, Punjab, Pakistan"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                Footer Tagline / Brief Description
              </label>
              <textarea
                rows={2}
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="We Transform Your Vision Into Beautifully Crafted Spaces."
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] transition-colors resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                placeholder="© Copyright 2026 Monda brothers. All rights reserved."
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Quick Links Manager */}
      {activeTab === 'links' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Quick Links Manager</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Customize links shown in the Quick Links section of the website footer.
            </p>
          </div>

          {/* Existing links table */}
          <div className="space-y-3">
            {(formData.quickLinks || []).map((link, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
              >
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleUpdateLink(idx, 'label', e.target.value)}
                    placeholder="Link Label (e.g. Services)"
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>
                <div className="w-full sm:flex-1">
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => handleUpdateLink(idx, 'href', e.target.value)}
                    placeholder="Link Path (e.g. /services)"
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(idx)}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0 self-end sm:self-auto"
                  title="Remove link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new link row */}
          <div className="p-4 rounded-xl border border-dashed border-[var(--brand-camel)]/40 bg-[var(--brand-camel)]/5 space-y-3">
            <h4 className="text-xs font-bold text-[var(--text-primary)]">Add New Footer Link</h4>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="Label (e.g. Career)"
                className="w-full sm:w-1/3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
              <input
                type="text"
                value={newLinkHref}
                onChange={(e) => setNewLinkHref(e.target.value)}
                placeholder="URL / Path (e.g. /career)"
                className="w-full sm:flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--brand-camel)] text-white text-xs font-semibold hover:bg-[var(--brand-camel-dark)] transition-colors cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Meta Pixel & Retargeting */}
      {activeTab === 'pixel' && (
        <div className="space-y-6">
          {/* Main Pixel Setup Card */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1877F2]/10 text-[#1877F2]">
                  <Target className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Meta (Facebook & Instagram) Pixel Integration
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Track visitors and retarget users who visited the website without placing an order.
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {formData.metaPixelId && formData.metaPixelEnabled !== false ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Pixel Active & Tracking
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Pixel Inactive (Add ID)
                  </span>
                )}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
                  <span>Meta Pixel ID (Dataset ID)</span>
                  <a
                    href="https://business.facebook.com/events_manager/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#1877F2] hover:underline"
                  >
                    <span>Get Pixel ID from Meta Events Manager</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.metaPixelId || ''}
                    onChange={(e) => handleChange('metaPixelId', e.target.value)}
                    placeholder="e.g. 1234567890123456"
                    className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[#1877F2] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Found in Meta Events Manager &gt; Data Sources &gt; Pixel / Dataset ID.
                </p>
              </div>

              {/* Enable Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)] block">
                  Tracking Status
                </label>
                <label className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.metaPixelEnabled !== false}
                    onChange={(e) => handleChange('metaPixelEnabled', e.target.checked)}
                    className="h-4 w-4 rounded text-[var(--brand-camel)] focus:ring-[var(--brand-camel)] cursor-pointer"
                  />
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {formData.metaPixelEnabled !== false ? 'Tracking Enabled' : 'Tracking Paused'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Strategy Guide for Retargeting Visitors who didn't order */}
          <div className="rounded-2xl border border-[var(--brand-camel)]/30 bg-gradient-to-br from-[var(--surface-card)] to-[var(--brand-camel)]/5 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 text-[var(--brand-camel-dark)]">
              <span className="p-2 rounded-xl bg-[var(--brand-camel)]/15">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Kaise Un Users Ko Facebook & Instagram Par Target Karein Jinhone Website Visit Ki Magar Order/Inquiry Nahi Ki?
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  Meta Ads Manager Retargeting Blueprint (Step-by-Step)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-camel)] text-white text-xs font-bold">1</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">Automatic Tracking</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Yeh pixel har visitor ko Facebook/Instagram profile se match karta hai (`PageView`). Aur jo order/quote bhejta hai us par `Lead` ya `Purchase` event fire hota hai.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-camel)] text-white text-xs font-bold">2</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">Custom Audience Banayein</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Meta Ads Manager &gt; Audiences &gt; Create Custom Audience (Website):<br />
                  • <b>Include:</b> All Website Visitors (30 Days)<br />
                  • <b>Exclude:</b> People who fired <code>Lead</code> or <code>Purchase</code>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-camel)] text-white text-xs font-bold">3</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">Retargeting Ad Chalayein</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Ab aap Facebook aur Instagram par sirf unhi logo ko ads dikhayenge jo website dekh kar gaye thay lekin order nahi kia! Unhein special discount ya consultation offer dein.
                </p>
              </div>
            </div>
          </div>

          {/* Events Configured & Active */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Integrated Standard Meta Events
            </h4>
            <div className="divide-y divide-[var(--border-subtle)] text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 font-mono font-bold text-[11px]">PageView</span>
                  <span className="text-[var(--text-primary)]">Har page visit par fire hota hai (Website visitors collection)</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 font-mono font-bold text-[11px]">Contact</span>
                  <span className="text-[var(--text-primary)]">Jab visitor WhatsApp ya Phone Call par direct click kare</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 font-mono font-bold text-[11px]">Lead</span>
                  <span className="text-[var(--text-primary)]">Jab koi Contact / Quote form submit kare (Conversion)</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-mono font-bold text-[11px]">Purchase</span>
                  <span className="text-[var(--text-primary)]">Jab koi user Checkout se order place kare (E-commerce order)</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Live Interactive Footer Preview */}
      {activeTab === 'preview' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-white text-gray-900 p-8 shadow-md space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-camel">Live Test Simulation</span>
              <h3 className="text-lg font-bold text-gray-900">Interactive Website Footer</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Active Sync
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 1 */}
            <div className="space-y-3">
              <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span className="text-camel">◆</span>
                <span>{formData.companyName}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{formData.tagline}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-2">
                <MapPin className="h-3.5 w-3.5 text-camel" />
                <span>{formData.address}</span>
              </p>
            </div>

            {/* 2 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                {(formData.quickLinks || []).map((l, i) => (
                  <li key={i} className="hover:text-camel cursor-pointer">
                    {l.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 Direct Call & WA */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Direct Contact</h4>
              
              {/* Call */}
              <a
                href={telDirectUrl}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 hover:border-camel transition-colors"
                title="Click to test Call"
              >
                <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold">Call Directly</div>
                  <div className="text-xs font-bold text-camel">{formData.phoneDisplay || formData.phone}</div>
                </div>
              </a>

              {/* WA */}
              <a
                href={waDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 hover:border-emerald-500 transition-colors"
                title="Click to test WhatsApp chat"
              >
                <div className="w-7 h-7 rounded-md bg-[#25D366] text-white flex items-center justify-center">
                  <FaWhatsapp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Chat on WhatsApp</div>
                  <div className="text-xs font-bold text-emerald-950">{formData.whatsappDisplay || formData.whatsapp}</div>
                </div>
              </a>

              {formData.email && (
                <div className="text-xs text-gray-600 pt-1">
                  <span className="font-semibold text-gray-500">Email: </span>
                  <a href={`mailto:${formData.email}`} className="text-camel hover:underline">
                    {formData.email}
                  </a>
                </div>
              )}
            </div>

            {/* 4 Social Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Social Media</h4>
              <p className="text-xs text-gray-600">Click any icon below to test direct profile redirection:</p>
              <div className="flex gap-2 pt-1">
                {formData.facebookUrl && (
                  <a
                    href={formData.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all shadow-xs"
                    title="Facebook"
                  >
                    <FaFacebook className="w-4 h-4" />
                  </a>
                )}
                {formData.instagramUrl && (
                  <a
                    href={formData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all shadow-xs"
                    title="Instagram"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                )}
                {formData.whatsapp && (
                  <a
                    href={waDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-xs"
                    title="WhatsApp"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                )}
                {formData.youtubeUrl && (
                  <a
                    href={formData.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all shadow-xs"
                    title="YouTube"
                  >
                    <FaYoutube className="w-4 h-4" />
                  </a>
                )}
                {formData.linkedinUrl && (
                  <a
                    href={formData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all shadow-xs"
                    title="LinkedIn"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            {formData.copyrightText}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <span className="p-3 rounded-full bg-red-500/10">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Reset Footer Settings?
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  This will reset all footer info to original default links.
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Default Facebook link (https://www.facebook.com/monda.brother/), Instagram (https://www.instagram.com/monda_brothers/), Call (+923016624449), and WhatsApp (+923150111999) will be restored.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                disabled={resetting}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={resetting}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                {resetting ? 'Resetting…' : 'Yes, Reset Footer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
