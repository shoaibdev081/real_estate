import { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Save,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  MousePointerClick,
  FileText,
  PhoneCall,
  ShoppingCart,
  Check
} from 'lucide-react';
import { apiRequest } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MetaPixel() {
  const { token } = useAuth();
  const toast = useToast();

  const [pixelId, setPixelId] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detectedId, setDetectedId] = useState('');

  // Fetch current Meta Pixel configuration
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/meta-pixel');
      if (res?.data) {
        setPixelId(res.data.metaPixelId || '');
        setEnabled(res.data.metaPixelEnabled !== false);
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to fetch Meta Pixel settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Smart snippet detector: if user pastes entire snippet, extract ID
  const handleInputChange = (val) => {
    const raw = String(val);
    setPixelId(raw);

    // Check if it looks like a snippet
    const matchFbq = raw.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]\s*\)/);
    const matchQuery = raw.match(/id=(\d{10,20})/);
    const matchDigits = raw.match(/\b\d{12,18}\b/);

    if (matchFbq && matchFbq[1]) {
      setDetectedId(matchFbq[1]);
    } else if (matchQuery && matchQuery[1]) {
      setDetectedId(matchQuery[1]);
    } else if (matchDigits && matchDigits[0] && raw.length > 20) {
      setDetectedId(matchDigits[0]);
    } else {
      setDetectedId('');
    }
  };

  const applyDetectedId = () => {
    if (detectedId) {
      setPixelId(detectedId);
      setDetectedId('');
      toast.showSuccess(`Applied extracted Pixel ID: ${detectedId}`);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await apiRequest('/meta-pixel', {
        method: 'PUT',
        body: {
          metaPixelId: detectedId || pixelId,
          metaPixelEnabled: enabled,
        },
        token,
      });

      if (res?.success) {
        toast.showSuccess('Meta Pixel configuration saved successfully!');
        setPixelId(res.data?.metaPixelId || '');
        setEnabled(res.data?.metaPixelEnabled !== false);
        setDetectedId('');
      } else {
        toast.showError(res?.message || 'Failed to save settings');
      }
    } catch (err) {
      toast.showError(err.message || 'Error updating Meta Pixel settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (!pixelId) return;
    navigator.clipboard.writeText(pixelId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.showSuccess('Pixel ID copied to clipboard');
  };

  const isConfigured = Boolean(pixelId && pixelId.trim());

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/10 text-blue-500 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-bold text-(--text-primary)">
              Meta (Facebook) Pixel & Tracking
            </h1>
          </div>
          <p className="text-xs text-(--text-muted) mt-1">
            Connect Facebook Pixel to track website visitors, page views, leads, and conversion campaigns.
          </p>
        </div>

        {/* Live Status Badge */}
        <div>
          {loading ? (
            <span className="text-xs text-gray-400">Loading status...</span>
          ) : isConfigured && enabled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active & Tracking Live
            </span>
          ) : isConfigured && !enabled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Tracking Paused
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Not Configured (Pending ID)
            </span>
          )}
        </div>
      </div>

      {/* Configuration Card */}
      <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-(--border-subtle)">
            <div>
              <h2 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                Pixel Configuration
              </h2>
              <p className="text-xs text-(--text-muted) mt-0.5">
                Enable tracking and enter your Pixel / Dataset ID from Meta Business Suite.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-(--text-muted)">
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                type="button"
                onClick={() => setEnabled((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
                role="switch"
                aria-checked={enabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Pixel ID Input Field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-(--text-primary)">
              Meta Pixel ID / Dataset ID <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={pixelId}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g. 102938475610293 (or paste full snippet)"
                className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-primary) px-3.5 py-2.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/80 font-mono tracking-wide placeholder:font-sans placeholder:text-gray-500"
              />
              {pixelId && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 rounded text-gray-400 hover:text-white transition"
                    title="Copy Pixel ID"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Smart Snippet Detection helper */}
            {detectedId && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>
                    Detected Pixel ID inside snippet: <strong className="font-mono">{detectedId}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applyDetectedId}
                  className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition"
                >
                  Use This ID
                </button>
              </div>
            )}

            <p className="text-[11px] text-(--text-muted)">
              Apna 15-16 digit Meta Pixel ID yahan paste karein. Agar aap pura code snippet bhi paste karenge to ID automatically extract ho jaye gi.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-(--border-subtle)">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) px-3.5 py-2 text-xs font-medium text-(--text-muted) hover:text-(--text-primary) hover:border-gray-500 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open Website to Test
            </a>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-amber-500 to-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow hover:from-amber-400 hover:to-amber-300 disabled:opacity-60 transition"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Step-by-Step Facebook Setup Guide */}
      <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-400" />
          Facebook Se Code Kaise Hasil Karein? (Step-by-Step Guide)
        </h2>
        <p className="text-xs text-(--text-muted)">
          Jab aap ke paas Facebook account ready ho, to sirf yeh simple steps follow karein:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) space-y-1.5">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">1</span>
              Events Manager Open Karein
            </div>
            <p className="text-(--text-muted) text-[11px] leading-relaxed">
              Browser mein <strong className="text-blue-400">business.facebook.com/events_manager2</strong> par jayein aur apne Facebook account se login karein.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) space-y-1.5">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
              Connect Data Sources (Web)
            </div>
            <p className="text-(--text-muted) text-[11px] leading-relaxed">
              Left menu mein <strong>Connect Data Sources (+)</strong> par click karein, <strong>Web</strong> select karein aur apne dataset ka naam rakhein (e.g. <em>Monda Brothers</em>).
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) space-y-1.5">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
              Pixel / Dataset ID Copy Karein
            </div>
            <p className="text-(--text-muted) text-[11px] leading-relaxed">
              Created Pixel ke <strong>Settings</strong> tab mein jayein. Wahan aap ko 15-16 digit ka <strong>Dataset ID / Pixel ID</strong> mile ga. Usko copy karein.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) space-y-1.5">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">4</span>
              Yahan Paste Karke Save Karein
            </div>
            <p className="text-(--text-muted) text-[11px] leading-relaxed">
              Upar diye gaye input field mein paste karein aur <strong>Save Changes</strong> par click karein. Tracking automatically shuru ho jaye gi!
            </p>
          </div>
        </div>
      </div>

      {/* Automatically Tracked Events */}
      <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Automatic Events Tracked (Kiya Track Hoga?)
          </h2>
          <p className="text-xs text-(--text-muted) mt-0.5">
            Pixel ID save hotay hi website par yeh 5 important conversion events khud-ba-khud track honge:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-(--border-subtle) bg-(--surface-primary) flex items-start gap-2.5">
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 mt-0.5">
              <MousePointerClick className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-(--text-primary)">PageView</div>
              <div className="text-[11px] text-(--text-muted) mt-0.5">Har user visit aur page navigation track hoti hai.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-(--border-subtle) bg-(--surface-primary) flex items-start gap-2.5">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-(--text-primary)">Lead</div>
              <div className="text-[11px] text-(--text-muted) mt-0.5">Jab visitor Contact ya Quote form submit kare.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-(--border-subtle) bg-(--surface-primary) flex items-start gap-2.5">
            <div className="p-1.5 rounded-md bg-green-500/10 text-green-400 mt-0.5">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-(--text-primary)">Contact Click</div>
              <div className="text-[11px] text-(--text-muted) mt-0.5">WhatsApp ya direct phone call button click hone par.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-(--border-subtle) bg-(--surface-primary) flex items-start gap-2.5">
            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 mt-0.5">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-(--text-primary)">InitiateCheckout</div>
              <div className="text-[11px] text-(--text-muted) mt-0.5">Cart ya checkout screen visit karne par.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-(--border-subtle) bg-(--surface-primary) flex items-start gap-2.5">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 mt-0.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-(--text-primary)">Purchase</div>
              <div className="text-[11px] text-(--text-muted) mt-0.5">Order complete hone par success page par.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

