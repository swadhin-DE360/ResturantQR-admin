import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Calendar,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import initialCategories from '@/data/categories.json';
import { Category, CategoryFormData } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/common/EmptyState';

// Curated preset imagery for rapid selection
const PRESET_IMAGES = [
  {
    name: 'Pizza & Flatbreads',
    url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Steaks & Meats',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fresh Pasta',
    url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Seafood Catch',
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Appetizers & Tapas',
    url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Desserts & Sweets',
    url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80',
  },
];

export const CategoriesPage: React.FC = () => {
  // State: In-memory categories list initialized from static categories.json
  const [categories, setCategories] = useState<Category[]>(initialCategories as Category[]);

  // State: Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // State: Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // State: Form Data & Validation
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image: '',
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; description?: string; image?: string }>({});

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      status: 'Active',
    });
    setFormErrors({});
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat: Category) => {
    setFormData({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      status: cat.status,
    });
    setFormErrors({});
    setEditingCategory(cat);
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: { name?: string; description?: string; image?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }

    if (!formData.image.trim()) {
      errors.image = 'Image URL is required';
    } else if (!formData.image.startsWith('http://') && !formData.image.startsWith('https://')) {
      errors.image = 'Must be a valid web URL starting with https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCategories((prev) => [newCategory, ...prev]);
    setIsAddModalOpen(false);
    resetForm();
    toast.success(`Category "${newCategory.name}" added successfully!`);
  };

  // Update Category
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !validateForm()) return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: formData.name.trim(),
              description: formData.description.trim(),
              image: formData.image.trim(),
              status: formData.status,
            }
          : cat
      )
    );

    setIsAddModalOpen(false);
    setEditingCategory(null);
    resetForm();
    toast.success(`Category "${formData.name}" updated successfully!`);
  };

  // Delete Category
  const handleConfirmDelete = () => {
    if (!deletingCategory) return;

    setCategories((prev) => prev.filter((cat) => cat.id !== deletingCategory.id));
    toast.success(`Category "${deletingCategory.name}" deleted.`);
    setDeletingCategory(null);
  };

  // Quick Status Toggle
  const handleToggleStatus = (category: Category) => {
    const nextStatus = category.status === 'Active' ? 'Inactive' : 'Active';
    setCategories((prev) =>
      prev.map((cat) => (cat.id === category.id ? { ...cat, status: nextStatus } : cat))
    );
    toast.success(`"${category.name}" is now ${nextStatus}`);
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'All' || cat.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [categories, searchQuery, filterStatus]);

  // Statistics
  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.status === 'Active').length;
  const inactiveCount = categories.filter((c) => c.status === 'Inactive').length;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER & METRIC SUMMARY
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Menu Taxonomy & Sections</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Food Categories</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, categorize, and organize your restaurant menu courses and sections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Category
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Categories
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#F47738]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400">All registered sections</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Sections
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{activeCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Visible to digital menu</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Inactive / Archived
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{inactiveCount}</p>
          <span className="text-[11px] text-slate-400">Hidden from customers</span>
        </Card>
      </div>

      {/* =========================================================================
          CONTROLS: Search, Filters & View Toggle
         ========================================================================= */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by category name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filters & View Mode */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['All', 'Active', 'Inactive'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    filterStatus === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Card View"
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table List View"
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          CATEGORY LISTING: Grid or Table
         ========================================================================= */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          title="No food categories found"
          description={
            searchQuery || filterStatus !== 'All'
              ? `No categories match your criteria "${searchQuery || filterStatus}". Try clearing your filters.`
              : 'You have not created any food categories yet. Start by adding your first menu section.'
          }
          icon={<Layers className="w-8 h-8 text-[#F47738]" />}
          actionText={searchQuery || filterStatus !== 'All' ? 'Reset Filters' : 'Add First Category'}
          onAction={() => {
            if (searchQuery || filterStatus !== 'All') {
              setSearchQuery('');
              setFilterStatus('All');
            } else {
              handleOpenAddModal();
            }
          }}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCategories.map((cat) => (
            <Card
              key={cat.id}
              className="group hover:border-slate-300 transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Category Image Cover */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image if broken
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Top Status Pill */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={cat.status === 'Active' ? 'success' : 'default'}>
                      {cat.status}
                    </Badge>
                  </div>

                  {/* Title overlay at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base font-bold text-white drop-shadow-sm leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Content description */}
                <div className="p-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      Created {cat.createdAt}
                    </span>
                    <span className="font-mono text-slate-400">ID: {cat.id}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Actions Footer */}
              <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-1">
                {/* Toggle Status Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(cat)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                    cat.status === 'Active'
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/60'
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-100'
                  }`}
                  title="Toggle Active / Inactive"
                >
                  {cat.status === 'Active' ? 'Active' : 'Inactive'}
                </button>

                <div className="flex items-center gap-1">
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(cat)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3 px-4">Category Preview</th>
                  <th scope="col" className="py-3 px-4">Name</th>
                  <th scope="col" className="py-3 px-4">Description</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Created Date</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{cat.name}</div>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        {cat.id}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-slate-600 max-w-sm truncate">
                      {cat.description}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cat)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <Badge variant={cat.status === 'Active' ? 'success' : 'default'}>
                          {cat.status}
                        </Badge>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-slate-500">{cat.createdAt}</td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(cat)}
                          className="text-xs text-slate-600 hover:text-slate-900"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingCategory(cat)}
                          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* =========================================================================
          ADD / EDIT CATEGORY MODAL
         ========================================================================= */}
      <Modal
        isOpen={isAddModalOpen || !!editingCategory}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCategory(null);
          resetForm();
        }}
        title={editingCategory ? 'Edit Food Category' : 'Create Food Category'}
        description={
          editingCategory
            ? `Modify details and presentation for "${editingCategory.name}"`
            : 'Add a new course or dining section to organize your menu items.'
        }
        maxWidth="lg"
      >
        <form
          id="category-form"
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          noValidate
          className="space-y-4"
        >
          {/* Category Name */}
          <Input
            label="Category Name"
            name="name"
            placeholder="e.g. Wood-fired Pizza, Chef Specials"
            required
            value={formData.name}
            error={formErrors.name}
            onChange={(e) => {
              setFormData((p) => ({ ...p, name: e.target.value }));
              if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
            }}
          />

          {/* Description */}
          <Textarea
            label="Description"
            name="description"
            placeholder="Describe the dishes in this section, cooking style or dietary notes..."
            required
            value={formData.description}
            error={formErrors.description}
            onChange={(e) => {
              setFormData((p) => ({ ...p, description: e.target.value }));
              if (formErrors.description) setFormErrors((p) => ({ ...p, description: undefined }));
            }}
          />

          {/* Image URL & Quick Presets */}
          <div className="space-y-2">
            <Input
              label="Cover Image URL"
              name="image"
              placeholder="https://images.unsplash.com/..."
              required
              value={formData.image}
              error={formErrors.image}
              leftIcon={<ImageIcon className="w-4 h-4" />}
              onChange={(e) => {
                setFormData((p) => ({ ...p, image: e.target.value }));
                if (formErrors.image) setFormErrors((p) => ({ ...p, image: undefined }));
              }}
            />

            {/* Quick Pick Presets */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-500">
                Or choose from culinary presets:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, image: preset.url }));
                      if (formErrors.image) setFormErrors((p) => ({ ...p, image: undefined }));
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                      formData.image === preset.url
                        ? 'bg-orange-50 border-[#F47738] text-[#F47738] font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE IMAGE PREVIEW */}
            {formData.image && (
              <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Live Image Preview:
                </span>
                <div className="h-36 w-full rounded-lg overflow-hidden bg-slate-200 relative">
                  <img
                    src={formData.image}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                    Preview Verified
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status radio / toggle */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Category Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={() => setFormData((p) => ({ ...p, status: 'Active' }))}
                  className="text-[#F47738] focus:ring-[#F47738]"
                />
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active (Visible)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={() => setFormData((p) => ({ ...p, status: 'Inactive' }))}
                  className="text-[#F47738] focus:ring-[#F47738]"
                />
                <span className="inline-flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  Inactive (Draft / Archived)
                </span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingCategory(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
         ========================================================================= */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Delete Category"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingCategory(null)}
            >
              Keep Category
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Confirm Delete
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Are you sure you want to delete "{deletingCategory?.name}"?
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This will remove the category from your in-memory list. Associated menu items will no longer be grouped under this section.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-[11px] text-rose-800 font-medium">
              Note: This action only modifies the current application memory.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
