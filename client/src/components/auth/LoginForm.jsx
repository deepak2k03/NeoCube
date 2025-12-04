import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Sparkles, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../common/Button';

const LoginForm = () => {
  const { login } = useAuth();
  const { showPromise, showError } = useNotifications();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await showPromise(
        login(data),
        'Logging in...',
        'Welcome back! Login successful.',
        'Login failed. Please check your credentials.'
      );

      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by showPromise
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    const hasValue = watch(fieldName);
    const hasError = errors[fieldName];

    return `
      input pr-12
      ${hasValue ? 'border-blue-500 dark:border-blue-400' : ''}
      ${hasError ? 'input-error' : ''}
      ${hasValue && !hasError ? 'shadow-sm shadow-blue-500/20' : ''}
      transition-all duration-200
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/50 dark:to-purple-900/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Glass card */}
        <div className="glass p-8 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="mx-auto w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                <Lock className="h-10 w-10 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white animate-pulse" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                Email address
              </label>
              <div className="relative">
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  type="email"
                  className={getInputClass('email')}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                {emailValue && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="w-4 h-4 mr-2">⚠️</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={getInputClass('password')}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="w-4 h-4 mr-2">⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
  type="submit"
  className="relative w-full text-lg py-4 gradient-primary"
  isLoading={isLoading}
  disabled={isLoading}
  glow
>
  <Shield className="w-5 h-5 absolute left-4 top-1 -translate-y-3" />
  
  <div className='mt-4'>
    {isLoading ? 'Signing In...' : 'Sign In'} 
  </div>
</Button>


            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                or
              </span>
            </div>
          </div>

          {/* Social Login (Optional) */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full py-3"
              disabled
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25-.12-.38-.06-.74-.18-1.08-.38-.34-.2-.66-.44-1.17-.28-1.38-.56-2.63-.9-3.59-1.1-2.2-.7-4.04-1.13-6.06-1.25-1.7-.06-2.31-.19-2.44-.4-.45-.23-1.12-.06-1.94.06-.2.02-.38.06-.56.25-.76.42-1.12.66-1.47.25-.06.31-.44.06-.69 0-.38.19-.69.5-.5.06-.31.13-.69.13-.38 0-.19.19-.38.31-.44-.31-.75-.44-1.06-.19-.31-.25-.44-.31-.19-.19-.31-.25-.44-.19-.56-.44-.69-.44-.25-.13-.31-.56-.13-.38 0-.19.19-.38.25-.63.13-.25.25-.44.38-.56.25-.12.25-.06.25-.06.25.25.06.25.06.13.06.25 0 .19-.06.25-.06.12.13-.06.25-.13-.25-.25-.25-.25-.25-.13-.13-.25-.25-.25-.25-.19-.19-.38-.25-.56-.25-.31-.06-.5-.06-.75-.06-.19 0-.25.06-.38.06-.19.06-.38.06-.56 0-.06.06-.13.06-.19.06-.19.06-.38-.06-.56-.06-.31-.06-.5-.06-.75-.06z" />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Account Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
            <span className="font-semibold">💡 Demo Mode:</span> Use any email and password to test the application
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;