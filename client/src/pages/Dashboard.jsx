import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Flame,
  Clock,
  Zap,
  Award,
  Play,
} from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import ProgressRing from '../components/common/ProgressRing';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Safely derive stats from logged-in user
  const userStats = user?.stats || {};
  const streak = user?.streak ?? userStats.streak ?? 0;

  const mockStats = [
    {
      title: 'Technologies Learning',
      value: String(userStats.inProgressTechnologies ?? 3),
      icon: BookOpen,
      color: 'primary',
      trend: 'up',
      trendValue: '+1 this week',
      description: 'Active learning paths',
    },
    {
      title: 'Completed Steps',
      value: String(userStats.completedSteps ?? 24),
      icon: Target,
      color: 'success',
      trend: 'up',
      trendValue: '+8 this week',
      description: 'Total steps completed',
    },
    {
      title: 'Learning Streak',
      value: `${streak} day${streak === 1 ? '' : 's'}`,
      icon: Trophy,
      color: 'warning',
      trend: 'up',
      trendValue: streak > 0 ? 'Keep it going!' : 'Start your first streak',
      description: 'Consecutive learning days',
    },
    {
      title: 'Progress',
      value: `${userStats.overallProgress ?? 68}%`,
      icon: TrendingUp,
      color: 'primary',
      trend: 'up',
      trendValue: '+5% this week',
      description: 'Overall completion',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container-custom py-8">
        {/* Enhanced Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 gradient-primary rounded-2xl shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
                  Welcome back,{' '}
                  <span className="text-gradient">{user?.name || 'Learner'}</span>! 🚀
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Your learning journey continues. Here&apos;s what&apos;s happening today.
              </p>
            </div>

            {/* Streak badge - now dynamic */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
              <Flame className="w-5 h-5 text-white animate-pulse" />
              {streak > 0 ? (
                <span className="text-white font-bold">
                  {streak} Day{streak === 1 ? '' : 's'} Streak!
                </span>
              ) : (
                <span className="text-white font-semibold">Start your streak today</span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <div
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatsCard {...stat} />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Enhanced Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-500" />
                  Continue Learning
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/technologies')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Card 1 - React */}
                  <div className="group relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                          <div className="text-3xl">⚛️</div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            React.js
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Frontend • Intermediate
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          68%
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
                      </div>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="gradient-primary h-3 rounded-full transition-all duration-700 ease-out"
                          style={{ width: '68%' }}
                        >
                          <div className="h-full bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Next: React Hooks Deep Dive
                      </p>
                      <Button
                        size="sm"
                        className="group-hover:scale-105 transition-transform"
                        onClick={() => navigate('/technologies/reactjs')}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>

                  {/* Progress Card 2 - Node.js */}
                  <div className="group relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                          <div className="text-3xl">🟢</div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            Node.js
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Backend • Intermediate
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          45%
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="gradient-success h-3 rounded-full transition-all duration-700 ease-out"
                          style={{ width: '45%' }}
                        >
                          <div className="h-full bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Next: Building REST APIs with Express.js
                      </p>
                      <Button
                        size="sm"
                        className="group-hover:scale-105 transition-transform"
                        onClick={() => navigate('/technologies/nodejs')}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>

                  {/* Progress Card 3 - MongoDB */}
                  <div className="group relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                          <div className="text-3xl">🍃</div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            MongoDB
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Database • Beginner
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          30%
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="gradient-secondary h-3 rounded-full transition-all duration-700 ease-out"
                          style={{ width: '30%' }}
                        >
                          <div className="h-full bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Next: Advanced Querying & Aggregation
                      </p>
                      <Button
                        size="sm"
                        className="group-hover:scale-105 transition-transform"
                        onClick={() => navigate('/technologies/mongodb')}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  This Week&apos;s Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Steps Completed
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      8.5
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Hours Learned
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      3
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">New Skills</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      95%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Consistency
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Section */}
          <div className="space-y-6">
            <Card className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: '🐍',
                      name: 'Python',
                      description: 'Beginner • 2-3 months',
                      reason: 'Perfect for data science',
                      match: '95%',
                    },
                    {
                      icon: '🤖',
                      name: 'Machine Learning',
                      description: 'Advanced • 4-6 months',
                      reason: 'Based on your interests',
                      match: '88%',
                    },
                    {
                      icon: '📱',
                      name: 'React Native',
                      description: 'Intermediate • 3-4 months',
                      reason: 'Builds on React.js',
                      match: '92%',
                    },
                  ].map((tech, index) => (
                    <div
                      key={index}
                      className="group p-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl group-hover:scale-110 transition-transform">
                            {tech.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {tech.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tech.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600 dark:text-green-400">
                            {tech.match}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Match
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300">
                          {tech.reason}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card className="animate-fade-in" style={{ animationDelay: '700ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Flame className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {streak > 0
                          ? `${streak} Day${streak === 1 ? '' : 's'} Streak!`
                          : 'Start your streak!'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {streak > 0
                          ? 'Keep the momentum going'
                          : 'Learn a little today to begin your streak'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        React Hook Master
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Completed all hook exercises
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
