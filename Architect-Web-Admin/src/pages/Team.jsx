import { useEffect, useMemo, useState } from 'react';
import { Plus, Info, X } from 'lucide-react';
import { apiRequest } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ResourceTable from '../components/common/ResourceTable';
import ImageGallery from '../components/common/ImageGallery';

const EMPTY_FORM = {
  name: '',
  role: '',
  image: '',
  bio: '',
  responsibility: '',
  address: '',
  experience: '',
  email: '',
  phone: '',
  education: '',
  specializedDesignAreas: '',
  stylesAndTrends: '',
  designPrinciples: '',
  social_facebook: '',
  social_instagram: '',
  social_linkedin: '',
};

export default function Team() {
  const { token } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/team', {});
      setItems(res?.data ?? []);
    } catch (err) {
      toast.showError(err.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast.showError('Name and role are required');
      return;
    }
    if (!token) {
      toast.showError('You must be logged in as admin to modify team members');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        image: form.image,
        bio: form.bio,
        responsibility: form.responsibility,
        address: form.address,
        experience: form.experience,
        email: form.email,
        phone: form.phone,
        education: form.education,
        specializedDesignAreas: Number(form.specializedDesignAreas) || 0,
        stylesAndTrends: Number(form.stylesAndTrends) || 0,
        designPrinciples: Number(form.designPrinciples) || 0,
        social_facebook: form.social_facebook,
        social_instagram: form.social_instagram,
        social_linkedin: form.social_linkedin,
      };
      if (editingId) {
        await apiRequest(`/team/${editingId}`, {
          method: 'PUT',
          body: payload,
          token,
        });
        toast.showSuccess('Team member updated');
      } else {
        await apiRequest('/team', {
          method: 'POST',
          body: payload,
          token,
        });
        toast.showSuccess('Team member created');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setFormOpen(false);
      fetchMembers();
    } catch (err) {
      toast.showError(err.message || 'Failed to save team member');
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
      image: row.image || '',
      bio: row.bio || '',
      responsibility: row.responsibility || '',
      address: row.address || '',
      experience: row.experience || '',
      email: row.email || '',
      phone: row.phone || '',
      education: row.education || '',
      specializedDesignAreas: row.specializedDesignAreas || '',
      stylesAndTrends: row.stylesAndTrends || '',
      designPrinciples: row.designPrinciples || '',
      social_facebook: row.social_facebook || '',
      social_instagram: row.social_instagram || '',
      social_linkedin: row.social_linkedin || '',
    });
  };

  const handleDelete = async (row) => {
    if (!token) {
      toast.showError('You must be logged in as admin to delete team members');
      return;
    }
    const confirmed = window.confirm(`Delete team member “${row.name}”?`);
    if (!confirmed) return;
    try {
      await apiRequest(`/team/${row._id}`, {
        method: 'DELETE',
        token,
      });
      toast.showSuccess('Team member deleted');
      fetchMembers();
    } catch (err) {
      toast.showError(err.message || 'Failed to delete team member');
    }
  };

  const [infoModal, setInfoModal] = useState({ open: false, member: null });
  const [gallery, setGallery] = useState({ open: false, images: [], idx: 0 });

  const openGallery = (images, idx = 0) => {
    setGallery({ open: true, images, idx });
  };

  const closeGallery = () => setGallery({ open: false, images: [], idx: 0 });

  const gotoGalleryIdx = (newIdx) => setGallery((g) => ({ ...g, idx: newIdx }));
  const columns = useMemo(
    () => [
      {
        key: 'image',
        header: 'Image',
        render: (value, row) =>
          row && row.image ? (
            <img
              src={row.image}
              alt="Profile"
              className="h-10 w-16 object-cover rounded cursor-pointer border border-(--border-subtle)"
              title="Click to preview"
              onClick={() => openGallery([row.image], 0)}
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          ),
      },
      { key: 'name', header: 'Name' },
      { key: 'role', header: 'Role' },
      { key: 'email', header: 'Email' },
      { key: 'phone', header: 'Phone' },
      { key: 'experience', header: 'Experience' },
      {
        key: 'info',
        header: 'Info',
        render: (_value, row) => (
          <button
            type="button"
            className="text-gray-500 hover:text-blue-600"
            title="Team Member Info"
            onClick={() => setInfoModal({ open: true, member: row })}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Info size={18} />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-(--text-primary)">
            Team
          </h2>
          {/* Removed example API text */}
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
        emptyLabel="No team members yet."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Info Modal for team member details */}
      {infoModal.open && infoModal.member && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hidden shadow-2xl relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setInfoModal({ open: false, member: null })}
              title="Close"
            >&#10005;</button>
            <h3 className="text-lg font-semibold mb-2">Team Member Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col items-center mb-2">
                  {infoModal.member.image && (
                    <img src={infoModal.member.image} alt="Profile" className="h-20 w-20 object-cover rounded-full border mb-2" />
                  )}
                  <div className="font-bold text-base text-center">{infoModal.member.name}</div>
                  <div className="text-xs text-gray-500 text-center">{infoModal.member.role}</div>
                </div>
                <div><b>Bio:</b> {infoModal.member.bio || '-'}</div>
                <div><b>Responsibility:</b> {infoModal.member.responsibility || '-'}</div>
                <div><b>Address:</b> {infoModal.member.address || '-'}</div>
                <div><b>Experience:</b> {infoModal.member.experience || '-'}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div><b>Email:</b> {infoModal.member.email || '-'}</div>
                <div><b>Phone:</b> {infoModal.member.phone || '-'}</div>
                <div><b>Education:</b> {infoModal.member.education || '-'}</div>
                <div><b>Specialized Design Areas:</b> {infoModal.member.specializedDesignAreas || '-'}</div>
                <div><b>Styles And Trends:</b> {infoModal.member.stylesAndTrends || '-'}</div>
                <div><b>Design Principles:</b> {infoModal.member.designPrinciples || '-'}</div>
                <div>
                  <b>Social Links:</b>
                  <div className="flex gap-2 mt-1">
                    {infoModal.member.social_facebook && (
                      <a href={infoModal.member.social_facebook} target="_blank" rel="noopener noreferrer" title="Facebook" className="text-blue-600 hover:underline">Fb</a>
                    )}
                    {infoModal.member.social_instagram && (
                      <a href={infoModal.member.social_instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-pink-500 hover:underline">Ig</a>
                    )}
                    {infoModal.member.social_linkedin && (
                      <a href={infoModal.member.social_linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-blue-800 hover:underline">In</a>
                    )}
                    {!(infoModal.member.social_facebook || infoModal.member.social_instagram || infoModal.member.social_linkedin) && <span className="text-xs text-gray-400">-</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
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

      {/* Info Modal */}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-4 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-(--text-primary)">
                {editingId ? 'Edit team member' : 'Create team member'}
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Role *</label>
              <input name="role" value={form.role} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    // Optionally, show preview
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setForm((prev) => ({ ...prev, image: ev.target.result }));
                    };
                    reader.readAsDataURL(file);
                    // TODO: Replace with upload logic to server/cloudinary if needed
                  }
                }}
                className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70"
              />
              {form.image && (
                <img 
                  src={form.image} 
                  alt="Preview" 
                  className="h-16 w-16 object-cover rounded-full border mt-2 cursor-pointer hover:border-[var(--brand-camel)] transition-colors"
                  onClick={() => openGallery([form.image], 0)}
                  title="Click to preview"
                />
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={2} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Responsibility</label>
              <input name="responsibility" value={form.responsibility} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Address</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Experience</label>
              <input name="experience" value={form.experience} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Education</label>
              <textarea name="education" value={form.education} onChange={handleChange} rows={2} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Specialized Design Areas (%)</label>
              <input name="specializedDesignAreas" type="number" min="0" max="100" value={form.specializedDesignAreas} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Styles And Trends (%)</label>
              <input name="stylesAndTrends" type="number" min="0" max="100" value={form.stylesAndTrends} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Design Principles (%)</label>
              <input name="designPrinciples" type="number" min="0" max="100" value={form.designPrinciples} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Facebook</label>
              <input name="social_facebook" value={form.social_facebook} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">Instagram</label>
              <input name="social_instagram" value={form.social_instagram} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-(--text-primary)">LinkedIn</label>
              <input name="social_linkedin" value={form.social_linkedin} onChange={handleChange} className="w-full rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs text-(--text-primary) outline-none focus:border-amber-500/70" placeholder="https://linkedin.com/..." />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-lg bg-(--brand-camel) px-3 py-1.5 text-xs font-semibold text-(--brand-black) shadow hover:bg-(--brand-camel-dark) disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving…' : editingId ? 'Update member' : 'Create member'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

