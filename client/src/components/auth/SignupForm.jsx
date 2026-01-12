import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Check, Shield, Cpu, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../common/Button';

const interests = [
  { id: 'web-dev', name: 'Web Dev', icon: '🌐' },
  { id: 'ai-ml', name: 'AI/ML', icon: '🤖' },
  { id: 'devops', name: 'DevOps', icon: '⚙️' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
  { id: 'data-science', name: 'Data Sci', icon: '📊' },
  { id: 'blockchain', name: 'Web3', icon: '🔗' },
  { id: 'cloud', name: 'Cloud', icon: '☁️' },
  { id: 'ui-ux', name: 'UI/UX', icon: '🎨' },
];

const experienceLevels = [
  { value: 'Beginner', label: 'Novice (Beginner)' },
  { value: 'Intermediate', label: 'Operative (Intermediate)' },
  { value: 'Advanced', label: 'Architect (Advanced)' },
];

const SignupForm = () => {
  const { register: registerAuth } = useAuth(); // Renamed to avoid conflict
  const { showPromise } = useNotifications();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      interests: [] // Init array
    }
  });

  const password = watch('password');
  const selectedInterests = watch('interests');

  // Logic: Password Strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, color: 'bg-gray-700' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    return { score, color: colors[score - 1] || 'bg-red-500' };
  };

  const strength = getPasswordStrength(password);

  // Logic: Toggle Interest Chip
  const toggleInterest = (id) => {
    const current = selectedInterests || [];
    const updated = current.includes(id) 
      ? current.filter(i => i !== id)
      : [...current, id];
    setValue('interests', updated);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await showPromise(
        registerAuth(data),
        'Initializing user protocol...',
        'Access Granted. Welcome to NeoCube.',
        'Registration Failed. Identity Rejected.'
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
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-grid opacity-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-surfaceHighlight border border-white/5 mb-4 shadow-lg">
              <Cpu className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              Initialize <span className="text-gradient-primary">Identity</span>
            </h2>
            <p className="text-textMuted text-sm">
              Create your operative profile to access the network.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 uppercase ml-1">Codename (Full Name)</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && <span className="text-xs text-red-400 ml-1">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 uppercase ml-1">Comms Link (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <span className="text-xs text-red-400 ml-1">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 chars' } })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Strength Bar */}
              {password && (
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength.score / 5) * 100}%` }}
                    className={`h-full ${strength.color}`}
                  />
                </div>
              )}
              {errors.password && <span className="text-xs text-red-400 ml-1">{errors.password.message}</span>}
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 uppercase ml-1">Clearance Level</label>
              <div className="relative">
                <select
                  {...register('experienceLevel')}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none appearance-none"
                >
                  {experienceLevels.map(lvl => (
                    <option key={lvl.value} value={lvl.value} className="bg-surface text-white">
                      {lvl.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-gray-500 rotate-90" />
                </div>
              </div>
            </div>

            {/* Tech Chips */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase ml-1">Directives (Interests)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {interests.map((interest) => {
                  const isSelected = selectedInterests?.includes(interest.name);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.name)}
                      className={`
                        flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-xs font-medium border transition-all duration-200
                        ${isSelected 
                          ? 'bg-primary/20 border-primary text-white shadow-glow' 
                          : 'bg-white/5 border-transparent text-textMuted hover:bg-white/10'}
                      `}
                    >
                      <span>{interest.icon}</span>
                      {interest.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full btn-neo py-3 text-base flex items-center justify-center gap-2"
                isLoading={isLoading}
              >
                {!isLoading && <Shield className="w-5 h-5" />}
                {isLoading ? 'Creating Record...' : 'Establish Connection'}
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-textMuted">
                Already operative?{' '}
                <Link to="/login" className="text-primary hover:text-primary-glow font-medium hover:underline">
                  System Login
                </Link>
              </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;