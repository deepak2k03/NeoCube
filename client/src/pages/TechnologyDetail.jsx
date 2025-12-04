import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  PlayCircle,
  FileText,
  ExternalLink,
  Heart,
  ArrowLeft,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressRing from '../components/common/ProgressRing';

// Same base technologies as Technologies.jsx, but with extra detail/roadmap for React
const mockTechnologies = [
  {
    _id: '1',
    name: 'React.js',
    slug: 'reactjs',
    shortDescription:
      'A JavaScript library for building user interfaces with component-based architecture.',
    longDescription:
      'React.js is a powerful JavaScript library developed by Meta for building dynamic and interactive user interfaces. It uses a virtual DOM for efficient updates, supports reusable components, and has a large ecosystem of tools and libraries.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    tags: ['frontend', 'javascript', 'spa', 'ui', 'components'],
    estimatedTime: '2-3 months',
    prerequisites: ['Basic JavaScript', 'HTML', 'CSS', 'ES6+ Features'],
    icon: '⚛️',
    color: '#61DAFB',
    isTrending: true,
    roadmap: [
      {
        _id: 'step1',
        title: 'Learn JavaScript Fundamentals',
        description:
          'Master JavaScript basics including variables, functions, arrays, objects, and ES6+ features like arrow functions and destructuring.',
        order: 1,
        estimatedHours: 40,
        resources: [
          {
            type: 'course',
            title: 'JavaScript Complete Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            duration: '30 hours',
          },
          {
            type: 'video',
            title: 'ES6+ Crash Course',
            url: 'https://www.youtube.com/watch?v=WZQc_i_mIV8',
            duration: '2 hours',
          },
        ],
      },
      {
        _id: 'step2',
        title: 'Understanding React Core Concepts',
        description:
          'Learn JSX syntax, components, props, state, and the component lifecycle. Understand how React renders and updates the DOM.',
        order: 2,
        estimatedHours: 30,
        resources: [
          {
            type: 'docs',
            title: 'React Official Documentation',
            url: 'https://react.dev/learn',
            duration: '20 hours',
          },
          {
            type: 'video',
            title: 'React Crash Course',
            url: 'https://www.youtube.com/watch?v=w7ejDZ8o_s8',
            duration: '1 hour',
          },
        ],
      },
      {
        _id: 'step3',
        title: 'React Hooks Deep Dive',
        description:
          'Master useState, useEffect, useContext, and custom hooks. Learn how to manage state and side effects in functional components.',
        order: 3,
        estimatedHours: 25,
        resources: [
          {
            type: 'article',
            title: 'A Complete Guide to useEffect',
            url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
            duration: '2 hours',
          },
          {
            type: 'project',
            title: 'Build a Todo App with Hooks',
            url: 'https://reactjs.org/tutorial/tutorial.html',
            duration: '5 hours',
          },
        ],
      },
    ],
  },
  {
    _id: '2',
    name: 'Node.js',
    slug: 'nodejs',
    shortDescription:
      "JavaScript runtime built on Chrome's V8 JavaScript engine for server-side development.",
    longDescription:
      'Node.js lets you run JavaScript on the server, enabling you to build scalable network applications using one language across the stack.',
    category: 'Backend',
    difficulty: 'Intermediate',
    tags: ['backend', 'javascript', 'api', 'server', 'node'],
    estimatedTime: '2-3 months',
    prerequisites: ['JavaScript Basics', 'Asynchronous JS', 'HTTP Basics'],
    icon: '🟢',
    color: '#339933',
    isTrending: true,
    roadmap: [], // you can fill later
  },
  {
    _id: '3',
    name: 'MongoDB',
    slug: 'mongodb',
    shortDescription:
      'A flexible, scalable NoSQL database that stores data in JSON-like documents.',
    longDescription:
      'MongoDB is a document-oriented NoSQL database designed for modern applications requiring flexible schemas and horizontal scalability.',
    category: 'Database',
    difficulty: 'Beginner',
    tags: ['database', 'nosql', 'json', 'scalability', 'storage'],
    estimatedTime: '1-2 months',
    prerequisites: ['Basic CRUD concepts', 'JSON'],
    icon: '🍃',
    color: '#47A248',
    isTrending: true,
    roadmap: [],
  },
  {
    _id: '4',
    name: 'Python',
    slug: 'python',
    shortDescription:
      'A versatile, high-level programming language known for its simplicity and extensive libraries.',
    longDescription:
      'Python is a popular, high-level programming language great for beginners and used heavily in web, data science, AI, and automation.',
    category: 'Web Development',
    difficulty: 'Beginner',
    tags: ['python', 'programming', 'data-science', 'ai', 'automation'],
    estimatedTime: '2-3 months',
    prerequisites: ['Programming fundamentals'],
    icon: '🐍',
    color: '#3776AB',
    isTrending: true,
    roadmap: [],
  },
  {
    _id: '5',
    name: 'Machine Learning Fundamentals',
    slug: 'machine-learning-fundamentals',
    shortDescription:
      'Learn the core concepts and algorithms that power artificial intelligence and data science.',
    longDescription:
      'Machine Learning Fundamentals covers the essential concepts, algorithms, and workflows behind modern AI systems.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    tags: ['ai', 'ml', 'data-science', 'python', 'neural-networks'],
    estimatedTime: '4-6 months',
    prerequisites: ['Python', 'Linear Algebra', 'Probability & Statistics'],
    icon: '🤖',
    color: '#FF6B6B',
    isTrending: true,
    roadmap: [],
  },
  {
    _id: '6',
    name: 'DevOps Fundamentals',
    slug: 'devops-fundamentals',
    shortDescription:
      'Master the practices and tools that bridge development and operations for faster, reliable software delivery.',
    longDescription:
      'DevOps Fundamentals introduces you to CI/CD, automation, containerization, and monitoring for modern software teams.',
    category: 'DevOps',
    difficulty: 'Advanced',
    tags: ['devops', 'ci-cd', 'docker', 'kubernetes', 'automation'],
    estimatedTime: '3-4 months',
    prerequisites: ['Basic Linux', 'Git', 'Software Development Basics'],
    icon: '🔧',
    color: '#FF9800',
    isTrending: true,
    roadmap: [],
  },
];

