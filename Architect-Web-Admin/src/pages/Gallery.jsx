import { useEffect, useMemo, useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Plus, X } from 'lucide-react';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import { useToast } from '../context/ToastContext';
import ResourceTable from '../components/common/ResourceTable';

const EMPTY_FORM = {
  title: '',
  category: '',
  mainImage: null,
  otherImages: [],
};

export default function Gallery() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  // Modal for image preview
  // Gallery modal state for previewing images (carousel)
  const [gallery, setGallery] = useState({ open: false, images: [], idx: 0 });
  // Consistent modal logic as Projects
  const openGallery = (images, idx = 0) => {
    setGallery({ open: true, images, idx });
  };
  const closeGallery = () => setGallery({ open: false, images: [], idx: 0 });
  const gotoGalleryIdx = (newIdx) => setGallery((g) => ({ ...g, idx: newIdx }));

  // Fetch gallery items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/gallery', {});
      setItems(res?.data ?? []);
    } catch (err) {
      toast.showError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (name === 'mainImage') {
        setForm((prev) => ({ ...prev, mainImage: files[0] }));
      } else if (name === 'otherImages') {
        setForm((prev) => ({ ...prev, otherImages: Array.from(files) }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.showError('Title is required');
      return;
    }
    if (!form.category) {
      toast.showError('Category is required');
      return;
    }
    if (!editingId && (!form.mainImage || !form.otherImages || form.otherImages.length === 0)) {
      toast.showError('Main image and at least one other image are required');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      if (form.mainImage instanceof File) {
        formData.append('mainImage', form.mainImage);
      } else if (typeof form.mainImage === 'string' && form.mainImage) {
        formData.append('mainImage', form.mainImage);
      }
      if (Array.isArray(form.otherImages)) {
        const existingOtherImages = [];
        form.otherImages.forEach((img) => {
          if (img instanceof File) {
            formData.append('otherImages', img);
          } else if (typeof img === 'string' && img) {
            existingOtherImages.push(img);
          }
        });
        formData.append('existingOtherImages', JSON.stringify(existingOtherImages));
      }
      if (editingId) {
        await apiRequest(`/gallery/${editingId}`, {
          method: 'PUT',
          body: formData,
        });
        toast.showSuccess('Gallery item updated');
      } else {
        await apiRequest('/gallery', {
          method: 'POST',
          body: formData,
        });
        toast.showSuccess('Gallery item created');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFormOpen(false);
      fetchItems();
    } catch (err) {
      toast.showError(err.message || 'Failed to save gallery item');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row._id);
    setFormOpen(true);
    setForm({
      title: row.title || '',
      category: row.category || '',
      mainImage: row.mainImage || null,
      otherImages: Array.isArray(row.otherImages) ? row.otherImages : [],
    });
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(`Delete gallery item “${row.title}”?`);
    if (!confirmed) return;
    try {
      await apiRequest(`/gallery/${row._id}`, {
        method: 'DELETE',
      });
      toast.showSuccess('Gallery item deleted');
      fetchItems();
    } catch (err) {
      toast.showError(err.message || 'Failed to delete gallery item');
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'mainImage',
        header: 'Main Image',
        render: (_val, row) =>
          row.mainImage ? (
            <img
              src={getImageUrl(row.mainImage)}
              alt="Main"
              className="h-10 w-16 object-cover rounded cursor-pointer border border-(--border-subtle)"
              title="Click to preview"
              onClick={() => openGallery([{ url: getImageUrl(row.mainImage), type: 'Main' }], 0)}
            />
          ) : <span className="text-xs text-gray-400">No image</span>,
      },
      { key: 'title', header: 'Title' },
      { key: 'category', header: 'Category' },
      {
        key: 'allImages',
        header: 'All Images',
        render: (_val, row) => {
          // Only show extra images (not main) in 'View All'
          const imgs = Array.isArray(row.otherImages)
            ? row.otherImages.filter(Boolean).map((img) => ({ url: getImageUrl(img), type: 'Other' }))
            : [];
          return imgs.length > 0 ? (
            <button
              type="button"
              className="text-xs text-blue-500 underline hover:text-blue-700"
              onClick={() => openGallery(imgs, 0)}
            >
              View All ({imgs.length})
            </button>
          ) : <span className="text-xs text-gray-400">No images</span>;
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
            Gallery
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
        emptyLabel="No gallery items yet."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-(--text-primary)">
                {editingId ? 'Edit gallery item' : 'Create gallery item'}
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
              <label className="text-[11px] font-medium text-(--text-primary)">Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
                required
              >
                <option value="">Select category</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Kitchen</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-(--text-primary)">Main Image *</label>
            <input
              type="file"
              name="mainImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
            />
            {form.mainImage && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={typeof form.mainImage === 'string' ? getImageUrl(form.mainImage) : URL.createObjectURL(form.mainImage)}
                  alt="Main Preview"
                  className="h-14 w-20 object-cover rounded border border-(--border-subtle) shadow-sm cursor-pointer"
                  onClick={() => openGallery([{ url: typeof form.mainImage === 'string' ? getImageUrl(form.mainImage) : URL.createObjectURL(form.mainImage), type: 'Main' }], 0)}
                  title="Click to preview"
                />
                <button
                  type="button"
                  className="text-xs text-red-500"
                  onClick={() => setForm(prev => ({ ...prev, mainImage: null }))}
                >Remove</button>
                <label htmlFor="replace-main-image" className="text-xs text-blue-500 cursor-pointer">
                  Replace
                  <input
                    name="replace-main-image"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setForm(prev => ({ ...prev, mainImage: e.target.files[0] }));
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-(--text-primary)">Other Images (multiple allowed) *</label>
            <input
              type="file"
              name="otherImages"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
            />
            {form.otherImages && form.otherImages.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.otherImages.map((imgFile, idx) => {
                  const imgSrc = imgFile ? (typeof imgFile === 'string' ? getImageUrl(imgFile) : URL.createObjectURL(imgFile)) : null;
                  return imgSrc ? (
                    <div key={idx} className="relative group flex flex-col items-center">
                      <img
                        id={`other-photo-preview-${idx}`}
                        src={imgSrc}
                        alt={`Other Preview ${idx+1}`}
                        className="h-14 w-20 object-cover rounded border border-(--border-subtle) shadow-sm cursor-pointer"
                        onClick={() => openGallery(
                          form.otherImages
                            .map((img, i) => img ? { url: typeof img === 'string' ? getImageUrl(img) : URL.createObjectURL(img), type: 'Other' } : null)
                            .filter(Boolean),
                          idx
                        )}
                        title="Click to preview"
                      />
                      <button type="button" className="text-xs text-red-500 mt-1" onClick={() => {
                        setForm(prev => {
                          const updated = [...prev.otherImages];
                          updated.splice(idx, 1);
                          return { ...prev, otherImages: updated };
                        });
                      }}>Remove</button>
                      <label htmlFor={`replace-other-image-${idx}`} className="text-xs text-blue-500 cursor-pointer mt-1">
                        Replace
                        <input
                          id={`replace-other-image-${idx}`}
                          name={`replace-other-image-${idx}`}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              setForm(prev => {
                                const updated = [...prev.otherImages];
                                updated[idx] = e.target.files[0];
                                return { ...prev, otherImages: updated };
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-lg bg-linear-to-r from-amber-500 to-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow hover:from-amber-400 hover:to-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving…' : editingId ? 'Update item' : 'Create item'}
            </button>
          </div>
        </form>
      )}

      {/* Gallery modal for previewing images (carousel) */}
      {gallery.open && gallery.images.length > 0 && gallery.images[gallery.idx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            type="button"
            className="absolute top-6 right-8 text-white text-2xl bg-black/60 hover:bg-black/80 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '9999px', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={closeGallery}
            title="Close preview"
            aria-label="Close preview"
          >&#10005;</button>
          {/* Only show arrows if more than 1 image */}
          {gallery.images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-8 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/60 hover:bg-black/80 rounded-full"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '9999px', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => gotoGalleryIdx((gallery.idx - 1 + gallery.images.length) % gallery.images.length)}
                title="Previous"
                aria-label="Previous image"
              ><FaArrowLeft size={24} /></button>
              <button
                type="button"
                className="absolute right-8 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/60 hover:bg-black/80 rounded-full"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '9999px', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => gotoGalleryIdx((gallery.idx + 1) % gallery.images.length)}
                title="Next"
                aria-label="Next image"
              ><FaArrowRight size={24} /></button>
            </>
          )}
          <img
            src={getImageUrl(gallery.images[gallery.idx].url)}
            alt={gallery.images[gallery.idx].type === 'Main' ? 'Main Image' : 'Other Image'}
            className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl border-4 border-white"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-xs bg-black/60 rounded px-3 py-1">
            {gallery.images[gallery.idx].type === 'Main'
              ? 'Main Image'
              : `Other Image ${gallery.idx + 1} / ${gallery.images.length}`}
          </div>
        </div>
      )}
    </div>
  );
}

