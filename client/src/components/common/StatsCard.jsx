import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from './Card';
import clsx from 'clsx';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  description,
  color = 'primary',
  className = '',
  ...props
}) => {
  const colorClasses = {
    primary: {
      icon: 'text-primary-500 bg-primary-100 dark:bg-primary-900/30',
      trend: {
        up: 'text-success-600',
        down: 'text-danger-600',
        neutral: 'text-gray-600',
      },
    },
    success: {
      icon: 'text-success-500 bg-success-100 dark:bg-success-900/30',
      trend: {
        up: 'text-success-600',
        down: 'text-danger-600',
        neutral: 'text-gray-600',
      },
    },
    warning: {
      icon: 'text-warning-500 bg-warning-100 dark:bg-warning-900/30',
      trend: {
        up: 'text-success-600',
        down: 'text-danger-600',
        neutral: 'text-gray-600',
      },
    },
    danger: {
      icon: 'text-danger-500 bg-danger-100 dark:bg-danger-900/30',
      trend: {
        up: 'text-success-600',
        down: 'text-danger-600',
        neutral: 'text-gray-600',
      },
    },
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <Card hover className={className} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={clsx('p-2 rounded-lg', colorClasses[color].icon)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{value}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {title}
              </p>
            </div>
          </div>
          {trend && (
            <div className={clsx('flex items-center space-x-1', colorClasses[color].trend[trend])}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default StatsCard;