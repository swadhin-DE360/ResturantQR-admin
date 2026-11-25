import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Utensils,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DEFAULT_MOCK_LOGIN, verifyMockCredentials } from '@/constants/mockCredentials';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Field validation logic (deferred until interaction/submit per modern web standards)
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const emailError = touched.email && (!email.trim() ? 'Email is required' : !isEmailValid(email) ? 'Enter a valid email address' : null);
  const passwordError = touched.password && (!password ? 'Password is required' : password.length < 6 ? 'Password must be at least 6 characters' : null);

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleQuickFillDemo = () => {
    setEmail(DEFAULT_MOCK_LOGIN.email);
    setPassword(DEFAULT_MOCK_LOGIN.password);
    setErrorMessage(null);
    setTouched({ email: true, password: true });
    toast.success('Demo credentials filled!', { icon: '✨', duration: 2000 });
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast(
      'For mock demo: Use the demo credentials provided above or contact administrator.',
      {
        icon: 'ℹ️',
        duration: 4000,
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!email.trim() || !isEmailValid(email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Mock authentication interaction with realistic simulated network latency
    setTimeout(() => {
      const verifiedUser = verifyMockCredentials(email, password);

      if (verifiedUser) {
        setIsLoading(false);
        toast.success(`Welcome back, ${verifiedUser.name}!`);
        // Navigate to dashboard upon successful login
        navigate('/dashboard');
      } else {
        setIsLoading(false);
        const errorText = 'Invalid email or password. Please verify your credentials or click "Use Demo Credentials".';
        setErrorMessage(errorText);
        toast.error('Authentication failed. Check your credentials.');
      }
    }, 750);
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-900 antialiased font-sans">
      {/* =========================================================================
          LEFT SECTION: Restaurant SaaS Visual & Branding (Desktop / Large Screens)
         ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        {/* Ambient Warm Orange (#F47738) Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F47738]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F47738]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#F47738_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F47738] flex items-center justify-center text-white shadow-lg shadow-[#F47738]/25">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-white tracking-wide">ChefDesk</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-[#F47738]/20 text-[#F47738] border border-[#F47738]/30 px-2 py-0.5 rounded-full">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400">Next-Gen Restaurant & Kitchen OS</p>
            </div>
          </div>
        </div>

        {/* Center: Stylized Restaurant SaaS Showcase Illustration & Cards */}
        <div className="relative z-10 my-auto py-8">
          <div className="max-w-lg space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#F47738]" />
                <span>Live Kitchen & Floor Management System</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Streamline operations from kitchen ticket to guest table.
              </h2>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Centralized administration for menus, orders, real-time table turnover, and staff scheduling with zero downtime.
              </p>
            </div>

            {/* Interactive Visual Glassmorphism Cards */}
            <div className="space-y-3 pt-2">
              {/* Card 1: Active Kitchen Metrics */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F47738]/15 border border-[#F47738]/30 text-[#F47738] flex items-center justify-center">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Live Kitchen Display</h4>
                    <p className="text-[11px] text-slate-400">18 Orders actively being prepared</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>12m Avg Prep</span>
                </div>
              </div>

              {/* Card 2: Real-time Turnover Stats */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Floor Turnover Rate</h4>
                    <p className="text-[11px] text-slate-400">Dinner Shift • 24 Tables Active</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white">+28.4%</span>
                  <p className="text-[10px] text-slate-400">vs yesterday</p>
                </div>
              </div>
            </div>

            {/* Partner / Trust Quote */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-[#F47738] shrink-0" />
              <span>SOC2 Compliant • End-to-end operational encryption</span>
            </div>
          </div>
        </div>

        {/* Bottom Status / Copyright */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
          <span>ChefDesk Admin v1.0.0</span>
          <span>© 2026 ChefDesk Technologies</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SECTION: Premium Login Form
         ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16 xl:p-24 bg-white overflow-y-auto">
        {/* Mobile Header Brand (visible only on mobile/tablet) */}
        <div className="flex items-center justify-between lg:hidden mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F47738] flex items-center justify-center text-white shadow-md shadow-[#F47738]/20">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900">ChefDesk</span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Restaurant Admin</p>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            Admin v1.0
          </span>
        </div>

        {/* Main Form Container */}
        <div className="w-full max-w-md mx-auto my-auto">
          {/* Header Title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Restaurant Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Sign in with your restaurant manager credentials to manage kitchen tickets, floor tables, and daily revenue.
            </p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-xs text-slate-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F47738]" />
                Demo Credentials Available
              </span>
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F47738] hover:text-[#e05e1f] transition-colors"
              >
                <Copy className="w-3 h-3" />
                Auto Fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-slate-600 space-y-0.5">
              <p>Email: <span className="text-slate-900 font-semibold">{DEFAULT_MOCK_LOGIN.email}</span></p>
              <p>Password: <span className="text-slate-900 font-semibold">{DEFAULT_MOCK_LOGIN.password}</span></p>
            </div>
          </div>

          {/* Top Error Alert Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1">
                <p className="font-semibold text-rose-800">Authentication Failed</p>
                <p className="text-rose-600 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Manager Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  spellCheck="false"
                  autoComplete="username"
                  placeholder="admin@chefdesk.com"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onBlur={() => handleBlur('email')}
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                    emailError
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:border-[#F47738] focus:ring-[#F47738]/20'
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Password
                </label>
                <a
                  href="#forgot-password"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-[#F47738] hover:text-[#e05e1f] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onBlur={() => handleBlur('password')}
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:bg-white ${
                    passwordError
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:border-[#F47738] focus:ring-[#F47738]/20'
                  }`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#F47738] border-slate-300 focus:ring-[#F47738] focus:ring-offset-0 transition-colors"
                />
                <span className="text-xs text-slate-600">Remember this workstation</span>
              </label>
              <span className="text-[11px] text-slate-400">Shift session (12 hrs)</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#F47738] hover:bg-[#e05e1f] active:bg-[#c2410c] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-[#F47738]/25 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#F47738] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Help / Support Notice */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need technical support or access delegation?{' '}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  toast('Contact your head chef or system administrator for access.', { icon: '🧑‍🍳' });
                }}
                className="font-medium text-[#F47738] hover:underline"
              >
                Contact Floor Supervisor
              </a>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] text-slate-400">
          Protected by ChefDesk Shield Security • Encrypted Session
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
