import React from 'react';
import clsx from 'clsx';

const LoadingSkeleton = ({ className = '', variant = 'default', ...props }) => {
  const baseClasses = clsx(
    'skeleton',
    {
      'h-4 w-full': variant === 'text',
      'h-8 w-3/4': variant === 'title',
      'h-12 w-full': variant === 'heading',
      'h-32 w-full': variant === 'card',
      'h-64 w-full': variant === 'image',
      'h-10 w-20': variant === 'button',
      'w-10 h-10 rounded-full': variant === 'avatar',
      'w-16 h-16 rounded-2xl': variant === 'icon',
    },
    className
  );

  return <div className={baseClasses} {...props} />;
};

// Card skeleton component
export const CardSkeleton = ({ className = '' }) => (
  <div className={clsx('card', className)}>
    <div className="flex items-center space-x-4 mb-4">
      <LoadingSkeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton variant="title" />
        <LoadingSkeleton variant="text" />
      </div>
    </div>
    <LoadingSkeleton variant="text" className="mb-2" />
    <LoadingSkeleton variant="text" className="mb-2" />
    <LoadingSkeleton variant="text" className="w-2/3" />
  </div>
);

// Technology card skeleton
export const TechCardSkeleton = ({ className = '' }) => (
  <div className={clsx('card card-hover', className)}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <LoadingSkeleton variant="icon" />
        <div>
          <LoadingSkeleton variant="title" className="w-24" />
          <LoadingSkeleton variant="text" className="w-16 mt-1" />
        </div>
      </div>
      <LoadingSkeleton variant="button" />
    </div>
    <LoadingSkeleton variant="text" className="mb-4 h-12" />
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <LoadingSkeleton className="w-12 h-6 rounded-full" />
        <LoadingSkeleton className="w-16 h-6 rounded-full" />
      </div>
      <LoadingSkeleton className="w-20 h-6 rounded-full" />
    </div>
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton = ({ className = '' }) => (
  <div className={clsx('card', className)}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <LoadingSkeleton variant="icon" />
        <div>
          <LoadingSkeleton variant="heading" className="w-16" />
          <LoadingSkeleton variant="text" className="w-24 mt-1" />
        </div>
      </div>
      <LoadingSkeleton variant="button" className="w-12" />
    </div>
  </div>
);

// List skeleton
export const ListSkeleton = ({ items = 3, className = '' }) => (
  <div className={clsx('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1">
          <LoadingSkeleton variant="text" />
          <LoadingSkeleton variant="text" className="w-2/3 mt-1" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;