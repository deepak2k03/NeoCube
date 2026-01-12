import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Zap, ShieldCheck, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../common/Button';

const LoginForm = () => {
  const { login } = useAuth();
  const { showPromise } = useNotifications();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await showPromise(
        login(data),
        'Authenticating credentials...',
        'Access Granted.',
        'Access Denied. Invalid credentials.'
      );
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background FX */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute inset-0 bg-grid opacity-15" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/5 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              System <span className="text-gradient-cyan">Login</span>
            </h2>
            <p className="text-textMuted text-sm">
              Enter your credentials to access the mainframe.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase ml-1">Operative ID (Email)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  {...register('email', { 
                    required: 'Email required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid protocol format' }
                  })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  placeholder="operative@neocube.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase ml-1">Access Key (Password)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password required' })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-gray-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password.message}</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors">
                <input type="checkbox" className="mr-2 rounded border-gray-600 bg-transparent text-primary focus:ring-offset-0 focus:ring-primary" />
                Keep Session Active
              </label>
              <Link to="/forgot-password" className="text-primary hover:text-primary-glow transition-colors">
                Reset Key?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full btn-neo py-3 text-base font-bold shadow-glow"
              isLoading={isLoading}
            >
              {isLoading ? 'Decrypting...' : 'Authenticate'}
            </Button>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
              <Terminal className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-textMuted">
                <span className="text-primary font-bold block mb-1">DEMO ACCESS AVAILABLE</span>
                Use any valid email format to initiate a simulated session. No actual security clearance required.
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-textMuted">
                New Operative?{' '}
                <Link to="/signup" className="text-secondary hover:text-secondary-glow font-medium hover:underline">
                  Initialize Protocol
                </Link>
              </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;