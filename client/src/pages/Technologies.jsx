import React from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import { TechCardSkeleton } from '../components/common/LoadingSkeleton';

const Technologies = () => {
  const [viewMode, setViewMode] = React.useState('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('All');
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const mockTechnologies = [
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
    },
    {
      _id: '2',
      name: 'Node.js',
      slug: 'nodejs',
      shortDescription:
        "JavaScript runtime built on Chrome's V8 JavaScript engine for server-side development.",
      category: 'Backend',
      difficulty: 'Intermediate',
      isTrending: true,
      tags: ['backend', 'javascript', 'api', 'server', 'node'],
      estimatedTime: '2-3 months',
      icon: '🟢',
      color: '#339933',
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
    },
    {
      _id: '4',
      name: 'Python',
      slug: 'python',
      shortDescription:
        'A versatile, high-level programming language known for its simplicity and extensive libraries.',
      category: 'Web Development',
      difficulty: 'Beginner',
      isTrending: true,
      tags: ['python', 'programming', 'data-science', 'ai', 'automation'],
      estimatedTime: '2-3 months',
      icon: '🐍',
      color: '#3776AB',
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
    },
    {
      _id: '6',
      name: 'DevOps Fundamentals',
      slug: 'devops-fundamentals',
      shortDescription:
        'Master the practices and tools that bridge development and operations for faster, reliable software delivery.',
      category: 'DevOps',
      difficulty: 'Advanced',
      isTrending: true,
      tags: ['devops', 'ci-cd', 'docker', 'kubernetes', 'automation'],
      estimatedTime: '3-4 months',
      icon: '🔧',
      color: '#FF9800',
    },
  ];

  const categories = [
    'All',
    'Frontend',
    'Backend',
    'Database',
    'AI/ML',
    'DevOps',
    'Web Development',
    'Mobile',
  ];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // ---- FILTER LOGIC ----
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredTechnologies = mockTechnologies.filter((tech) => {
    const matchesSearch =
      normalizedSearch === '' ||
      tech.name.toLowerCase().includes(normalizedSearch) ||
      tech.category.toLowerCase().includes(normalizedSearch) ||
      tech.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch)) ||
      tech.shortDescription.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === 'All' || tech.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'All' || tech.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const listWrapperClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      : 'space-y-4';

  const handleCardClick = (slug) => {
    navigate(`/technologies/${slug}`);
  };

  const handleViewDetailsClick = (e, slug) => {
    e.stopPropagation(); // prevent card click firing twice
    navigate(`/technologies/${slug}`);
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Explore Technologies
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and learn modern technologies with structured roadmaps.
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={
                          'px-3 py-1 text-sm rounded-full border transition-colors ' +
                          (isActive
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800')
                        }
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Level:
                </span>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => {
                    const isActive = selectedDifficulty === difficulty;
                    return (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={
                          'px-3 py-1 text-sm rounded-full border transition-colors ' +
                          (isActive
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800')
                        }
                      >
                        {difficulty}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* View Mode */}
              <div className="flex items-center space-x-2 ml-auto">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technologies Grid/List */}
      {isLoading ? (
        <div className={listWrapperClass}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TechCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredTechnologies.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          No technologies found. Try changing your search or filters.
        </div>
      ) : (
        <div className={listWrapperClass}>
          {filteredTechnologies.map((tech) => (
            <Card
              key={tech._id}
              hover
              className="group cursor-pointer h-full"
              onClick={() => handleCardClick(tech.slug)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{tech.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                        {tech.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tech.category}
                      </p>
                    </div>
                  </div>
                  {tech.isTrending && (
                    <span className="badge badge-warning">Trending</span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {tech.shortDescription}
                </p>

                <div className="flex items-center justify-between">
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleViewDetailsClick(e, tech.slug)}
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

export default Technologies;
