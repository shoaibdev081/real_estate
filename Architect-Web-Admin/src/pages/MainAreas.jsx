import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  X,
  MapPin,
  Building,
  Building2,
  CheckCircle2,
  Upload,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Eye,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest, getImageUrl } from '../lib/apiClient';

const CATEGORIES = [
  'Residential Society',
  'Commercial Hub',
  'High-Rise Buildings',
  'Road & Avenue',
  'Other',
];

const EMPTY_FORM = {
  name: '',
  slug: '',
  category: 'Residential Society',
  tagline: '',
  description: '',
  badge: '',
  city: 'Multan',
  image: '',
  features: '',
  order: 0,
  isActive: true,
};

export default function MainAreas() {
  const { token } = useAuth();
  const toast = useToast();

  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Fetch areas from backend
  const fetchAreas = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/main-areas?isAdmin=true&all=true', { token });
      setAreas(res?.data || []);
    } catch (err) {
      toast.showError(err.message || 'Failed to fetch main areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // Filtered list
  const filteredAreas = useMemo(() => {
    return areas.filter((a) => {
      const matchesSearch =
        !search.trim() ||
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.tagline?.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(a.features) &&
          a.features.some((f) => f.toLowerCase().includes(search.toLowerCase())));

      const matchesCat =
        categoryFilter === 'All' || a.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && a.isActive) ||
        (statusFilter === 'inactive' && !a.isActive);

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [areas, search, categoryFilter, statusFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = areas.length;
    const active = areas.filter((a) => a.isActive).length;
    const residential = areas.filter((a) => a.category === 'Residential Society').length;
    const commercialAndHighRise = areas.filter(
      (a) => a.category === 'Commercial Hub' || a.category === 'High-Rise Buildings'
    ).length;
    return { total, active, residential, commercialAndHighRise };
  }, [areas]);

  // Open Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setFormOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (area) => {
    setEditingId(area._id);
    setFormData({
      name: area.name || '',
      slug: area.slug || '',
      category: area.category || 'Residential Society',
      tagline: area.tagline || '',
      description: area.description || '',
      badge: area.badge || '',
      city: area.city || 'Multan',
      image: area.image || '',
      features: Array.isArray(area.features) ? area.features.join(', ') : area.features || '',
      order: area.order || 0,
      isActive: area.isActive !== false,
    });
    setImageFile(null);
    setImagePreview(area.image ? getImageUrl(area.image) : '');
    setFormOpen(true);
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle File Picker
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (id) => {
    try {
      const res = await apiRequest(`/main-areas/${id}/toggle`, {
        method: 'PATCH',
        token,
      });
      toast.showSuccess(res.message || 'Status updated');
      setAreas((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isActive: !a.isActive } : a))
      );
    } catch (err) {
      toast.showError(err.message || 'Failed to toggle status');
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.showError('Area name is required');
      return;
    }

    setSaving(true);
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name.trim());
      if (formData.slug) formPayload.append('slug', formData.slug.trim());
      formPayload.append('category', formData.category);
      formPayload.append('tagline', formData.tagline.trim());
      formPayload.append('description', formData.description.trim());
      formPayload.append('badge', formData.badge.trim());
      formPayload.append('city', formData.city.trim());
      formPayload.append('features', formData.features);
      formPayload.append('order', formData.order);
      formPayload.append('isActive', formData.isActive);

      if (imageFile) {
        formPayload.append('image', imageFile);
      } else if (formData.image) {
        formPayload.append('image', formData.image);
      }

      if (editingId) {
        await apiRequest(`/main-areas/${editingId}`, {
          method: 'PUT',
          body: formPayload,
          token,
        });
        toast.showSuccess('Main area updated successfully!');
      } else {
        await apiRequest('/main-areas', {
          method: 'POST',
          body: formPayload,
          token,
        });
        toast.showSuccess('Main area added successfully!');
      }

      setFormOpen(false);
      fetchAreas();
    } catch (err) {
      toast.showError(err.message || 'Failed to save area');
    } finally {
      setSaving(false);
    }
  };

  // Delete Area
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Main Areas?`)) return;

    try {
      await apiRequest(`/main-areas/${id}`, {
        method: 'DELETE',
        token,
      });
      toast.showSuccess('Area deleted successfully');
      setAreas((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.showError(err.message || 'Failed to delete area');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--brand-camel-dark)">
            <MapPin className="h-4 w-4" />
            <span>Locations & Work Areas</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
            Main Areas Management
          </h1>
          <p className="text-xs text-(--text-muted) mt-0.5">
            Manage operational societies, commercial hubs, high-rise zones, and corridors where Monda Brothers operates.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) px-4 py-2.5 text-xs font-semibold text-(--brand-black) shadow-sm hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Main Area</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-xs">
          <div className="text-[11px] text-(--text-muted) font-medium">Total Areas</div>
          <div className="text-xl font-bold text-(--text-primary) mt-1">{stats.total}</div>
        </div>
        <div className="p-3.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-xs">
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Active on UI</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</div>
        </div>
        <div className="p-3.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-xs">
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Residential Societies</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.residential}</div>
        </div>
        <div className="p-3.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-xs">
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">Commercial & High-Rise</div>
          <div className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">{stats.commercialAndHighRise}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-(--border-subtle) bg-(--surface-card)">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search by area name, society, tagline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary)"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* View Mode Switcher: Table vs Cards */}
          <div className="inline-flex items-center rounded-lg border border-(--border-subtle) bg-(--bg-main) p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-(--brand-camel) text-black font-semibold'
                  : 'text-(--text-muted) hover:text-(--text-primary)'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Cards Grid View"
              className={`p-1 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-(--brand-camel) text-black font-semibold'
                  : 'text-(--text-muted) hover:text-(--text-primary)'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={fetchAreas}
            title="Refresh list"
            className="p-1.5 rounded-lg border border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-elevated)"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Areas Content: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-(--border-subtle) bg-(--surface-card) overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-(--surface-elevated)/90 border-b border-(--border-subtle) text-[11px] font-semibold text-(--text-muted) uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Area / Society</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Tagline / Specs</th>
                  <th className="py-3 px-3">Badge</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right sticky right-0 bg-(--surface-elevated) shadow-[-4px_0_12px_rgba(0,0,0,0.08)] z-20 min-w-[170px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border-subtle)">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-(--text-muted)">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="h-5 w-5 animate-spin text-(--brand-camel)" />
                        <span>Loading main areas...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAreas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-(--text-muted)">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <MapPin className="h-8 w-8 text-(--brand-camel)/40" />
                        <p className="font-medium text-sm text-(--text-primary)">No areas found</p>
                        <p className="text-xs">Adjust search filters or add a new operational area.</p>
                        <button
                          onClick={handleOpenCreate}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs text-(--brand-camel-dark) font-semibold hover:underline"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add New Area
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAreas.map((area) => (
                    <tr
                      key={area._id}
                      className="hover:bg-(--surface-elevated)/50 transition-colors"
                    >
                      {/* Area Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-14 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-(--border-subtle)">
                            {area.image ? (
                              <img
                                src={getImageUrl(area.image)}
                                alt={area.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-(--brand-camel-dark)">
                                <Building2 className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-(--text-primary) block truncate max-w-xs">
                              {area.name}
                            </span>
                            <span className="text-[11px] text-(--text-muted) block truncate">
                              {area.description || 'Turnkey architectural planning and construction'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                            area.category === 'High-Rise Buildings'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                              : area.category === 'Commercial Hub'
                              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
                              : area.category === 'Road & Avenue'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-(--brand-camel)/15 text-(--brand-camel-dark) border-(--brand-camel)/30'
                          }`}
                        >
                          {area.category}
                        </span>
                      </td>

                      {/* Tagline / Specs */}
                      <td className="py-3 px-3 text-(--text-muted) text-[11px] font-mono">
                        {area.tagline || '—'}
                      </td>

                      {/* Badge */}
                      <td className="py-3 px-3">
                        {area.badge ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {area.badge}
                          </span>
                        ) : (
                          <span className="text-[11px] text-(--text-muted) italic">—</span>
                        )}
                      </td>

                      {/* City */}
                      <td className="py-3 px-3 text-[11px] text-(--text-muted)">
                        {area.city || 'Multan'}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleStatus(area._id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                            area.isActive
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-neutral-500/15 text-neutral-500 border border-neutral-500/30'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              area.isActive ? 'bg-emerald-500' : 'bg-neutral-400'
                            }`}
                          />
                          <span>{area.isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* STICKY ACTIONS: EDIT & DELETE ALWAYS PROMINENT */}
                      <td className="py-3 px-4 text-right sticky right-0 bg-(--surface-card) shadow-[-4px_0_12px_rgba(0,0,0,0.08)] z-10 min-w-[170px]">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(area)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-semibold cursor-pointer transition-all shadow-xs"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(area._id, area.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold cursor-pointer transition-all shadow-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW - EDIT AND DELETE FULLY VISIBLE ON EVERY CARD */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-(--text-muted)">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-(--brand-camel) mb-2" />
              <span>Loading areas...</span>
            </div>
          ) : filteredAreas.length === 0 ? (
            <div className="col-span-full py-12 text-center text-(--text-muted)">
              No areas found matching filters.
            </div>
          ) : (
            filteredAreas.map((area) => (
              <div
                key={area._id}
                className="rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-4 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-(--brand-camel)/15 text-(--brand-camel-dark)">
                      {area.category}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(area._id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        area.isActive
                          ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                          : 'bg-neutral-500/15 text-neutral-500 border border-neutral-500/30'
                      }`}
                    >
                      {area.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-(--text-primary)">{area.name}</h3>
                  {area.tagline && (
                    <p className="text-[11px] text-(--brand-camel-dark) font-mono mt-0.5">
                      {area.tagline}
                    </p>
                  )}
                  {area.description && (
                    <p className="text-xs text-(--text-muted) line-clamp-2 mt-2">
                      {area.description}
                    </p>
                  )}
                </div>

                {/* Big Prominent Edit and Delete Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-(--border-subtle)">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(area)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-semibold cursor-pointer transition-all"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Area</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(area._id, area.name)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold cursor-pointer transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Area</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-(--border-subtle) bg-(--surface-card) shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--border-subtle) bg-(--surface-elevated)">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-(--brand-camel)/20 text-(--brand-camel-dark)">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-(--text-primary)">
                    {editingId ? 'Edit Main Area' : 'Add New Operational Area'}
                  </h2>
                  <p className="text-[11px] text-(--text-muted)">
                    Society, commercial hub, or high-rise development area where Monda Brothers operates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--border-subtle)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Area / Society Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Wapda Town Phase # 1, 2"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline & Badge */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Tagline / Phase / Specs
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    placeholder="e.g. Phase # 1, 2 or 7 Story max"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    name="badge"
                    placeholder="e.g. 7-Story Max, Flagship Hub"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Multan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                  Description / Architectural Scope
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the architectural projects, luxury villas, or commercial plazas handled in this area..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                />
              </div>

              {/* Features / Highlights */}
              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                  Key Services & Features (comma separated)
                </label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="Luxury Villas, Modern Elevations, Approval Consultancy, Turnkey Build"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                />
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                  Cover Photo / Representative Project Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {imagePreview ? (
                    <div className="relative h-20 w-32 rounded-xl overflow-hidden border border-(--border-subtle) bg-neutral-900 shrink-0">
                      <img
                        src={imagePreview}
                        alt="Area Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setFormData((p) => ({ ...p, image: '' }));
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="h-20 w-32 rounded-xl border border-dashed border-(--border-subtle) flex flex-col items-center justify-center gap-1 text-(--text-muted) hover:border-(--brand-camel) hover:text-(--text-primary) transition-colors cursor-pointer bg-(--bg-main) shrink-0"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-[10px]">Upload Image</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg border border-(--border-subtle) text-xs font-medium text-(--text-primary) hover:bg-(--surface-elevated)"
                      >
                        Choose File from Laptop
                      </button>
                      <span className="text-[11px] text-(--text-muted)">or paste Image URL:</span>
                    </div>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, image: e.target.value }));
                        if (!imageFile) setImagePreview(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                    />
                  </div>
                </div>
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-(--border-subtle)">
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Display Order (Priority)
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="relative flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="rounded border-(--border-subtle) text-(--brand-camel) focus:ring-(--brand-camel) h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-(--text-primary)">
                      Active (Visible on Website)
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--border-subtle)">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) px-5 py-2 text-xs font-semibold text-(--brand-black) hover:brightness-110 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : editingId ? 'Update Area' : 'Save Area'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
