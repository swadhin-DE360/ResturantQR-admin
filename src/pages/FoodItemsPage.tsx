import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import initialFoodItems from '@/data/food-items.json';
import categoriesData from '@/data/categories.json';
import { FoodItem, FoodItemFormData, Category } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils';

// Curated preset food images for rapid testing and selection
const PRESET_FOOD_IMAGES = [
  {
    name: 'Prime Steak',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Artisan Pizza',
    url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Truffle Pasta',
    url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Seafood Paella',
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Burrata Caprese',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tiramisu',
    url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cocktail',
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&auto=format&fit=crop&q=80',
  },
];

export const FoodItemsPage: React.FC = () => {
  // Available categories from static categories.json
  const categoriesList: Category[] = categoriesData as Category[];

  // In-memory food items list initialized from static food-items.json
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems as FoodItem[]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState<'ALL' | 'Available' | 'Unavailable'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'Active' | 'Inactive'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<FoodItem | null>(null);

  // Form State & Errors
  const [formData, setFormData] = useState<FoodItemFormData>({
    name: '',
    description: '',
    categoryId: categoriesList[0]?.id || '',
    categoryName: categoriesList[0]?.name || '',
    image: '',
    price: '',
    availability: 'Available',
    status: 'Active',
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
    categoryId?: string;
    price?: string;
    image?: string;
  }>({});

  // Reset form helper
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: categoriesList[0]?.id || '',
      categoryName: categoriesList[0]?.name || '',
      image: '',
      price: '',
      availability: 'Available',
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
  const handleOpenEditModal = (item: FoodItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      image: item.image,
      price: item.price.toString(),
      availability: item.availability,
      status: item.status,
    });
    setFormErrors({});
    setEditingItem(item);
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      description?: string;
      categoryId?: string;
      price?: string;
      image?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = 'Dish name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Dish name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Please select a valid menu category';
    }

    const parsedPrice = parseFloat(formData.price.toString());
    if (!formData.price.toString().trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Price must be a positive number greater than 0';
    }

    if (!formData.image.trim()) {
      errors.image = 'Dish image URL is required';
    } else if (!formData.image.startsWith('http://') && !formData.image.startsWith('https://')) {
      errors.image = 'Must be a valid web URL starting with https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create Food Item
  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const matchedCategory = categoriesList.find((c) => c.id === formData.categoryId);

    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      categoryId: formData.categoryId,
      categoryName: matchedCategory?.name || formData.categoryName,
      image: formData.image.trim(),
      price: parseFloat(formData.price.toString()),
      availability: formData.availability,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setFoodItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    resetForm();
    toast.success(`"${newItem.name}" added to menu!`);
  };

  // Update Food Item
  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !validateForm()) return;

    const matchedCategory = categoriesList.find((c) => c.id === formData.categoryId);

    setFoodItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name.trim(),
              description: formData.description.trim(),
              categoryId: formData.categoryId,
              categoryName: matchedCategory?.name || formData.categoryName,
              image: formData.image.trim(),
              price: parseFloat(formData.price.toString()),
              availability: formData.availability,
              status: formData.status,
            }
          : item
      )
    );

    setEditingItem(null);
    resetForm();
    toast.success(`"${formData.name}" updated successfully!`);
  };

  // Delete Food Item
  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    setFoodItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
    toast.success(`"${deletingItem.name}" removed from menu.`);
    setDeletingItem(null);
  };

  // Toggle Availability (Available / Unavailable)
  const handleToggleAvailability = (item: FoodItem) => {
    const nextAvailability = item.availability === 'Available' ? 'Unavailable' : 'Available';
    setFoodItems((prev) =>
      prev.map((dish) => (dish.id === item.id ? { ...dish, availability: nextAvailability } : dish))
    );
    toast.success(
      `"${item.name}" is now ${nextAvailability === 'Available' ? 'In Stock (Available)' : '86ed (Unavailable)'}`,
      {
        icon: nextAvailability === 'Available' ? '✅' : '⛔',
      }
    );
  };

  // Toggle Status (Active / Inactive)
  const handleToggleStatus = (item: FoodItem) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    setFoodItems((prev) =>
      prev.map((dish) => (dish.id === item.id ? { ...dish, status: nextStatus } : dish))
    );
    toast.success(`"${item.name}" marked ${nextStatus}`);
  };

  // Filtered & Sorted Food Items
  const filteredFoodItems = useMemo(() => {
    return foodItems
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategoryFilter === 'ALL' || item.categoryId === selectedCategoryFilter;

        const matchesAvailability =
          selectedAvailabilityFilter === 'ALL' || item.availability === selectedAvailabilityFilter;

        const matchesStatus =
          selectedStatusFilter === 'ALL' || item.status === selectedStatusFilter;

        return matchesSearch && matchesCategory && matchesAvailability && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.price - b.price;
        return b.price - a.price;
      });
  }, [
    foodItems,
    searchQuery,
    selectedCategoryFilter,
    selectedAvailabilityFilter,
    selectedStatusFilter,
    sortOrder,
  ]);

  // Metric stats
  const totalItemsCount = foodItems.length;
  const availableCount = foodItems.filter((i) => i.availability === 'Available').length;
  const unavailableCount = foodItems.filter((i) => i.availability === 'Unavailable').length;
  const avgPrice =
    totalItemsCount > 0
      ? foodItems.reduce((acc, curr) => acc + curr.price, 0) / totalItemsCount
      : 0;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER & METRIC SUMMARY
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kitchen Inventory & Menu Catalog</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Food Items Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Control dish pricing, stock availability, category assignments, and descriptions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Food Item
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Food Items
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#F47738]">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalItemsCount}</p>
          <span className="text-[11px] text-slate-400">Registered across all categories</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Available (In Stock)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{availableCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for guest orders</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Unavailable (86ed)
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{unavailableCount}</p>
          <span className="text-[11px] text-rose-600 font-medium">Out of ingredients</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Average Dish Price
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{formatCurrency(avgPrice)}</p>
          <span className="text-[11px] text-slate-400">Across menu catalog</span>
        </Card>
      </div>

      {/* =========================================================================
          CONTROLS: Search, Category Filter, Availability Filter & View Mode
         ========================================================================= */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by food name, description..."
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

          {/* Filters Suite */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Dropdown Filter */}
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738]"
              >
                <option value="ALL">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['ALL', 'Available', 'Unavailable'] as const).map((avail) => (
                <button
                  key={avail}
                  type="button"
                  onClick={() => setSelectedAvailabilityFilter(avail)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedAvailabilityFilter === avail
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {avail}
                </button>
              ))}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl hidden sm:flex">
              {(['ALL', 'Active', 'Inactive'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedStatusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 transition-colors"
              title={`Sort by Price (${sortOrder === 'asc' ? 'Low to High' : 'High to Low'})`}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#F47738]" />
              <span className="hidden md:inline font-medium">
                {sortOrder === 'asc' ? 'Price: Low' : 'Price: High'}
              </span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          FOOD ITEMS LISTING: Table or Grid
         ========================================================================= */}
      {filteredFoodItems.length === 0 ? (
        <EmptyState
          title="No food items found"
          description={
            searchQuery || selectedCategoryFilter !== 'ALL' || selectedAvailabilityFilter !== 'ALL'
              ? 'No dishes match your active search and filter criteria. Try resetting filters.'
              : 'No menu items exist yet. Add your first culinary dish.'
          }
          icon={<UtensilsCrossed className="w-8 h-8 text-[#F47738]" />}
          actionText={
            searchQuery || selectedCategoryFilter !== 'ALL' || selectedAvailabilityFilter !== 'ALL'
              ? 'Clear All Filters'
              : 'Add First Dish'
          }
          onAction={() => {
            if (
              searchQuery ||
              selectedCategoryFilter !== 'ALL' ||
              selectedAvailabilityFilter !== 'ALL'
            ) {
              setSearchQuery('');
              setSelectedCategoryFilter('ALL');
              setSelectedAvailabilityFilter('ALL');
              setSelectedStatusFilter('ALL');
            } else {
              handleOpenAddModal();
            }
          }}
        />
      ) : viewMode === 'table' ? (
        /* PROFESSIONAL TABLE VIEW WITH IMAGE THUMBNAILS */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3 px-4">Dish Thumbnail</th>
                  <th scope="col" className="py-3 px-4">Dish Details</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Price</th>
                  <th scope="col" className="py-3 px-4">Availability</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoodItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Thumbnail Image */}
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                    </td>

                    {/* Dish Name & Description */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                        ID: {item.id} • Added {item.createdAt}
                      </span>
                    </td>

                    {/* Category Badge */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-[#F47738] border border-orange-100">
                        {item.categoryName}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatCurrency(item.price)}
                      </span>
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          item.availability === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle stock availability"
                      >
                        {item.availability === 'Available' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className="cursor-pointer"
                        title="Click to toggle Active / Inactive"
                      >
                        <Badge variant={item.status === 'Active' ? 'default' : 'danger'}>
                          {item.status}
                        </Badge>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(item)}
                          className="text-xs text-slate-600 hover:text-slate-900"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingItem(item)}
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
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFoodItems.map((item) => (
            <Card
              key={item.id}
              className="group hover:border-slate-300 transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden bg-white"
            >
              <div>
                {/* Image & Overlay Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${
                        item.availability === 'Available'
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-rose-600 text-white border-rose-500'
                      }`}
                    >
                      {item.availability}
                    </span>
                    <Badge variant={item.status === 'Active' ? 'default' : 'danger'}>
                      {item.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-orange-200 truncate drop-shadow-sm">
                      {item.categoryName}
                    </span>
                    <span className="text-base font-extrabold text-white drop-shadow-sm">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleAvailability(item)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors ${
                    item.availability === 'Available'
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50/60'
                      : 'border-rose-200 text-rose-700 bg-rose-50/60'
                  }`}
                >
                  {item.availability === 'Available' ? 'Mark Out of Stock' : 'Mark Available'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                    title="Edit item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* =========================================================================
          ADD / EDIT FOOD ITEM MODAL
         ========================================================================= */}
      <Modal
        isOpen={isAddModalOpen || !!editingItem}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
          resetForm();
        }}
        title={editingItem ? 'Edit Food Item' : 'Add New Food Item'}
        description={
          editingItem
            ? `Modify pricing, description, and status for "${editingItem.name}"`
            : 'Register a new recipe dish to your restaurant menu catalog.'
        }
        maxWidth="lg"
      >
        <form
          onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
          noValidate
          className="space-y-4"
        >
          {/* Dish Name */}
          <Input
            label="Food Item Name"
            name="name"
            placeholder="e.g. Truffle Ribeye Steak, Wood-fired Diavola"
            required
            value={formData.name}
            error={formErrors.name}
            onChange={(e) => {
              setFormData((p) => ({ ...p, name: e.target.value }));
              if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
            }}
          />

          {/* Category Dropdown & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label htmlFor="categoryId" className="block text-xs font-semibold text-slate-800">
                Menu Category <span className="text-[#F47738]">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) => {
                  const selCat = categoriesList.find((c) => c.id === e.target.value);
                  setFormData((p) => ({
                    ...p,
                    categoryId: e.target.value,
                    categoryName: selCat?.name || '',
                  }));
                  if (formErrors.categoryId) {
                    setFormErrors((p) => ({ ...p, categoryId: undefined }));
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738]"
              >
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && (
                <p className="text-[11px] text-rose-600 font-medium">{formErrors.categoryId}</p>
              )}
            </div>

            {/* Price Input */}
            <Input
              label="Price ($ USD)"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 24.50"
              required
              value={formData.price}
              error={formErrors.price}
              leftIcon={<DollarSign className="w-4 h-4" />}
              onChange={(e) => {
                setFormData((p) => ({ ...p, price: e.target.value }));
                if (formErrors.price) setFormErrors((p) => ({ ...p, price: undefined }));
              }}
            />
          </div>

          {/* Description */}
          <Textarea
            label="Dish Description & Ingredients"
            name="description"
            placeholder="Key ingredients, allergens, preparation style, and flavor profile..."
            required
            value={formData.description}
            error={formErrors.description}
            onChange={(e) => {
              setFormData((p) => ({ ...p, description: e.target.value }));
              if (formErrors.description) setFormErrors((p) => ({ ...p, description: undefined }));
            }}
          />

          {/* Image URL & Preset Selection */}
          <div className="space-y-2">
            <Input
              label="Dish Photo URL"
              name="image"
              placeholder="https://images.unsplash.com/photo-..."
              required
              value={formData.image}
              error={formErrors.image}
              leftIcon={<ImageIcon className="w-4 h-4" />}
              onChange={(e) => {
                setFormData((p) => ({ ...p, image: e.target.value }));
                if (formErrors.image) setFormErrors((p) => ({ ...p, image: undefined }));
              }}
            />

            {/* Quick Presets */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-500">
                Or pick from culinary food presets:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {PRESET_FOOD_IMAGES.map((preset) => (
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

            {/* Live Image Preview */}
            {formData.image && (
              <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Dish Live Preview:
                </span>
                <div className="h-36 w-full rounded-lg overflow-hidden bg-slate-200 relative">
                  <img
                    src={formData.image}
                    alt="Food item preview"
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

          {/* Availability and Status Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Availability Radio */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Kitchen Stock Availability
              </label>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="availability"
                    value="Available"
                    checked={formData.availability === 'Available'}
                    onChange={() => setFormData((p) => ({ ...p, availability: 'Available' }))}
                    className="text-[#F47738] focus:ring-[#F47738]"
                  />
                  <span className="text-emerald-700 font-semibold">Available (In Stock)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="availability"
                    value="Unavailable"
                    checked={formData.availability === 'Unavailable'}
                    onChange={() => setFormData((p) => ({ ...p, availability: 'Unavailable' }))}
                    className="text-[#F47738] focus:ring-[#F47738]"
                  />
                  <span className="text-rose-700 font-semibold">Unavailable (Out of Stock)</span>
                </label>
              </div>
            </div>

            {/* Status Radio */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Menu Visibility Status
              </label>
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={() => setFormData((p) => ({ ...p, status: 'Active' }))}
                    className="text-[#F47738] focus:ring-[#F47738]"
                  />
                  <span>Active (Live on Menu)</span>
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
                  <span>Inactive (Draft / Archived)</span>
                </label>
              </div>
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
                setEditingItem(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingItem ? 'Save Changes' : 'Add Food Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
         ========================================================================= */}
      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title="Delete Food Item"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingItem(null)}
            >
              Cancel
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
              Are you sure you want to delete "{deletingItem?.name}"?
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This dish will be removed from your active restaurant menu.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-[11px] text-rose-800 font-medium">
              Category: <span className="font-semibold">{deletingItem?.categoryName}</span> • Price:{' '}
              <span className="font-semibold">{deletingItem && formatCurrency(deletingItem.price)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FoodItemsPage;
