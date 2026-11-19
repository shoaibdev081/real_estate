import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Save,
  MapPin,
  Building2,
  Upload,
  User,
  Eye,
  X,
  Send,
  FileText,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Helper Laptop Image Picker Component
function ContactImagePicker({ label, value, onChange, token, toast, subtitle }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview while uploading (do not set form value to blob)
    const localUrl = URL.createObjectURL(file);
    setLocalPreview(localUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiRequest('/contact/upload-image', {
        method: 'POST',
        body: formData,
        token,
      });

      if (res?.success && res.url) {
        onChange(res.url);
        setLocalPreview(null);
        toast.showSuccess('Showcase photo uploaded successfully from laptop!');
      } else {
        setLocalPreview(null);
        toast.showError('Image upload failed.');
      }
    } catch (err) {
      setLocalPreview(null);
      toast.showError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const previewSrc = localPreview || getImageUrl(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--text-primary)]">
          {label}
        </label>
        <span className="text-[10px] text-[var(--text-muted)]">
          {subtitle || 'Click to select from laptop'}
        </span>
      </div>

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden h-48 ${
          (localPreview || value)
            ? 'border-[var(--brand-camel)]/50 hover:border-[var(--brand-camel)] bg-[var(--surface-elevated)]'
            : 'border-[var(--border-subtle)] hover:border-[var(--brand-camel)] bg-[var(--surface-elevated)]/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {(localPreview || value) ? (
          <div className="relative w-full h-full">
            <img
              src={previewSrc}
              alt="Contact Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
              <Upload size={22} className="text-amber-400 animate-bounce" />
              <span className="text-xs font-bold">Select from Laptop</span>
              <span className="text-[10px] opacity-80">Click to replace photo</span>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs gap-2">
                <RefreshCw size={14} className="animate-spin text-amber-400" />
                Uploading from laptop...
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              {uploading ? 'Uploading...' : 'Select Showcase Image from Laptop'}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">
              Supports JPG, PNG, WEBP
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL / public path"
          className="w-full text-xs px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] font-mono"
        />
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  const { token } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'settings'

  // Messages state
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'new' | 'in-progress' | 'resolved'
  const [filterRead, setFilterRead] = useState('all'); // 'all' | 'unread' | 'read'
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Settings state
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settings, setSettings] = useState({
    badge: 'GET IN TOUCH',
    heading: "Have a Project in Mind? Let's Make It Happen",
    subheading: "We're excited to hear about your vision. Contact us today and let's discuss how we can transform your space into something extraordinary.",
    address: 'DHA Multan, Punjab, Pakistan',
    phone: '+92 301 6624449',
    secondaryPhone: '+92 300 1234567',
    email: 'monda_brothers@outlook.com',
    supportEmail: 'info@mondabrothers.com',
    workingHours: 'Monday – Saturday: 9:00 AM – 7:00 PM',
    image: '/images/service-detail.jpg',
    mapUrl: 'https://www.google.com/maps?q=Momda%20Brothers%20DHA%20Multan%20Punjab%20Pakistan&output=embed',
    formButtonText: 'Request Quote'
  });

  // Fetch Inquiries
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await apiRequest('/contact/messages', { token });
      setMessages(res?.data || []);
    } catch (err) {
      toast.showError(err.message || 'Failed to load inquiries');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Fetch Settings
  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await apiRequest('/contact/info');
      if (res?.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to load contact settings');
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchSettings();
  }, []);

  // Save Settings
  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    if (!token) {
      toast.showError('You must be logged in as admin to save settings.');
      return;
    }

    setSavingSettings(true);
    try {
      const res = await apiRequest('/contact/info', {
        method: 'PUT',
        body: settings,
        token,
      });

      if (res?.success) {
        toast.showSuccess('Contact page settings updated successfully!');
        if (res.data) setSettings(res.data);
      } else {
        toast.showError('Failed to save settings');
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Toggle Read Status
  const handleToggleRead = async (msg, e) => {
    if (e) e.stopPropagation();
    try {
      const newStatus = !msg.read;
      await apiRequest(`/contact/messages/${msg._id}/read`, {
        method: 'PATCH',
        body: { read: newStatus },
        token,
      });

      setMessages((prev) =>
        prev.map((item) => (item._id === msg._id ? { ...item, read: newStatus } : item))
      );
      if (selectedMessage?._id === msg._id) {
        setSelectedMessage((prev) => (prev ? { ...prev, read: newStatus } : null));
      }
      toast.showSuccess(newStatus ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      toast.showError(err.message || 'Failed to update read status');
    }
  };

  // Update Status (New, In Progress, Resolved)
  const handleUpdateStatus = async (msgId, newStatus) => {
    try {
      await apiRequest(`/contact/messages/${msgId}/status`, {
        method: 'PATCH',
        body: { status: newStatus },
        token,
      });

      setMessages((prev) =>
        prev.map((item) => (item._id === msgId ? { ...item, status: newStatus } : item))
      );
      if (selectedMessage?._id === msgId) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      toast.showSuccess(`Status changed to ${newStatus}`);
    } catch (err) {
      toast.showError(err.message || 'Failed to update status');
    }
  };

  // Delete Message
  const handleDeleteMessage = async (msgId, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this contact message?');
    if (!confirmed) return;

    try {
      await apiRequest(`/contact/messages/${msgId}`, {
        method: 'DELETE',
        token,
      });

      setMessages((prev) => prev.filter((item) => item._id !== msgId));
      if (selectedMessage?._id === msgId) {
        setSelectedMessage(null);
      }
      toast.showSuccess('Inquiry deleted successfully');
    } catch (err) {
      toast.showError(err.message || 'Failed to delete message');
    }
  };

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        msg.fullName?.toLowerCase().includes(q) ||
        msg.email?.toLowerCase().includes(q) ||
        msg.phone?.toLowerCase().includes(q) ||
        msg.subject?.toLowerCase().includes(q) ||
        msg.message?.toLowerCase().includes(q);

      const matchStatus =
        filterStatus === 'all' || msg.status === filterStatus;

      const matchRead =
        filterRead === 'all'
          ? true
          : filterRead === 'unread'
          ? !msg.read
          : msg.read;

      return matchSearch && matchStatus && matchRead;
    });
  }, [messages, search, filterStatus, filterRead]);

  // Statistics
  const stats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter((m) => !m.read).length;
    const inProgress = messages.filter((m) => m.status === 'in-progress').length;
    const resolved = messages.filter((m) => m.status === 'resolved').length;
    return { total, unread, inProgress, resolved };
  }, [messages]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Contact Center & Inquiries
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--brand-camel)]/20 text-[var(--brand-camel)]">
              {stats.unread} Unread
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage contact form inquiries, client requests, studio address, phones, emails, and map
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:5173/contact"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ExternalLink size={14} />
            <span>Live Website</span>
          </a>

          {activeTab === 'settings' ? (
            <button
              type="button"
              disabled={savingSettings}
              onClick={handleSaveSettings}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={fetchMessages}
              className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Refresh messages"
            >
              <RefreshCw size={16} className={loadingMessages ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'messages'
              ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <MessageSquare size={15} />
          <span>Customer Inquiries ({messages.length})</span>
          {stats.unread > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sliders size={15} />
          <span>Page Content & Contact Info</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER INQUIRIES ("FORM DATA") */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                Total Inquiries
              </span>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {stats.total}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider block">
                Unread Messages
              </span>
              <p className="text-2xl font-bold text-amber-500 mt-1">
                {stats.unread}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block">
                In Progress
              </span>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {stats.inProgress}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider block">
                Resolved
              </span>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                {stats.resolved}
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--surface-card)] p-3 rounded-2xl border border-[var(--border-subtle)]">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone, subject..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-[var(--brand-camel)] text-white'
                    : 'bg-[var(--surface-ground)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                All Status
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('new')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === 'new'
                    ? 'bg-amber-500 text-white'
                    : 'bg-[var(--surface-ground)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                New
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('in-progress')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === 'in-progress'
                    ? 'bg-blue-500 text-white'
                    : 'bg-[var(--surface-ground)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                In Progress
              </button>

              <button
                type="button"
                onClick={() => setFilterStatus('resolved')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === 'resolved'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[var(--surface-ground)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Resolved
              </button>

              <div className="h-4 w-px bg-[var(--border-subtle)] mx-1"></div>

              <button
                type="button"
                onClick={() => setFilterRead((prev) => (prev === 'unread' ? 'all' : 'unread'))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterRead === 'unread'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-[var(--surface-ground)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Unread Only
              </button>
            </div>
          </div>

          {/* Messages List / Table */}
          {loadingMessages ? (
            <div className="py-20 text-center">
              <RefreshCw size={28} className="animate-spin mx-auto text-[var(--brand-camel)] mb-3" />
              <p className="text-xs text-[var(--text-muted)]">Loading inquiries...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-2xl bg-[var(--surface-card)]">
              <Mail size={36} className="mx-auto text-[var(--text-muted)] mb-3 opacity-60" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                No inquiries found
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mt-1">
                {search || filterStatus !== 'all' || filterRead !== 'all'
                  ? 'Try clearing your search query or filters.'
                  : 'Customer inquiries submitted from the website contact form will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    !msg.read
                      ? 'border-[var(--brand-camel)]/40 bg-[var(--surface-elevated)] shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-[var(--border-subtle)]/80'
                  }`}
                >
                  {/* Left: Sender & Subject */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                        !msg.read
                          ? 'bg-[var(--brand-camel)] text-white shadow-xs'
                          : 'bg-[var(--surface-ground)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {msg.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          {msg.fullName}
                        </span>
                        {!msg.read && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400">
                            NEW
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            msg.status === 'resolved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : msg.status === 'in-progress'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {msg.status === 'in-progress' ? 'In Progress' : msg.status?.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-[var(--text-primary)] mt-1 truncate">
                        {msg.subject}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {msg.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--text-muted)] mt-2">
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-[var(--brand-camel)]" />
                          {msg.email}
                        </span>
                        {msg.phone && msg.phone !== 'N/A' && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} className="text-blue-400" />
                            {msg.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(msg.createdAt).toLocaleDateString()} at{' '}
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(msg, e)}
                      className={`p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        msg.read
                          ? 'bg-[var(--surface-ground)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                          : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      }`}
                      title={msg.read ? 'Mark Unread' : 'Mark Read'}
                    >
                      <CheckCircle2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMessage(msg);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--brand-camel)] hover:text-white text-[var(--text-primary)] text-xs font-semibold transition-all cursor-pointer"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteMessage(msg._id, e)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAGE CONTENT & CONTACT INFO */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Header & Subtitle */}
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Contact Page Header & Vision Statement
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={settings.badge || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g. GET IN TOUCH"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={settings.heading || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g. Have a Project in Mind? Let's Make It Happen"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                Subheading / Description
              </label>
              <textarea
                rows={2}
                value={settings.subheading || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, subheading: e.target.value }))}
                placeholder="We're excited to hear about your vision..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] leading-relaxed"
              />
            </div>
          </div>

          {/* Official Contact Info Cards */}
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Studio & Contact Information (Rendered in Info Cards)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                  <MapPin size={13} className="text-amber-500" /> Physical Address
                </label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. DHA Multan, Punjab, Pakistan"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                  <Phone size={13} className="text-emerald-500" /> Primary Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. +92 301 6624449"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                  <Phone size={13} className="text-blue-400" /> Secondary Phone (Optional)
                </label>
                <input
                  type="text"
                  value={settings.secondaryPhone || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, secondaryPhone: e.target.value }))}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                  <Mail size={13} className="text-amber-500" /> Primary Email Address
                </label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. monda_brothers@outlook.com"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                  <Mail size={13} className="text-blue-400" /> Support / Info Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
                  placeholder="e.g. info@mondabrothers.com"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
                  <Clock size={13} className="text-purple-400" /> Studio Working Hours
                </label>
                <input
                  type="text"
                  value={settings.workingHours || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, workingHours: e.target.value }))}
                  placeholder="e.g. Monday – Saturday: 9:00 AM – 7:00 PM"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>
            </div>
          </div>

          {/* Media & Google Map */}
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-5">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Showcase Media, CTA Button & Google Map Embed
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Laptop Image Picker */}
              <ContactImagePicker
                label="Left Showcase Image"
                subtitle="High-res architectural photograph displayed beside the form"
                value={settings.image}
                onChange={(val) => setSettings((prev) => ({ ...prev, image: val }))}
                token={token}
                toast={toast}
              />

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Form Submit Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.formButtonText || ''}
                    onChange={(e) => setSettings((prev) => ({ ...prev, formButtonText: e.target.value }))}
                    placeholder="e.g. Request Quote"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="text"
                    value={settings.mapUrl || ''}
                    onChange={(e) => setSettings((prev) => ({ ...prev, mapUrl: e.target.value }))}
                    placeholder="https://www.google.com/maps?q=..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] font-mono"
                  />
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Renders in full-width interactive map container at the bottom of the Contact page
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {savingSettings ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save All Contact Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* INQUIRY DETAIL MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Inquiry from {selectedMessage.fullName}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Status Selector */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-elevated)]">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Inquiry Status:
              </span>
              <div className="flex items-center gap-1.5">
                {['new', 'in-progress', 'resolved'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedMessage._id, st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedMessage.status === st
                        ? st === 'resolved'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : st === 'in-progress'
                          ? 'bg-blue-500 text-white shadow-xs'
                          : 'bg-amber-500 text-white shadow-xs'
                        : 'bg-[var(--surface-ground)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {st === 'in-progress' ? 'In Progress' : st.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Meta Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)]">
                <span className="text-[10px] text-[var(--text-muted)] block font-medium">Email Address</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-semibold text-[var(--brand-camel)] hover:underline truncate block"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)]">
                <span className="text-[10px] text-[var(--text-muted)] block font-medium">Phone Number</span>
                <a
                  href={`tel:${selectedMessage.phone}`}
                  className="font-semibold text-[var(--text-primary)] hover:underline truncate block"
                >
                  {selectedMessage.phone || 'N/A'}
                </a>
              </div>
            </div>

            {/* Subject */}
            <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)]">
              <span className="text-[10px] text-[var(--text-muted)] block font-medium">Subject</span>
              <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                {selectedMessage.subject}
              </p>
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] block font-medium">Message</span>
              <p className="text-xs text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => handleDeleteMessage(selectedMessage._id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Inquiry</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedMessage)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface-ground)] text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  <Send size={13} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