const getResourceIcon = (type) => {
  switch (type) {
    case 'video':
      return <PlayCircle className="w-4 h-4" />;
    case 'article':
      return <FileText className="w-4 h-4" />;
    case 'course':
    case 'docs':
      return <BookOpen className="w-4 h-4" />;
    case 'project':
      return <ExternalLink className="w-4 h-4" />;
    default:
      return <ExternalLink className="w-4 h-4" />;
  }
};

const TechnologyDetail = () => {
  const { slug } = useParams();
  const technology = mockTechnologies.find((t) => t.slug === slug);

  const [isFavourite, setIsFavourite] = React.useState(false);
  const [completedSteps, setCompletedSteps] = React.useState(['step1']);

  if (!technology) {
    return (
      <div className="container-custom py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Technology not found.
        </p>
        <Link
          to="/technologies"
          className="inline-flex items-center text-primary-600 dark:text-primary-400"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to technologies
        </Link>
      </div>
    );
  }

  const totalSteps = technology.roadmap?.length || 0;

  const completedStepsCount =
    totalSteps === 0
      ? 0
      : completedSteps.filter((id) =>
          technology.roadmap.some((step) => step._id === id)
        ).length;

  const progressPercentage =
    totalSteps === 0 ? 0 : (completedStepsCount / totalSteps) * 100;

  const toggleStepComplete = (stepId) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  const markAllComplete = () => {
    if (!technology.roadmap?.length) return;
    setCompletedSteps(technology.roadmap.map((s) => s._id));
  };

  const resetProgress = () => {
    setCompletedSteps([]);
  };

  const toggleFavourite = () => {
    setIsFavourite((prev) => !prev);
  };

  return (
    <div className="container-custom py-8">
      {/* Back link */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/technologies"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to technologies
        </Link>

        {/* Legend for status */}
        {totalSteps > 0 && (
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Completed
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" /> Not
              completed
            </span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{technology.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {technology.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="badge badge-primary">{technology.category}</span>
                <span
                  className={`
                    badge
                    ${technology.difficulty === 'Beginner' ? 'badge-success' : ''}
                    ${technology.difficulty === 'Intermediate' ? 'badge-warning' : ''}
                    ${technology.difficulty === 'Advanced' ? 'badge-danger' : ''}
                  `}
                >
                  {technology.difficulty}
                </span>
                {technology.isTrending && (
                  <span className="badge badge-warning">Trending</span>
                )}
                <span>⏱️ {technology.estimatedTime}</span>
              </div>
            </div>
          </div>
          <Button
            variant={isFavourite ? 'primary' : 'outline'}
            onClick={toggleFavourite}
          >
            <Heart className={`w-4 h-4 ${isFavourite ? 'fill-current' : ''}`} />
            {isFavourite ? 'Favourited' : 'Add to Favourites'}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your Progress
              </h2>
              {totalSteps > 0 ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {completedStepsCount} of {totalSteps} steps completed
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      Completed:{' '}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {completedStepsCount}
                      </span>
                    </span>
                    <span>
                      Remaining:{' '}
                      <span className="font-semibold text-orange-500">
                        {totalSteps - completedStepsCount}
                      </span>
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Roadmap coming soon for this technology.
                </p>
              )}
              {totalSteps > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={markAllComplete}>
                    Mark all as completed
                  </Button>
                  <Button size="sm" variant="ghost" onClick={resetProgress}>
                    Reset progress
                  </Button>
                </div>
              )}
            </div>
            <ProgressRing
              percentage={progressPercentage}
              size={120}
              color="primary"
              showPercentage={true}
            />
          </div>
          {totalSteps > 0 && (
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Description and Prerequisites */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About this Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {technology.longDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {technology.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              {technology.prerequisites?.length ? (
                <ul className="space-y-2">
                  {technology.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {prereq}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No prerequisites listed.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Roadmap */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Learning Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              {technology.roadmap?.length ? (
                <div className="space-y-6">
                  {/* Small step tracker row */}
                  <div className="flex flex-wrap gap-2 mb-4 text-xs">
                    {technology.roadmap.map((step) => {
                      const isDone = completedSteps.includes(step._id);
                      return (
                        <div
                          key={step._id}
                          className={
                            'inline-flex items-center px-2 py-1 rounded-full border ' +
                            (isDone
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                              : 'border-gray-300 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300')
                          }
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <Circle className="w-3 h-3 mr-1" />
                          )}
                          Step {step.order}
                        </div>
                      );
                    })}
                  </div>

                  {technology.roadmap.map((step) => {
                    const isCompleted = completedSteps.includes(step._id);
                    return (
                      <div
                        key={step._id}
                        className={`
                          p-6 border rounded-xl transition-all duration-200
                          relative
                          ${
                            isCompleted
                              ? 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-900/10 dark:border-emerald-600'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                          }
                        `}
                      >
                        {/* Left colored bar */}
                        <div
                          className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${
                            isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />

                        <div className="flex items-start space-x-4 pl-3">
                          <div className="flex-shrink-0 pt-1">
                            <button
                              onClick={() => toggleStepComplete(step._id)}
                              className={`
                                w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors
                                ${
                                  isCompleted
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                                }
                              `}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                          <div className="flex-1">
                            <div
                              className="flex items-start justify-between mb-2 cursor-pointer"
                              onClick={() => toggleStepComplete(step._id)}
                            >
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                  Step {step.order}: {step.title}
                                </h3>
                                <span
                                  className={
                                    'inline-flex items-center mt-1 px-2 py-0.5 text-xs rounded-full ' +
                                    (isCompleted
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300')
                                  }
                                >
                                  {isCompleted ? 'Completed' : 'Not completed yet'}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {step.estimatedHours}h
                              </span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {step.description}
                            </p>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Resources:
                              </h4>
                              {step.resources.map((resource, resourceIndex) => (
                                <a
                                  key={resourceIndex}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <div className="flex items-center space-x-2">
                                    {getResourceIcon(resource.type)}
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {resource.title}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-gray-400" />
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {resource.duration}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Roadmap details are coming soon for this technology.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnologyDetail;
