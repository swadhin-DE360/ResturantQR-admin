import React, { useState } from 'react';
import {
  Store,
  User,
  Lock,
  Mail,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Save,
  Eye,
  EyeOff,
  ChefHat,
  ShieldCheck,
  Building2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import initialSettings from '@/data/settings.json';
import { RestaurantProfileData, AdminProfileData, PasswordChangeData } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

// Curated preset logos and chef portrait avatars for rapid selection
const PRESET_LOGOS = [
  {
    name: 'Bistro Interior',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=250&auto=format&fit=crop&q=80',
  },
  {
    name: 'Artisan Oven',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=250&auto=format&fit=crop&q=80',
  },
  {
    name: 'Wine & Dining',
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=250&auto=format&fit=crop&q=80',
  },
];

const PRESET_AVATARS = [
  {
    name: 'Executive Chef',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=250&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kitchen Director',
    url: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=250&auto=format&fit=crop&q=80',
  },
  {
    name: 'Floor Manager',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  },
];

export const SettingsPage: React.FC = () => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'ALL' | 'RESTAURANT' | 'ADMIN' | 'PASSWORD'>('ALL');

  // Section 1: Restaurant Profile State
  const [restaurantData, setRestaurantData] = useState<RestaurantProfileData>(
    initialSettings.restaurantProfile as RestaurantProfileData
  );
  const [restaurantErrors, setRestaurantErrors] = useState<Partial<Record<keyof RestaurantProfileData, string>>>({});

  // Section 2: Administrator Profile State
  const [adminData, setAdminData] = useState<AdminProfileData>(
    initialSettings.adminProfile as AdminProfileData
  );
  const [adminErrors, setAdminErrors] = useState<Partial<Record<keyof AdminProfileData, string>>>({});

  // Section 3: Change Password State
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Show/hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation helpers
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Handle Restaurant Profile Save
  const handleSaveRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<Record<keyof RestaurantProfileData, string>> = {};

    if (!restaurantData.restaurantName.trim()) {
      errors.restaurantName = 'Restaurant name is required';
    } else if (restaurantData.restaurantName.trim().length < 2) {
      errors.restaurantName = 'Name must be at least 2 characters';
    }

    if (!restaurantData.email.trim()) {
      errors.email = 'Restaurant email is required';
    } else if (!isValidEmail(restaurantData.email)) {
      errors.email = 'Please provide a valid email format';
    }

    if (!restaurantData.contactNumber.trim()) {
      errors.contactNumber = 'Contact phone number is required';
    }

    if (!restaurantData.address.trim()) {
      errors.address = 'Physical dining address is required';
    }

    if (!restaurantData.logo.trim()) {
      errors.logo = 'Logo URL is required';
    }

    setRestaurantErrors(errors);

    if (Object.keys(errors).length === 0) {
      toast.success('Restaurant profile settings saved in memory!', { icon: '🏢' });
    } else {
      toast.error('Please fix validation errors in Restaurant Profile');
    }
  };

  // Handle Administrator Profile Save
  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<Record<keyof AdminProfileData, string>> = {};

    if (!adminData.name.trim()) {
      errors.name = 'Administrator name is required';
    } else if (adminData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!adminData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!isValidEmail(adminData.email)) {
      errors.email = 'Please provide a valid email format';
    }

    if (!adminData.profileImage.trim()) {
      errors.profileImage = 'Profile portrait image URL is required';
    }

    setAdminErrors(errors);

    if (Object.keys(errors).length === 0) {
      toast.success('Administrator profile updated in memory!', { icon: '🧑‍🍳' });
    } else {
      toast.error('Please fix validation errors in Administrator Profile');
    }
  };

  // Handle Password Change Save
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Enter your current password';
    } else if (passwordData.currentPassword !== 'AdminPassword123!') {
      errors.currentPassword = 'Current password does not match registered password (hint: AdminPassword123!)';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Confirm your new password';
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully in application memory!', { icon: '🔑' });
    } else {
      toast.error('Please fix password validation issues');
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER & SECTION TABS
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Configuration & Identity</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure restaurant identity, manager contact info, and security credentials.
          </p>
        </div>

        {/* Section View Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RESTAURANT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'RESTAURANT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Restaurant
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ADMIN')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'ADMIN'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Administrator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PASSWORD')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'PASSWORD'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Password
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: RESTAURANT PROFILE
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'RESTAURANT') && (
        <Card className="bg-white border border-slate-200/90 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F47738] flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Restaurant Profile</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Public restaurant branding, guest contact details, and location
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#F47738] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
              Branch Active
            </span>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSaveRestaurant} noValidate className="space-y-5">
              {/* Logo Preview & Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
                {/* Logo Image Preview */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs relative shrink-0">
                  <img
                    src={restaurantData.logo}
                    alt="Restaurant Logo Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=250&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute bottom-1 inset-x-1 bg-black/60 text-[9px] text-white text-center py-0.5 rounded backdrop-blur-xs font-medium">
                    Logo Preview
                  </div>
                </div>

                {/* Logo Input & Presets */}
                <div className="flex-1 w-full space-y-2">
                  <Input
                    label="Restaurant Logo Image URL"
                    name="logo"
                    placeholder="https://images.unsplash.com/..."
                    required
                    value={restaurantData.logo}
                    error={restaurantErrors.logo}
                    leftIcon={<ImageIcon className="w-4 h-4" />}
                    onChange={(e) => {
                      setRestaurantData((p) => ({ ...p, logo: e.target.value }));
                      if (restaurantErrors.logo) setRestaurantErrors((p) => ({ ...p, logo: undefined }));
                    }}
                  />

                  {/* Preset Logos */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">Presets:</span>
                    {PRESET_LOGOS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setRestaurantData((p) => ({ ...p, logo: preset.url }));
                          if (restaurantErrors.logo) setRestaurantErrors((p) => ({ ...p, logo: undefined }));
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                          restaurantData.logo === preset.url
                            ? 'bg-orange-50 border-[#F47738] text-[#F47738] font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Restaurant Name & Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Restaurant Name"
                  name="restaurantName"
                  placeholder="e.g. The Grand Bistro"
                  required
                  value={restaurantData.restaurantName}
                  error={restaurantErrors.restaurantName}
                  leftIcon={<Building2 className="w-4 h-4" />}
                  onChange={(e) => {
                    setRestaurantData((p) => ({ ...p, restaurantName: e.target.value }));
                    if (restaurantErrors.restaurantName) {
                      setRestaurantErrors((p) => ({ ...p, restaurantName: undefined }));
                    }
                  }}
                />

                <Input
                  label="Contact Phone Number"
                  name="contactNumber"
                  type="tel"
                  placeholder="+1 (555) 234-8901"
                  required
                  value={restaurantData.contactNumber}
                  error={restaurantErrors.contactNumber}
                  leftIcon={<Phone className="w-4 h-4" />}
                  onChange={(e) => {
                    setRestaurantData((p) => ({ ...p, contactNumber: e.target.value }));
                    if (restaurantErrors.contactNumber) {
                      setRestaurantErrors((p) => ({ ...p, contactNumber: undefined }));
                    }
                  }}
                />
              </div>

              {/* Email & Currency Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Official Email Address"
                  name="email"
                  type="email"
                  placeholder="contact@thegrandbistro.com"
                  required
                  value={restaurantData.email}
                  error={restaurantErrors.email}
                  leftIcon={<Mail className="w-4 h-4" />}
                  onChange={(e) => {
                    setRestaurantData((p) => ({ ...p, email: e.target.value }));
                    if (restaurantErrors.email) {
                      setRestaurantErrors((p) => ({ ...p, email: undefined }));
                    }
                  }}
                />

                <Input
                  label="Floor Base Currency"
                  name="currency"
                  disabled
                  value="USD ($) - United States Dollar"
                  helperText="Configured in constants"
                />
              </div>

              {/* Address Textarea */}
              <Textarea
                label="Physical Dining Address"
                name="address"
                placeholder="742 Evergreen Terrace, Suite 100, San Francisco, CA 94103"
                required
                value={restaurantData.address}
                error={restaurantErrors.address}
                helperText="Printed on guest table receipts and invoices"
                onChange={(e) => {
                  setRestaurantData((p) => ({ ...p, address: e.target.value }));
                  if (restaurantErrors.address) {
                    setRestaurantErrors((p) => ({ ...p, address: undefined }));
                  }
                }}
              />

              {/* Submit Action */}
              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                  Save Restaurant Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          SECTION 2: ADMINISTRATOR PROFILE
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'ADMIN') && (
        <Card className="bg-white border border-slate-200/90 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Administrator Profile</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  General manager and executive administrator credentials
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Super Admin
            </span>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSaveAdmin} noValidate className="space-y-5">
              {/* Profile Image Preview & URL */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
                {/* Avatar Preview */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-[#F47738] p-0.5 shadow-sm relative shrink-0">
                  <img
                    src={adminData.profileImage}
                    alt="Administrator Avatar"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=250&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Avatar Input & Presets */}
                <div className="flex-1 w-full space-y-2">
                  <Input
                    label="Administrator Photo URL"
                    name="profileImage"
                    placeholder="https://images.unsplash.com/..."
                    required
                    value={adminData.profileImage}
                    error={adminErrors.profileImage}
                    leftIcon={<ImageIcon className="w-4 h-4" />}
                    onChange={(e) => {
                      setAdminData((p) => ({ ...p, profileImage: e.target.value }));
                      if (adminErrors.profileImage) {
                        setAdminErrors((p) => ({ ...p, profileImage: undefined }));
                      }
                    }}
                  />

                  {/* Preset Avatars */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">Presets:</span>
                    {PRESET_AVATARS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setAdminData((p) => ({ ...p, profileImage: preset.url }));
                          if (adminErrors.profileImage) {
                            setAdminErrors((p) => ({ ...p, profileImage: undefined }));
                          }
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                          adminData.profileImage === preset.url
                            ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Administrator Full Name"
                  name="name"
                  placeholder="e.g. Alessandro Rossi"
                  required
                  value={adminData.name}
                  error={adminErrors.name}
                  leftIcon={<User className="w-4 h-4" />}
                  onChange={(e) => {
                    setAdminData((p) => ({ ...p, name: e.target.value }));
                    if (adminErrors.name) setAdminErrors((p) => ({ ...p, name: undefined }));
                  }}
                />

                <Input
                  label="Operational Role"
                  name="role"
                  placeholder="e.g. Executive Chef & Owner"
                  value={adminData.role}
                  leftIcon={<ChefHat className="w-4 h-4" />}
                  onChange={(e) => setAdminData((p) => ({ ...p, role: e.target.value }))}
                />
              </div>

              {/* Email */}
              <Input
                label="Admin Sign-in Email"
                name="email"
                type="email"
                placeholder="admin@chefdesk.com"
                required
                value={adminData.email}
                error={adminErrors.email}
                leftIcon={<Mail className="w-4 h-4" />}
                onChange={(e) => {
                  setAdminData((p) => ({ ...p, email: e.target.value }));
                  if (adminErrors.email) setAdminErrors((p) => ({ ...p, email: undefined }));
                }}
              />

              {/* Submit Action */}
              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                  Save Administrator Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          SECTION 3: CHANGE PASSWORD
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'PASSWORD') && (
        <Card className="bg-white border border-slate-200/90 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Change Password</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your console access credentials and authentication security
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Encrypted
            </span>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSavePassword} noValidate className="max-w-xl space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Current Password <span className="text-[#F47738]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter existing password"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData((p) => ({ ...p, currentPassword: e.target.value }));
                      if (passwordErrors.currentPassword) {
                        setPasswordErrors((p) => ({ ...p, currentPassword: undefined }));
                      }
                    }}
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-11 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                      passwordErrors.currentPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-[#F47738] focus:ring-[#F47738]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password view"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {passwordErrors.currentPassword}
                  </p>
                )}
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Default mock password: <strong className="text-slate-600">AdminPassword123!</strong>
                </span>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  New Password <span className="text-[#F47738]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData((p) => ({ ...p, newPassword: e.target.value }));
                      if (passwordErrors.newPassword) {
                        setPasswordErrors((p) => ({ ...p, newPassword: undefined }));
                      }
                    }}
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-11 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                      passwordErrors.newPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-[#F47738] focus:ring-[#F47738]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password view"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Confirm New Password <span className="text-[#F47738]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }));
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors((p) => ({ ...p, confirmPassword: undefined }));
                      }
                    }}
                    className={`w-full bg-slate-50 border rounded-xl pl-10 pr-11 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                      passwordErrors.confirmPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-[#F47738] focus:ring-[#F47738]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password view"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
