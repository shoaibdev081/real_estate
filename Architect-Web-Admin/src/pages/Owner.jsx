import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { apiRequest } from '../lib/apiClient';
import { useToast } from '../context/ToastContext';
import ImageGallery from '../components/common/ImageGallery';

const EMPTY_FORM = {
  name: '',
  role: '',
  quote: '',
  image: '',
  logo: '',
};

export default function Owner() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [owner, setOwner] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [gallery, setGallery] = useState({ open: false, images: [], idx: 0 });

  const openGallery = (images, idx = 0) => {
    setGallery({ open: true, images, idx });
  };

  const closeGallery = () => setGallery({ open: false, images: [], idx: 0 });

  const gotoGalleryIdx = (newIdx) => setGallery((g) => ({ ...g, idx: newIdx }));

  useEffect(() => {
    let isMounted = true;
    const fetchOwner = async () => {
      setLoading(true);
      try {
        const res = await apiRequest('/company-owner', {});
        if (!isMounted) return;
        const data = res?.data;
        if (data && (data.name || data.role || data.quote || data.image || data.logo)) {
          setOwner(data);
          setShowForm(false);
        } else {
          setOwner(null);
          setShowForm(true);
        }
      } catch (err) {
        // 404 is fine (no owner yet)
        if (err.status !== 404) {
          toast.showError(err.message || 'Failed to load company owner info');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOwner();
    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.quote) {
      toast.showError('Name and quote are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role || undefined,
        quote: form.quote,
        image: form.image || undefined,
        logo: form.logo || undefined,
      };
      await apiRequest('/company-owner', {
        method: 'POST',
        body: payload,
      });
      toast.showSuccess('Company owner information saved');
      setOwner(payload);
      setShowForm(false);
    } catch (err) {
      toast.showError(err.message || 'Failed to save company owner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Remove company owner information?');
    if (!confirmed) return;
    try {
      await apiRequest('/company-owner', {
        method: 'DELETE',
      });
      toast.showSuccess('Company owner information deleted');
      setOwner(null);
      setForm(EMPTY_FORM);
      setShowForm(true);
    } catch (err) {
      toast.showError(err.message || 'Failed to delete company owner');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Company profile
          </h2>
        </div>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                {owner ? 'Edit company profile' : 'Create company profile'}
              </h3>
              {loading && (
                <p className="text-[11px] text-[var(--text-muted)]">
                  Loading current profile…
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Close form"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--text-primary)]">
                Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-amber-500/70"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--text-primary)]">
                Role
              </label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-amber-500/70"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[var(--text-primary)]">
              Quote *
            </label>
            <textarea
              name="quote"
              rows={3}
              value={form.quote}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-amber-500/70"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--text-primary)]">
                Portrait image URL
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://…"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-amber-500/70"
              />
              {form.image && (
                <div className="mt-2">
                  <img 
                    src={form.image} 
                    alt="Preview" 
                    className="h-16 w-16 object-cover rounded border cursor-pointer hover:border-[var(--brand-camel)] transition-colors"
                    onClick={() => openGallery([form.image], 0)}
                    title="Click to preview"
                  />
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[var(--text-primary)]">
                Logo URL
              </label>
              <input
                name="logo"
                value={form.logo}
                onChange={handleChange}
                placeholder="https://…"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-amber-500/70"
              />
              {form.logo && (
                <div className="mt-2">
                  <img 
                    src={form.logo} 
                    alt="Logo Preview" 
                    className="h-16 w-16 object-cover rounded border cursor-pointer hover:border-[var(--brand-camel)] transition-colors"
                    onClick={() => openGallery([form.logo], 0)}
                    title="Click to preview"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="text-[11px] text-red-500 hover:text-red-400"
            >
              Delete profile
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow hover:from-amber-400 hover:to-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto scrollbar-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow">
          <table className="min-w-full divide-y divide-[var(--border-subtle)] text-sm">
            <thead className="bg-[var(--surface-elevated)]/80 sticky top-0 z-10 backdrop-blur">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Name</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Role</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Quote</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Image</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Logo</th>
                <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 text-xs text-[var(--text-primary)]">{owner?.name}</td>
                <td className="px-3 py-2 text-xs text-[var(--text-primary)]">{owner?.role}</td>
                <td className="px-3 py-2 text-xs text-[var(--text-primary)]">{owner?.quote}</td>
                <td className="px-3 py-2 text-xs text-[var(--text-primary)]">
                  {owner?.image && (
                    <img 
                      src={owner.image} 
                      alt="Owner" 
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                      onClick={() => openGallery([owner.image], 0)}
                      title="Click to preview"
                    />
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-[var(--text-primary)]">
                  {owner?.logo && (
                    <img 
                      src={owner.logo} 
                      alt="Logo" 
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                      onClick={() => openGallery([owner.logo], 0)}
                      title="Click to preview"
                    />
                  )}
                </td>
                <td className="px-3 py-2 text-right text-xs">
                  <button
                    type="button"
                    className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-400 hover:bg-amber-500/20 mr-2"
                    onClick={() => {
                      setForm({
                        name: owner?.name || '',
                        role: owner?.role || '',
                        quote: owner?.quote || '',
                        image: owner?.image || '',
                        logo: owner?.logo || '',
                      });
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-500/20"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGallery
        open={gallery.open}
        images={gallery.images}
        currentIndex={gallery.idx}
        onClose={closeGallery}
        onPrevious={() => gotoGalleryIdx((gallery.idx - 1 + gallery.images.length) % gallery.images.length)}
        onNext={() => gotoGalleryIdx((gallery.idx + 1) % gallery.images.length)}
      />
    </div>
  );
}

