import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, TrendingUp, Award, Clock, Target, Sparkles, Zap, Shield, Star, Code2, Rocket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';

const Landing = () => {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: BookOpen,
      title: 'Structured Roadmaps',
      description: 'Follow step-by-step learning paths created by industry experts with curated resources.',
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed progress analytics and achievement tracking.',
    },
    {
      icon: Users,
      title: 'Personalized Learning',
      description: 'Get technology recommendations based on your interests and experience level.',
    },
    {
      icon: TrendingUp,
      title: 'Stay Current',
      description: 'Access trending technologies and stay updated with the latest industry demands.',
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Earn badges and rewards as you complete learning milestones and advance your skills.',
    },
    {
      icon: Clock,
      title: 'Learn at Your Pace',
      description: 'Flexible learning schedules with time estimates and self-paced progress tracking.',
    },
  ];

  const technologies = [
    { name: 'React.js', icon: '⚛️', color: 'from-cyan-500 to-blue-500' },
    { name: 'Node.js', icon: '🟢', color: 'from-green-500 to-green-600' },
    { name: 'Python', icon: '🐍', color: 'from-blue-500 to-yellow-500' },
    { name: 'ML', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    { name: 'DevOps', icon: '🔧', color: 'from-orange-500 to-red-500' },
    { name: 'MongoDB', icon: '🍃', color: 'from-green-400 to-green-600' },
    { name: 'UI/UX', icon: '🎨', color: 'from-green-400 to-green-600' },
    { name: 'AWS', icon: '🍃', color: 'from-green-400 to-green-600' },
    { name: 'Data Science', icon: '📊', color: 'from-green-400 to-green-600' },
    { name: 'Testing', icon: '🐞', color: 'from-green-400 to-green-600' },
    { name: 'Blockchain', icon: '₿', color: 'from-green-400 to-green-600' },
    { name: 'Many More', icon: '⚙️', color: 'from-green-400 to-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Hero Section - Modern & Bold */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-500 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-4000" />
          <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-emerald-500 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-6000" />
        </div>

        <div className="relative container-custom py-24 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-full backdrop-blur-sm border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-4 h-4 mr-2" />
              New: AI-Powered Learning Recommendations
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-8">
              Master{' '}
              <span className="relative inline-block">
                <span className="text-gradient">Modern Tech</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-500" viewBox="0 0 400 12" preserveAspectRatio="none">
                  <path d="M0,10 Q100,0 200,10 T400,10" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>{' '}
              <br />
              With{' '}
              <span className="text-gradient">Confidence</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your career with structured roadmaps, real-time progress tracking,
              and personalized learning paths designed by industry experts.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="group relative overflow-hidden" asChild>
                <Link to="/signup">
                  Start Your Journey
                  {/* <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /> */}
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 dark:border-gray-600" asChild>
                <Link to="/login">
                  I Already Have an Account
                </Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">200+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Tech showcase - Enhanced */}
          <div className="relative mt-20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            </div>
            <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              {technologies.map((tech, index) => (
                <div
                  key={tech.name}
                  className={`
                    relative group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-3
                    animate-fade-in
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className={`
                    glass p-6 rounded-2xl text-center border border-white/20 dark:border-gray-700/30
                    bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
                    group-hover:bg-white dark:group-hover:bg-gray-800 transition-all duration-300
                    group-hover:shadow-2xl group-hover:shadow-blue-500/20
                  `}>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {tech.icon}
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tech.name}
                    </p>
                    <div className="mt-2 flex justify-center">
                      <Star className="w-3 h-3 text-yellow-500 fill-current opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Star className="w-3 h-3 text-yellow-500 fill-current opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '100ms' }} />
                      <Star className="w-3 h-3 text-yellow-500 fill-current opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '200ms' }} />
                    </div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-600 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Design */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50" />

        <div className="relative container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to{' '}
              <span className="text-gradient">Excel</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive learning platform provides cutting-edge tools and resources designed by industry experts to accelerate your tech career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative p-8 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 card-hover animate-fade-in"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Icon container */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-primary" />

        {/* Animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-pulse animation-delay-4000" />
        </div>

        <div className="relative container-custom text-center">
          <div className="max-w-4xl mx-auto">
            {/* Main heading */}
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Transform Your{' '}
              <span className="relative inline-block">
                Career?
                <Rocket className="absolute -top-6 -right-8 w-8 h-8 text-yellow-300 animate-bounce" />
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful developers who are already advancing their careers with our AI-powered learning paths and expert-curated content.
            </p>

            {/* Benefits row */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center text-blue-100">
                <Zap className="w-5 h-5 mr-2 text-yellow-300" />
                <span className="font-medium">Instant Access</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Shield className="w-5 h-5 mr-2 text-green-300" />
                <span className="font-medium">30-Day Guarantee</span>
              </div>
              <div className="flex items-center text-blue-100">
                <Award className="w-5 h-5 mr-2 text-purple-300" />
                <span className="font-medium">Certificates</span>
              </div>
            </div>

            {/* CTA button */}
            <Button
              size="lg"
              className="group bg-white text-blue-700 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
              asChild
            >
              <Link to="/signup">
                Start Learning Today — It's Free!
                {/* <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /> */}
              </Link>
            </Button>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center text-sm text-blue-200">
              <span className="mr-2">No credit card required</span>
              <span className="mx-2">•</span>
              <span className="mx-2">Cancel anytime</span>
              <span className="mx-2">•</span>
              <span className="ml-2">14-day free trial on premium</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;