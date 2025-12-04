import React from 'react';
import clsx from 'clsx';

const ProgressRing = ({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  backgroundColor = 'gray',
  showPercentage = true,
  className = '',
  label = '',
}) => {
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;

  const colorClasses = {
    primary: 'text-primary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    danger: 'text-danger-500',
    gray: 'text-gray-200 dark:text-gray-700',
  };

  const bgColorClasses = {
    primary: 'text-primary-100',
    success: 'text-success-100',
    warning: 'text-warning-100',
    danger: 'text-danger-100',
    gray: 'text-gray-200 dark:text-gray-700',
  };

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={bgColorClasses[backgroundColor]}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={clsx(colorClasses[color], 'transition-all duration-500 ease-out')}
        />
      </svg>
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(normalizedPercentage)}%
          </span>
        )}
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;