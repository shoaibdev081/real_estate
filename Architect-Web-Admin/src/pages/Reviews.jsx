import { useEffect, useMemo, useState } from 'react';
import { Plus, Info, X } from 'lucide-react';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ResourceTable from '../components/common/ResourceTable';
import ImageGallery from '../components/common/ImageGallery';

const EMPTY_FORM = {
  name: '',
  role: '',
  feedback: '',
  rating: '',
  // reviews removed
  image: null,
};

export default function Reviews() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [feedbackPanel, setFeedbackPanel] = useState({ open: false, feedback: '', client: '' });
  // ✅ Correct: Hook at top level
  const [gallery, setGallery] = useState({ open: false, images: [], idx: 0 });

  const openGallery = (images, idx = 0) => {
    setGallery({ open: true, images, idx });
  };

  const closeGallery = () => setGallery({ open: false, images: [], idx: 0 });

  const gotoGalleryIdx = (newIdx) => setGallery((g) => ({ ...g, idx: newIdx }));

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/client-reviews', {});
      setItems(res?.data ?? []);
    } catch (err) {
      toast.showError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files && files[0] ? files[0] : null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.showError('Client name is required');
      return;
    }
    setSaving(true);
    try {
      let payload;
      let isMultipart = false;
      if (form.image) {
        payload = new FormData();
        payload.append('name', form.name);
        payload.append('role', form.role);
        payload.append('feedback', form.feedback);
        payload.append('rating', form.rating);
        payload.append('reviews', form.reviews);
        payload.append('image', form.image);
        isMultipart = true;
      } else {
        payload = {
          name: form.name,
          role: form.role || undefined,
          feedback: form.feedback || undefined,
          rating: form.rating ? Number(form.rating) : undefined,
          // reviews removed from payload
        };
      }
      if (editingId) {
        await apiRequest(`/client-reviews/${editingId}`, {
          method: 'PUT',
          body: payload,
          headers: isMultipart ? undefined : { 'Content-Type': 'application/json' },
        });
        toast.showSuccess('Client review updated');
      } else {
        await apiRequest('/client-reviews', {
          method: 'POST',
          body: payload,
          headers: isMultipart ? undefined : { 'Content-Type': 'application/json' },
        });
        toast.showSuccess('Client review created');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFormOpen(false);
      fetchReviews();
    } catch (err) {
      toast.showError(err.message || 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row._id);
    setFormOpen(true);
    setForm({
      name: row.name || '',
      role: row.role || '',
      feedback: row.feedback || '',
      rating: row.rating != null ? String(row.rating) : '',
      // reviews removed from form state
      image: row.image || null,
    });
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(`Delete review from “${row.name}”?`);
    if (!confirmed) return;
    try {
      await apiRequest(`/client-reviews/${row._id}`, {
        method: 'DELETE',
      });
      toast.showSuccess('Client review deleted');
      fetchReviews();
    } catch (err) {
      toast.showError(err.message || 'Failed to delete review');
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'image',
        header: 'Image',
        render: (val) =>
          val ? (
            <img
              src={typeof val === 'string' ? getImageUrl(val) : URL.createObjectURL(val)}
              alt="review"
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
              onClick={() => openGallery([typeof val === 'string' ? getImageUrl(val) : URL.createObjectURL(val)], 0)}
              title="Click to preview"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          ),
      },
      { key: 'name', header: 'Client Name' },
      { key: 'role', header: 'Role / Designation' },
      { key: 'rating', header: 'Rating', render: (val) => val ? `${val} ★` : '—' },
      {
        key: 'feedback',
        header: 'Feedback',
        render: (val, row) => {
          const truncated = val && val.length > 40 ? val.slice(0, 40) + '...' : val;
          return (
            <button
              type="button"
              className="underline text-blue-500 hover:text-blue-700 text-xs"
              onClick={() => setFeedbackPanel({ open: true, feedback: val, client: row.name })}
            >
              {truncated || '—'}
            </button>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-(--text-primary)">
            Client reviews
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(EMPTY_FORM);
            setFormOpen((prev) => !prev);
          }}
          className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 ring-1 ring-amber-500/40 hover:bg-amber-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>
      </div>

      <ResourceTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyLabel="No client reviews yet."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Feedback Info Panel */}
      {feedbackPanel.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hidden shadow-2xl relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setFeedbackPanel({ open: false, feedback: '', client: '' })}
              title="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2">Feedback from {feedbackPanel.client}</h3>
            <div className="text-sm whitespace-pre-line">{feedbackPanel.feedback || 'No feedback provided.'}</div>
          </div>
        </div>
      )}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-(--text-primary)">
                {editingId ? 'Edit review' : 'Create review'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setForm(EMPTY_FORM);
                setEditingId(null);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Close form"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">
                Client name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">
                Role / designation
              </label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">
                Image
              </label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
              />
              {form.image && (typeof form.image === 'string' ? (
                <img 
                  src={getImageUrl(form.image)} 
                  alt="preview" 
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, marginTop: 4, cursor: 'pointer' }}
                  onClick={() => openGallery([getImageUrl(form.image)], 0)}
                  title="Click to preview"
                />
              ) : (
                <img 
                  src={URL.createObjectURL(form.image)} 
                  alt="preview" 
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, marginTop: 4, cursor: 'pointer' }}
                  onClick={() => openGallery([URL.createObjectURL(form.image)], 0)}
                  title="Click to preview"
                />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-(--text-primary)">
              Feedback
            </label>
            <textarea
              name="feedback"
              rows={3}
              value={form.feedback}
              onChange={handleChange}
              className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">
                Rating (0–5)
              </label>
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.5"
                value={form.rating}
                onChange={handleChange}
                className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
              />
            </div>
            {/* Removed number of projects field */}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-lg bg-(--brand-camel) px-3 py-1.5 text-xs font-semibold text-(--brand-black) shadow hover:bg-(--brand-camel-dark) disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving…' : editingId ? 'Update review' : 'Create review'}
            </button>
          </div>
        </form>
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

