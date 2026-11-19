import { useEffect, useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Save,
  RefreshCw,
  Sparkles,
  Layers,
  Video,
  BarChart3,
  CheckCircle2,
  Clock,
  Compass,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  ChevronRight,
  Eye,
  Sliders
} from 'lucide-react';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Helper component for picking and uploading image directly from laptop file explorer
function ImagePickerCard({ label, value, onChange, hint, token, showToast, aspect = 'banner' }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local preview while uploading (do NOT pass blob URL to onChange)
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiRequest('/home/upload-image', {
        method: 'POST',
        body: formData,
        token,
      });

      if (res?.success && res.url) {
        // Permanent local file path from server (e.g. /uploads/...)
        onChange(res.url);
        setLocalPreview(null);
        showToast.showSuccess(`${label || 'Image'} uploaded successfully!`);
      } else {
        setLocalPreview(null);
        showToast.showError('Upload completed but URL not received');
      }
    } catch (err) {
      setLocalPreview(null);
      showToast.showError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const previewSrc = localPreview || getImageUrl(value);
  const heightClass = aspect === 'thumb' ? 'h-40 max-w-xs' : 'h-44 w-full';

  return (
    <div className="space-y-1.5 flex-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--text-primary)]">
          {label}
        </label>
        {hint && <span className="text-[10px] text-[var(--text-muted)]">{hint}</span>}
      </div>

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${heightClass} ${
          (localPreview || value)
            ? 'border-[var(--brand-camel)]/40 hover:border-[var(--brand-camel)] bg-[var(--surface-elevated)]'
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
              alt={label || 'Preview'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
              <Upload size={22} className="text-amber-400 animate-bounce" />
              <span className="text-xs font-bold">Select Image from Laptop</span>
              <span className="text-[10px] opacity-80">Click to browse your device files</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="h-10 w-10 rounded-full bg-[var(--brand-camel)]/10 text-[var(--brand-camel-dark)] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Choose from Laptop
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Opens your device file picker / gallery
            </span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-10">
            <RefreshCw size={24} className="animate-spin text-amber-400" />
            <span className="text-xs font-semibold">Uploading to server…</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Local path e.g. /uploads/image.webp or /images/..."
          className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] font-mono"
        />
      </div>
    </div>
  );
}

export default function HomePageManager() {
  const { token } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [activeSlide, setActiveSlide] = useState(0);

  // Home Page Form State
  const [data, setData] = useState({
    hero: {
      badge: 'Fast and Reliable',
      description: "Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life.",
      buttonText: 'Take Counsel',
      buttonLink: '/contact',
      features: ['Tech Specifications', 'Design Project', '3D Visualization'],
      slides: [
        {
          topHeading: 'Find Your Inspired',
          bottomHeading: 'Interior Design',
          bgImage: '/images/hero-bg.webp',
          thumbImage: '/images/hero-bg.webp',
          statNumber: '360 +',
          statText: 'Successful Projects And Counting',
        },
        {
          topHeading: 'Build Your Dream',
          bottomHeading: 'Spaces',
          bgImage: '/images/hero-bg2.webp',
          thumbImage: '/images/hero-bg2.webp',
          statNumber: '260 +',
          statText: 'Completed Designs And Projects',
        },
        {
          topHeading: 'Design For Life',
          bottomHeading: 'Excellence',
          bgImage: '/images/hero-bg-3.webp',
          thumbImage: '/images/hero-bg-3.webp',
          statNumber: '400 +',
          statText: 'Satisfied Clients Worldwide',
        },
      ],
    },
    intro: {
      badge: 'WHO WE ARE',
      titlePrefix: 'Experience ',
      titleHighlight: 'the Art of Interior',
      titleSuffix: 'Design',
      description: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.',
      bgImage: '/images/intro-bg.avif',
    },
    history: {
      badge: 'Started In 1991',
      title1: 'Where Spaces',
      title2: 'Inspire, and',
      titleHighlight: 'Design',
      titleBottom: 'Comes Alive',
      highlights: ['Latest Technologies', '5 Years Warranty', 'High-Quality Designs', 'Residential Design'],
      description: "Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life.Our numbers speak better than words:",
      buttonText: 'More About Us',
      buttonLink: '/about',
      bgImage: '/images/history-bg.png',
      sideImage: '/images/history-side.jpg',
    },
    videoShowcase: {
      title: 'Unlock Your Dream Home Today!',
      subtitle: 'We encourage clients to actively participate in discussions, share their ideas, preferences, and feedback.',
      bgImage: '/images/gallery-6.jpg',
      videoUrl: '/videos/Sample.mp4',
    },
    panorama: {
      badge: '360-DEGREE PANORAMAS',
      titleNormal: 'Create An Even ',
      titleHighlight: 'Greater Experience',
      image: '/images/gallery-1.jpg',
    },
    stats: [
      { number: '30+', label: 'Years Experience', description: 'Improving homes with expert craftsmanship for years' },
      { number: '190+', label: 'Projects Completed', description: 'Over 250 successful projects delivered with quality and care' },
      { number: '260+', label: 'Skilled Tradespeople', description: 'Our team of 30 experts ensures top-quality results' },
      { number: '328+', label: 'Client Satisfaction', description: 'All of our clients are satisfied with our work and service' },
    ],
  });

  // Fetch current home page data from backend
  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/home');
      if (res?.success && res.data) {
        // Clean any accidental temporary blob URLs from loaded data
        const cleanData = JSON.parse(JSON.stringify(res.data), (key, val) => {
          if (typeof val === 'string' && val.startsWith('blob:')) return '';
          return val;
        });

        setData((prev) => ({
          ...prev,
          ...cleanData,
          hero: {
            ...prev.hero,
            ...(cleanData.hero || {}),
            slides: cleanData.hero?.slides && cleanData.hero.slides.length > 0 ? cleanData.hero.slides : prev.hero.slides,
            features: cleanData.hero?.features && cleanData.hero.features.length > 0 ? cleanData.hero.features : prev.hero.features,
          },
          intro: { ...prev.intro, ...(cleanData.intro || {}) },
          history: { ...prev.history, ...(cleanData.history || {}) },
          videoShowcase: { ...prev.videoShowcase, ...(cleanData.videoShowcase || {}) },
          panorama: { ...prev.panorama, ...(cleanData.panorama || {}) },
          stats: cleanData.stats && cleanData.stats.length > 0 ? cleanData.stats : prev.stats,
        }));
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to fetch home page content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  // Save all changes
  const handleSave = async () => {
    // Validate that no accidental blob previews are being saved
    const rawDataStr = JSON.stringify(data);
    if (rawDataStr.includes('blob:')) {
      toast.showError('One or more images contain a temporary preview. Please re-select the image from your laptop before saving.');
      return;
    }

    setSaving(true);
    try {
      await apiRequest('/home', {
        method: 'PUT',
        body: data,
        token,
      });
      toast.showSuccess('Home page content saved successfully!');
    } catch (err) {
      toast.showError(err.message || 'Failed to save home page content');
    } finally {
      setSaving(false);
    }
  };

  // --- CRUD: HERO SLIDES ---
  const handleAddSlide = () => {
    const newSlide = {
      topHeading: 'New Design Concept',
      bottomHeading: 'Modern Architecture',
      bgImage: '/images/hero-bg.webp',
      thumbImage: '/images/hero-bg.webp',
      statNumber: '100 +',
      statText: 'New Projects Completed',
    };
    setData((prev) => {
      const updatedSlides = [...prev.hero.slides, newSlide];
      return {
        ...prev,
        hero: { ...prev.hero, slides: updatedSlides },
      };
    });
    setActiveSlide(data.hero.slides.length);
    toast.showSuccess('New slide created! Edit its details below and save.');
  };

  const handleDeleteSlide = (idx) => {
    if (data.hero.slides.length <= 1) {
      toast.showError('You must keep at least one slide.');
      return;
    }
    const confirmed = window.confirm(`Delete Slide ${idx + 1}?`);
    if (!confirmed) return;

    setData((prev) => {
      const updatedSlides = prev.hero.slides.filter((_, i) => i !== idx);
      return {
        ...prev,
        hero: { ...prev.hero, slides: updatedSlides },
      };
    });
    setActiveSlide((prev) => Math.max(0, prev - 1));
    toast.showSuccess(`Slide ${idx + 1} deleted.`);
  };

  const handleDuplicateSlide = (idx) => {
    const slideToCopy = data.hero.slides[idx];
    const cloned = { ...slideToCopy, topHeading: `${slideToCopy.topHeading} (Copy)` };
    setData((prev) => {
      const updatedSlides = [...prev.hero.slides];
      updatedSlides.splice(idx + 1, 0, cloned);
      return {
        ...prev,
        hero: { ...prev.hero, slides: updatedSlides },
      };
    });
    setActiveSlide(idx + 1);
    toast.showSuccess(`Slide ${idx + 1} duplicated.`);
  };

  const updateSlide = (idx, field, val) => {
    setData((prev) => {
      const newSlides = [...prev.hero.slides];
      newSlides[idx] = { ...newSlides[idx], [field]: val };
      return {
        ...prev,
        hero: { ...prev.hero, slides: newSlides },
      };
    });
  };

  // --- CRUD: HERO FEATURES ---
  const handleAddFeature = () => {
    const item = window.prompt('Enter new feature point:');
    if (!item?.trim()) return;
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        features: [...prev.hero.features, item.trim()],
      },
    }));
  };

  const handleDeleteFeature = (idx) => {
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        features: prev.hero.features.filter((_, i) => i !== idx),
      },
    }));
  };

  const updateFeature = (idx, val) => {
    setData((prev) => {
      const newFeats = [...prev.hero.features];
      newFeats[idx] = val;
      return {
        ...prev,
        hero: { ...prev.hero, features: newFeats },
      };
    });
  };

  // --- CRUD: STATS ---
  const handleAddStat = () => {
    const newStat = {
      number: '500+',
      label: 'Happy Clients',
      description: 'Delivering exceptional spaces tailored to every client.',
    };
    setData((prev) => ({
      ...prev,
      stats: [...prev.stats, newStat],
    }));
    toast.showSuccess('New statistic added!');
  };

  const handleDeleteStat = (idx) => {
    if (data.stats.length <= 1) {
      toast.showError('You must keep at least 1 statistic.');
      return;
    }
    setData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx),
    }));
  };

  const updateStat = (idx, field, val) => {
    setData((prev) => {
      const newStats = [...prev.stats];
      newStats[idx] = { ...newStats[idx], [field]: val };
      return { ...prev, stats: newStats };
    });
  };

  // Updaters for other sections
  const updateHero = (field, val) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }));
  };

  const updateIntro = (field, val) => {
    setData((prev) => ({
      ...prev,
      intro: { ...prev.intro, [field]: val },
    }));
  };

  const updateHistory = (field, val) => {
    setData((prev) => ({
      ...prev,
      history: { ...prev.history, [field]: val },
    }));
  };

  const updateVideo = (field, val) => {
    setData((prev) => ({
      ...prev,
      videoShowcase: { ...prev.videoShowcase, [field]: val },
    }));
  };

  const updatePanorama = (field, val) => {
    setData((prev) => ({
      ...prev,
      panorama: { ...prev.panorama, [field]: val },
    }));
  };

  const tabs = [
    { id: 'hero', label: 'Hero Slides & Banner', icon: Sparkles },
    { id: 'intro', label: 'Intro (Who We Are)', icon: Layers },
    { id: 'history', label: 'History & Story', icon: Clock },
    { id: 'video', label: 'Video Showcase', icon: Video },
    { id: 'panorama', label: '360 Panorama', icon: Compass },
    { id: 'stats', label: 'Statistics Counters', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-6 py-4 shadow-sm">
          <RefreshCw className="h-5 w-5 animate-spin text-[var(--brand-camel)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Loading Home Page Data…
          </span>
        </div>
      </div>
    );
  }

  const currentSlide = data.hero.slides[activeSlide] || data.hero.slides[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Bar with Live Website link & Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-camel)]/20 text-[var(--brand-camel-dark)]">
              <Sparkles size={16} />
            </span>
            <h1 className="text-base font-bold text-[var(--text-primary)]">
              Home Page Controller
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Add, edit, delete, and update any content, images, slides, and statistics on your live homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink size={13} />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2 text-xs font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-300 disabled:opacity-60 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Saving Changes…</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hidden border-b border-[var(--border-subtle)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-[var(--brand-camel)] bg-[var(--surface-card)] text-[var(--brand-camel-dark)] shadow-xs'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO SLIDES & BANNER (FULL CRUD) */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* General Hero Settings */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-camel-dark)] flex items-center gap-2">
              <Sliders size={14} />
              Hero Header & Button Settings
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Top Badge Label
                </label>
                <input
                  type="text"
                  value={data.hero.badge || ''}
                  onChange={(e) => updateHero('badge', e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Button Text
                </label>
                <input
                  type="text"
                  value={data.hero.buttonText || ''}
                  onChange={(e) => updateHero('buttonText', e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-primary)]">
                  Button Link
                </label>
                <input
                  type="text"
                  value={data.hero.buttonLink || ''}
                  onChange={(e) => updateHero('buttonLink', e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Hero Subtitle Paragraph
              </label>
              <textarea
                rows={2}
                value={data.hero.description || ''}
                onChange={(e) => updateHero('description', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            {/* Right Card Feature Points (CRUD) */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Card Specification Points
                </label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-camel-dark)] hover:underline cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add Point</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.hero.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs"
                  >
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => updateFeature(idx, e.target.value)}
                      className="bg-transparent outline-none text-xs text-[var(--text-primary)] w-36"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFeature(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROTATING SLIDES MANAGER WITH ADD, DUPLICATE, DELETE */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span>Rotating Hero Slides</span>
                  <span className="rounded-full bg-[var(--brand-camel)]/20 px-2 py-0.5 text-[11px] font-bold text-[var(--brand-camel-dark)]">
                    {data.hero.slides.length} Total Slides
                  </span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Slides automatically rotate every 3 seconds on the website. You can add new slides, delete, or edit any slide.
                </p>
              </div>

              {/* Add New Slide Button */}
              <button
                type="button"
                onClick={handleAddSlide}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand-camel)] px-4 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition-all cursor-pointer shrink-0"
              >
                <Plus size={14} />
                <span>Add New Slide</span>
              </button>
            </div>

            {/* Slide Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hidden">
              {data.hero.slides.map((slide, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border shrink-0 ${
                    activeSlide === idx
                      ? 'border-[var(--brand-camel)] bg-[var(--brand-camel)]/15 text-[var(--brand-camel-dark)] shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="max-w-28 truncate">{slide.topHeading || `Slide ${idx + 1}`}</span>

                  {/* Actions for this slide */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateSlide(idx);
                    }}
                    title="Duplicate slide"
                    className="text-gray-400 hover:text-amber-500 p-0.5"
                  >
                    <Copy size={12} />
                  </button>

                  {data.hero.slides.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      title="Delete slide"
                      className="text-gray-400 hover:text-red-500 p-0.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ACTIVE SLIDE EDITOR */}
            {currentSlide && (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/40 p-4 sm:p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase text-[var(--brand-camel-dark)]">
                      Editing Slide #{activeSlide + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDuplicateSlide(activeSlide)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Duplicate</span>
                    </button>
                    {data.hero.slides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(activeSlide)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-500 hover:bg-red-500/20 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Headings */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-primary)]">
                      Top Heading (Line 1)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.topHeading || ''}
                      onChange={(e) => updateSlide(activeSlide, 'topHeading', e.target.value)}
                      placeholder="e.g. Find Your Inspired"
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-primary)]">
                      Bottom Heading (Line 2)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.bottomHeading || ''}
                      onChange={(e) => updateSlide(activeSlide, 'bottomHeading', e.target.value)}
                      placeholder="e.g. Interior Design"
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-primary)]">
                      Stat Number
                    </label>
                    <input
                      type="text"
                      value={currentSlide.statNumber || ''}
                      onChange={(e) => updateSlide(activeSlide, 'statNumber', e.target.value)}
                      placeholder="e.g. 360 +"
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-bold text-[var(--brand-camel-dark)] outline-none focus:border-[var(--brand-camel)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-primary)]">
                      Stat Description
                    </label>
                    <input
                      type="text"
                      value={currentSlide.statText || ''}
                      onChange={(e) => updateSlide(activeSlide, 'statText', e.target.value)}
                      placeholder="e.g. Successful Projects And Counting"
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                    />
                  </div>
                </div>

                {/* IMAGES: Background & Thumbnail with Laptop File Picker */}
                <div className="grid gap-6 md:grid-cols-2 pt-2 border-t border-[var(--border-subtle)]">
                  <ImagePickerCard
                    label={`Slide #${activeSlide + 1} Main Panoramic Background Image`}
                    hint="Full-width Hero background (Select from laptop)"
                    value={currentSlide.bgImage}
                    onChange={(url) => updateSlide(activeSlide, 'bgImage', url)}
                    token={token}
                    showToast={toast}
                    aspect="banner"
                  />

                  <ImagePickerCard
                    label={`Slide #${activeSlide + 1} Floating Card Thumbnail Image`}
                    hint="Right card thumbnail (Select from laptop)"
                    value={currentSlide.thumbImage}
                    onChange={(url) => updateSlide(activeSlide, 'thumbImage', url)}
                    token={token}
                    showToast={toast}
                    aspect="thumb"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTRO (WHO WE ARE) */}
      {activeTab === 'intro' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-camel-dark)]">
            Intro / Who We Are Section
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Badge
              </label>
              <input
                type="text"
                value={data.intro.badge || ''}
                onChange={(e) => updateIntro('badge', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Title Highlight (Gold text)
              </label>
              <input
                type="text"
                value={data.intro.titleHighlight || ''}
                onChange={(e) => updateIntro('titleHighlight', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Title Suffix
              </label>
              <input
                type="text"
                value={data.intro.titleSuffix || ''}
                onChange={(e) => updateIntro('titleSuffix', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Description Paragraph
            </label>
            <textarea
              rows={3}
              value={data.intro.description || ''}
              onChange={(e) => updateIntro('description', e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
            />
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <ImagePickerCard
              label="Intro Section Background Wallpaper"
              hint="Light subtle background texture/room (Select from laptop)"
              value={data.intro.bgImage}
              onChange={(url) => updateIntro('bgImage', url)}
              token={token}
              showToast={toast}
            />
          </div>
        </div>
      )}

      {/* TAB 3: HISTORY & STORY */}
      {activeTab === 'history' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-camel-dark)]">
            History & Company Story Section
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Badge
              </label>
              <input
                type="text"
                value={data.history.badge || ''}
                onChange={(e) => updateHistory('badge', e.target.value)}
                placeholder="e.g. Started In 1991"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Button Text
              </label>
              <input
                type="text"
                value={data.history.buttonText || ''}
                onChange={(e) => updateHistory('buttonText', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Button Link
              </label>
              <input
                type="text"
                value={data.history.buttonLink || ''}
                onChange={(e) => updateHistory('buttonLink', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Description Paragraph
            </label>
            <textarea
              rows={3}
              value={data.history.description || ''}
              onChange={(e) => updateHistory('description', e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Bullet Highlights (Comma-separated)
            </label>
            <input
              type="text"
              value={data.history.highlights ? data.history.highlights.join(', ') : ''}
              onChange={(e) =>
                updateHistory(
                  'highlights',
                  e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="Latest Technologies, 5 Years Warranty, High-Quality Designs, Residential Design"
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 pt-2 border-t border-[var(--border-subtle)]">
            <ImagePickerCard
              label="History Side Feature Image"
              hint="Large vertical portrait photo of finished interior (Select from laptop)"
              value={data.history.sideImage}
              onChange={(url) => updateHistory('sideImage', url)}
              token={token}
              showToast={toast}
            />

            <ImagePickerCard
              label="History Section Blueprint Background"
              hint="Dark blueprint background (Select from laptop)"
              value={data.history.bgImage}
              onChange={(url) => updateHistory('bgImage', url)}
              token={token}
              showToast={toast}
            />
          </div>
        </div>
      )}

      {/* TAB 4: VIDEO SHOWCASE */}
      {activeTab === 'video' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-camel-dark)]">
            Video Showcase Section
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Title
            </label>
            <input
              type="text"
              value={data.videoShowcase.title || ''}
              onChange={(e) => updateVideo('title', e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Subtitle
            </label>
            <textarea
              rows={2}
              value={data.videoShowcase.subtitle || ''}
              onChange={(e) => updateVideo('subtitle', e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Video File URL (.mp4 format)
            </label>
            <input
              type="text"
              value={data.videoShowcase.videoUrl || ''}
              onChange={(e) => updateVideo('videoUrl', e.target.value)}
              placeholder="/videos/Sample.mp4 or https://…"
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
            />
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <ImagePickerCard
              label="Video Showcase Cover Poster Image"
              hint="Dark ambient showcase cover image (Select from laptop)"
              value={data.videoShowcase.bgImage}
              onChange={(url) => updateVideo('bgImage', url)}
              token={token}
              showToast={toast}
            />
          </div>
        </div>
      )}

      {/* TAB 5: 360 PANORAMA */}
      {activeTab === 'panorama' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-camel-dark)]">
            360-Degree Panorama Section
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Badge Text
              </label>
              <input
                type="text"
                value={data.panorama.badge || ''}
                onChange={(e) => updatePanorama('badge', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Title Highlight
              </label>
              <input
                type="text"
                value={data.panorama.titleHighlight || ''}
                onChange={(e) => updatePanorama('titleHighlight', e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <ImagePickerCard
              label="360 Panorama High-Resolution Image"
              hint="Wide interactive panoramic photo (Select from laptop)"
              value={data.panorama.image}
              onChange={(url) => updatePanorama('image', url)}
              token={token}
              showToast={toast}
            />
          </div>
        </div>
      )}

      {/* TAB 6: STATISTICS COUNTERS (CRUD) */}
      {activeTab === 'stats' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-camel-dark)]">
                Counter Statistics ({data.stats.length} Active)
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                You can add new milestone statistics, edit existing ones, or delete any item.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddStat}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-camel)] px-3 py-1.5 text-xs font-bold text-white shadow hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>Add New Stat</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.stats.map((stat, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[10px] font-bold uppercase text-[var(--brand-camel-dark)]">
                    Statistic #{idx + 1}
                  </span>
                  {data.stats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStat(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete stat"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--text-primary)]">
                    Metric / Number
                  </label>
                  <input
                    type="text"
                    value={stat.number || ''}
                    onChange={(e) => updateStat(idx, 'number', e.target.value)}
                    placeholder="e.g. 30+"
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-xs font-bold text-[var(--brand-camel-dark)] outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--text-primary)]">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label || ''}
                    onChange={(e) => updateStat(idx, 'label', e.target.value)}
                    placeholder="e.g. Years Experience"
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--text-primary)]">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={stat.description || ''}
                    onChange={(e) => updateStat(idx, 'description', e.target.value)}
                    placeholder="Description..."
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Save Toolbar */}
      <div className="fixed bottom-4 left-0 right-0 z-30 px-4 sm:px-6 pointer-events-none">
        <div className="mx-auto max-w-5xl pointer-events-auto flex items-center justify-between rounded-2xl border border-[var(--brand-camel)]/50 bg-[var(--surface-card)]/95 px-5 py-3.5 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span className="font-medium">
              Click any image to select from laptop. Don't forget to save your changes!
            </span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-300 disabled:opacity-60 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Saving Changes…</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
