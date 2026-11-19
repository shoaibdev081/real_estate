import { useEffect, useState, useRef } from 'react';
import {
  Save,
  RefreshCw,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  X,
  Upload,
  Calendar,
  Award,
  Video,
  Sparkles,
  Building2,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest, getImageUrl } from '../lib/apiClient';

// Helper Laptop Image Picker Component
function AboutImagePicker({ label, value, onChange, token, toast, subtitle }) {
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

      const res = await apiRequest('/about/upload-image', {
        method: 'POST',
        body: formData,
        token,
      });

      if (res?.success && res.url) {
        onChange(res.url);
        setLocalPreview(null);
        toast.showSuccess('Image uploaded successfully from laptop!');
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
        className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden h-40 ${
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
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
              <Upload size={20} className="text-amber-400 animate-bounce" />
              <span className="text-xs font-bold">Select from Laptop</span>
              <span className="text-[10px] opacity-80">Click to replace photo</span>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs gap-2">
                <RefreshCw size={14} className="animate-spin text-amber-400" />
                Uploading...
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
              <Upload size={18} />
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              {uploading ? 'Uploading...' : 'Select from Laptop'}
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

export default function AboutPageManager() {
  const { token } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'timeline' | 'awards' | 'video'

  // About State
  const [aboutData, setAboutData] = useState({
    hero: {
      badge: 'STARTED IN 1989',
      heading: 'We Shape Interior Designs, Crafting Timeless And Inspiring Spaces',
      experienceYears: '26',
      experienceTitle: 'Years Of',
      experienceSubtitle: 'Experience',
      featureImage: '/images/gallery-11.jpg',
      heroImage: '/images/hero-bg-3.webp',
      description: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.',
      buttonText: 'Learn More',
      buttonLink: '/team'
    },
    video: {
      videoUrl: '/videos/Sample.mp4',
      title: 'Design In Motion'
    },
    timeline: [],
    awards: {
      badge: 'AWARD & ACHIEVEMENT',
      title: 'Design that speaks our industry awards',
      description: 'Our commitment to excellence has been recognized with numerous prestigious awards and accolades from around the industry.',
      items: []
    }
  });

  // Timeline Item Modal
  const [timelineModal, setTimelineModal] = useState({
    open: false,
    isEdit: false,
    itemIndex: null,
    form: { year: '', title: '', description: '', image: '' }
  });

  // Award Item Modal
  const [awardModal, setAwardModal] = useState({
    open: false,
    isEdit: false,
    itemIndex: null,
    form: { year: '', title: '', category: '', image: '' }
  });

  // Fetch About Page Content
  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/about');
      if (res?.success && res.data) {
        setAboutData(res.data);
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to fetch about page data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // Save All Changes
  const handleSaveAll = async () => {
    if (!token) {
      toast.showError('You must be logged in as admin to save changes.');
      return;
    }

    setSaving(true);
    try {
      const res = await apiRequest('/about', {
        method: 'PUT',
        body: aboutData,
        token,
      });

      if (res?.success) {
        toast.showSuccess('About page updated successfully!');
        if (res.data) setAboutData(res.data);
      } else {
        toast.showError('Failed to update about page');
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Timeline Helpers
  const openAddTimeline = () => {
    setTimelineModal({
      open: true,
      isEdit: false,
      itemIndex: null,
      form: { year: `${new Date().getFullYear()}`, title: '', description: '', image: '' }
    });
  };

  const openEditTimeline = (item, index) => {
    setTimelineModal({
      open: true,
      isEdit: true,
      itemIndex: index,
      form: {
        year: item.year || '',
        title: item.title || '',
        description: item.description || '',
        image: item.image || ''
      }
    });
  };

  const handleSaveTimelineModal = (e) => {
    e.preventDefault();
    const { year, title, description, image } = timelineModal.form;
    if (!year || !title) {
      toast.showError('Year and Title are required');
      return;
    }

    setAboutData((prev) => {
      const list = [...(prev.timeline || [])];
      if (timelineModal.isEdit && timelineModal.itemIndex !== null) {
        list[timelineModal.itemIndex] = { ...list[timelineModal.itemIndex], year, title, description, image };
      } else {
        list.push({ year, title, description, image });
      }
      return { ...prev, timeline: list };
    });

    setTimelineModal({ open: false, isEdit: false, itemIndex: null, form: { year: '', title: '', description: '', image: '' } });
    toast.showSuccess(`Milestone ${timelineModal.isEdit ? 'updated' : 'added'}! Click "Save Changes" to publish.`);
  };

  const handleDeleteTimelineItem = (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this milestone?');
    if (!confirmed) return;

    setAboutData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
    toast.showSuccess('Milestone removed. Click "Save Changes" to publish.');
  };

  // Awards Helpers
  const openAddAward = () => {
    setAwardModal({
      open: true,
      isEdit: false,
      itemIndex: null,
      form: { year: `${new Date().getFullYear()}`, title: '', category: 'Interior Design', image: '' }
    });
  };

  const openEditAward = (item, index) => {
    setAwardModal({
      open: true,
      isEdit: true,
      itemIndex: index,
      form: {
        year: item.year || '',
        title: item.title || '',
        category: item.category || '',
        image: item.image || ''
      }
    });
  };

  const handleSaveAwardModal = (e) => {
    e.preventDefault();
    const { year, title, category, image } = awardModal.form;
    if (!year || !title) {
      toast.showError('Year and Title are required');
      return;
    }

    setAboutData((prev) => {
      const currentItems = [...(prev.awards?.items || [])];
      if (awardModal.isEdit && awardModal.itemIndex !== null) {
        currentItems[awardModal.itemIndex] = { ...currentItems[awardModal.itemIndex], year, title, category, image };
      } else {
        currentItems.push({ year, title, category, image });
      }
      return {
        ...prev,
        awards: {
          ...prev.awards,
          items: currentItems
        }
      };
    });

    setAwardModal({ open: false, isEdit: false, itemIndex: null, form: { year: '', title: '', category: '', image: '' } });
    toast.showSuccess(`Award ${awardModal.isEdit ? 'updated' : 'added'}! Click "Save Changes" to publish.`);
  };

  const handleDeleteAwardItem = (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this award?');
    if (!confirmed) return;

    setAboutData((prev) => ({
      ...prev,
      awards: {
        ...prev.awards,
        items: prev.awards.items.filter((_, i) => i !== index)
      }
    }));
    toast.showSuccess('Award removed. Click "Save Changes" to publish.');
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw size={28} className="animate-spin mx-auto text-[var(--brand-camel)] mb-3" />
        <p className="text-xs text-[var(--text-muted)]">Loading About Page content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              About Us Page Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400">
              Company Module
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Fully control hero statement, experience numbers, background video, company timeline, and awards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:5173/about"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ExternalLink size={14} />
            <span>Live Website</span>
          </a>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'hero'
              ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Building2 size={15} />
          <span>Hero & Story</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'video'
              ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Video size={15} />
          <span>Showcase Video</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Clock size={15} />
          <span>Our Legacy Timeline ({aboutData.timeline?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('awards')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'awards'
              ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Award size={15} />
          <span>Industry Awards ({aboutData.awards?.items?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: HERO & STORY */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-5">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Hero Section & Experience Counter
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={aboutData.hero?.badge || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value }
                    }))
                  }
                  placeholder="e.g. STARTED IN 1989"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={aboutData.hero?.heading || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, heading: e.target.value }
                    }))
                  }
                  placeholder="e.g. We Shape Interior Designs, Crafting Timeless And Inspiring Spaces"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>
            </div>

            {/* Experience Number and Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Years of Experience (Big Number)
                </label>
                <input
                  type="text"
                  value={aboutData.hero?.experienceYears || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, experienceYears: e.target.value }
                    }))
                  }
                  placeholder="26"
                  className="w-full text-xs font-bold text-amber-500 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Experience Title (Upper)
                </label>
                <input
                  type="text"
                  value={aboutData.hero?.experienceTitle || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, experienceTitle: e.target.value }
                    }))
                  }
                  placeholder="Years Of"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Experience Subtitle (Lower)
                </label>
                <input
                  type="text"
                  value={aboutData.hero?.experienceSubtitle || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, experienceSubtitle: e.target.value }
                    }))
                  }
                  placeholder="Experience"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>
            </div>

            {/* Narrative Story Description */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                About Story / Mission Statement
              </label>
              <textarea
                rows={3}
                value={aboutData.hero?.description || ''}
                onChange={(e) =>
                  setAboutData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, description: e.target.value }
                  }))
                }
                placeholder="We believe that every space has the power to inspire..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] leading-relaxed"
              />
            </div>

            {/* Button Link & Label */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={aboutData.hero?.buttonText || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, buttonText: e.target.value }
                    }))
                  }
                  placeholder="Learn More"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  CTA Button Target Route
                </label>
                <input
                  type="text"
                  value={aboutData.hero?.buttonLink || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, buttonLink: e.target.value }
                    }))
                  }
                  placeholder="/team"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] font-mono"
                />
              </div>
            </div>

            {/* Laptop File Pickers for Hero Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-subtle)]">
              <AboutImagePicker
                label="Left Feature Image (Square)"
                subtitle="Small showcase square beside the 26 Years counter"
                value={aboutData.hero?.featureImage}
                onChange={(val) =>
                  setAboutData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, featureImage: val }
                  }))
                }
                token={token}
                toast={toast}
              />

              <AboutImagePicker
                label="Right Hero Image (Landscape)"
                subtitle="Header card above the story description"
                value={aboutData.hero?.heroImage}
                onChange={(val) =>
                  setAboutData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, heroImage: val }
                  }))
                }
                token={token}
                toast={toast}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHOWCASE VIDEO */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Full-width Showcase Video
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Shown directly under the hero section on the About page. Autoplays in loop.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                Video URL / Public MP4 Path
              </label>
              <input
                type="text"
                value={aboutData.video?.videoUrl || ''}
                onChange={(e) =>
                  setAboutData((prev) => ({
                    ...prev,
                    video: { ...prev.video, videoUrl: e.target.value }
                  }))
                }
                placeholder="e.g. /videos/Sample.mp4 or https://..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] font-mono"
              />
            </div>

            {/* Video Live Preview */}
            {aboutData.video?.videoUrl && (
              <div className="pt-3">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] block mb-2">
                  Video Preview:
                </span>
                <div className="w-full max-w-2xl h-64 rounded-2xl overflow-hidden bg-black shadow-lg">
                  <video
                    key={aboutData.video.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    src={getImageUrl(aboutData.video.videoUrl)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OUR LEGACY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Company Legacy Milestones ({aboutData.timeline?.length || 0})
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Renders as the auto-scrolling carousel with milestone dots on the About page
              </p>
            </div>
            <button
              type="button"
              onClick={openAddTimeline}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Plus size={15} /> Add Milestone
            </button>
          </div>

          {/* Timeline Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(aboutData.timeline || []).map((item, idx) => (
              <div
                key={item._id || idx}
                className="group relative p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xs hover:border-[var(--brand-camel)]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 rounded-xl overflow-hidden bg-black/10 mb-3">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[var(--brand-camel)] text-white shadow-xs">
                      {item.year}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-3 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => openEditTimeline(item, idx)}
                    className="p-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-camel)] hover:text-white text-[var(--text-primary)] transition-colors cursor-pointer"
                    title="Edit Milestone"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTimelineItem(idx)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    title="Delete Milestone"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INDUSTRY AWARDS */}
      {activeTab === 'awards' && (
        <div className="space-y-6">
          {/* Awards Header Settings */}
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Awards Section Headline & Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={aboutData.awards?.badge || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      awards: { ...prev.awards, badge: e.target.value }
                    }))
                  }
                  placeholder="AWARD & ACHIEVEMENT"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Section Title
                </label>
                <input
                  type="text"
                  value={aboutData.awards?.title || ''}
                  onChange={(e) =>
                    setAboutData((prev) => ({
                      ...prev,
                      awards: { ...prev.awards, title: e.target.value }
                    }))
                  }
                  placeholder="Design that speaks our industry awards"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                Section Description
              </label>
              <textarea
                rows={2}
                value={aboutData.awards?.description || ''}
                onChange={(e) =>
                  setAboutData((prev) => ({
                    ...prev,
                    awards: { ...prev.awards, description: e.target.value }
                  }))
                }
                placeholder="Our commitment to excellence has been recognized with numerous prestigious awards..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
              />
            </div>
          </div>

          {/* Awards List & Manager */}
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Awards Catalog ({aboutData.awards?.items?.length || 0})
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Interactive list where hovering a row updates the featured photograph
                </p>
              </div>

              <button
                type="button"
                onClick={openAddAward}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
              >
                <Plus size={15} /> Add Award
              </button>
            </div>

            <div className="space-y-3">
              {(aboutData.awards?.items || []).map((award, idx) => (
                <div
                  key={award._id || idx}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--brand-camel)]/60 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/10 shrink-0">
                      {award.image ? (
                        <img
                          src={getImageUrl(award.image)}
                          alt={award.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                          <Award size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[var(--brand-camel)]">
                          {award.year}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {award.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {award.category || 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditAward(award, idx)}
                      className="p-1.5 rounded-lg bg-[var(--surface-card)] hover:bg-[var(--brand-camel)] hover:text-white text-[var(--text-primary)] transition-colors cursor-pointer"
                      title="Edit Award"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAwardItem(idx)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Delete Award"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE MODAL */}
      {timelineModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {timelineModal.isEdit ? 'Edit Milestone' : 'Add New Milestone'}
              </h3>
              <button
                type="button"
                onClick={() => setTimelineModal({ open: false, isEdit: false, itemIndex: null, form: { year: '', title: '', description: '', image: '' } })}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveTimelineModal} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={timelineModal.form.year}
                    onChange={(e) => setTimelineModal((prev) => ({ ...prev, form: { ...prev.form, year: e.target.value } }))}
                    placeholder="2025"
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Milestone Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={timelineModal.form.title}
                    onChange={(e) => setTimelineModal((prev) => ({ ...prev, form: { ...prev.form, title: e.target.value } }))}
                    placeholder="e.g. Milestone Anniversary"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={timelineModal.form.description}
                  onChange={(e) => setTimelineModal((prev) => ({ ...prev, form: { ...prev.form, description: e.target.value } }))}
                  placeholder="Details of what happened in this year..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <AboutImagePicker
                label="Milestone Photo"
                subtitle="Select photo from laptop"
                value={timelineModal.form.image}
                onChange={(val) => setTimelineModal((prev) => ({ ...prev, form: { ...prev.form, image: val } }))}
                token={token}
                toast={toast}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setTimelineModal({ open: false, isEdit: false, itemIndex: null, form: { year: '', title: '', description: '', image: '' } })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  {timelineModal.isEdit ? 'Update Milestone' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AWARDS MODAL */}
      {awardModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {awardModal.isEdit ? 'Edit Industry Award' : 'Add New Industry Award'}
              </h3>
              <button
                type="button"
                onClick={() => setAwardModal({ open: false, isEdit: false, itemIndex: null, form: { year: '', title: '', category: '', image: '' } })}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAwardModal} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={awardModal.form.year}
                    onChange={(e) => setAwardModal((prev) => ({ ...prev, form: { ...prev.form, year: e.target.value } }))}
                    placeholder="2025"
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Award Category
                  </label>
                  <input
                    type="text"
                    value={awardModal.form.category}
                    onChange={(e) => setAwardModal((prev) => ({ ...prev, form: { ...prev.form, category: e.target.value } }))}
                    placeholder="e.g. Interior Design / Architecture"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Award Title *
                </label>
                <input
                  type="text"
                  required
                  value={awardModal.form.title}
                  onChange={(e) => setAwardModal((prev) => ({ ...prev, form: { ...prev.form, title: e.target.value } }))}
                  placeholder="e.g. Best Residential Design"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <AboutImagePicker
                label="Featured Project Photo"
                subtitle="Displays on hover in the awards list"
                value={awardModal.form.image}
                onChange={(val) => setAwardModal((prev) => ({ ...prev, form: { ...prev.form, image: val } }))}
                token={token}
                toast={toast}
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setAwardModal({ open: false, isEdit: false, itemIndex: null, form: { year: '', title: '', category: '', image: '' } })}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  {awardModal.isEdit ? 'Update Award' : 'Add Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
