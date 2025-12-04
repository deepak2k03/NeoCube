import React from 'react';
import { Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import { TechCardSkeleton } from '../components/common/LoadingSkeleton';

const Favourites = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  // Mock favourites data - in a real app, this would be fetched from API
  const mockFavourites = [
    {
      _id: '1',
      name: 'React.js',
      slug: 'reactjs',
      shortDescription:
        'A JavaScript library for building user interfaces with component-based architecture.',
      category: 'Frontend',
      difficulty: 'Intermediate',
      isTrending: true,
      tags: ['frontend', 'javascript', 'spa', 'ui', 'components'],
      estimatedTime: '2-3 months',
      icon: '⚛️',
      color: '#61DAFB',
      progress: {
        completedSteps: 4,
        totalSteps: 6,
        percentage: 68,
        lastUpdated: '2 days ago',
      },
    },
    {
      _id: '3',
      name: 'MongoDB',
      slug: 'mongodb',
      shortDescription:
        'A flexible, scalable NoSQL database that stores data in JSON-like documents.',
      category: 'Database',
      difficulty: 'Beginner',
      isTrending: true,
      tags: ['database', 'nosql', 'json', 'scalability', 'storage'],
      estimatedTime: '1-2 months',
      icon: '🍃',
      color: '#47A248',
      progress: {
        completedSteps: 1,
        totalSteps: 4,
        percentage: 25,
        lastUpdated: '1 week ago',
      },
    },
    {
      _id: '5',
      name: 'Machine Learning Fundamentals',
      slug: 'machine-learning-fundamentals',
      shortDescription:
        'Learn the core concepts and algorithms that power artificial intelligence and data science.',
      category: 'AI/ML',
      difficulty: 'Advanced',
      isTrending: true,
      tags: ['ai', 'ml', 'data-science', 'python', 'neural-networks'],
      estimatedTime: '4-6 months',
      icon: '🤖',
      color: '#FF6B6B',
      progress: null,
    },
  ];

  const filteredFavourites = mockFavourites.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const goToTechnology = (slug) => {
    navigate(`/technologies/${slug}`);
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Heart className="w-8 h-8 mr-3 text-red-500 fill-current" />
          My Favourites
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Technologies you've saved for quick access and future learning.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your favourite technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Favourites Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <TechCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredFavourites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No matching favourites found' : 'No favourites yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms or browse all technologies to find more to favourite.'
                : 'Start exploring technologies and add them to your favourites for quick access.'}
            </p>
            <Button onClick={() => navigate('/technologies')}>
              Explore Technologies
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavourites.map((tech) => (
            <Card key={tech._id} hover className="group">
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{tech.icon}</div>
                    <div>
                      <h3
                        className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors cursor-pointer"
                        onClick={() => goToTechnology(tech.slug)}
                      >
                        {tech.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tech.category}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {tech.shortDescription}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`
                      badge badge-secondary
                      ${tech.difficulty === 'Beginner' ? 'badge-success' : ''}
                      ${tech.difficulty === 'Intermediate' ? 'badge-warning' : ''}
                      ${tech.difficulty === 'Advanced' ? 'badge-danger' : ''}
                    `}
                    >
                      {tech.difficulty}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tech.estimatedTime}
                    </span>
                  </div>
                  {tech.isTrending && (
                    <span className="badge badge-warning">Trending</span>
                  )}
                </div>

                {/* Progress Section */}
                {tech.progress ? (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {tech.progress.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${tech.progress.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last updated {tech.progress.lastUpdated}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4 text-center">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Not started yet
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    onClick={() => goToTechnology(tech.slug)}
                  >
                    {tech.progress ? 'Continue Learning' : 'Start Learning'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => goToTechnology(tech.slug)}
                  >
                    View Details
                  </Button>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {tech.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                  {tech.tags.length > 3 && (
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      +{tech.tags.length - 3}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
