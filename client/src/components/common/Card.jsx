import React from 'react';
import clsx from 'clsx';

const Card = React.forwardRef(({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'normal',
  ...props
}, ref) => {
  const baseClasses = clsx(
    'rounded-xl border transition-all duration-200',
    {
      'p-4': padding === 'small',
      'p-6': padding === 'normal',
      'p-8': padding === 'large',
      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm': !glass,
      'glass border-white/20 dark:border-gray-700/20': glass,
      'hover:shadow-lg hover:-translate-y-1': hover,
    },
    className
  );

  return (
    <div ref={ref} className={baseClasses} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = ({ className = '', children, ...props }) => (
  <div className={clsx('mb-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-white', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className = '', children, ...props }) => (
  <p className={clsx('text-gray-600 dark:text-gray-400 mt-1', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ className = '', children, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className = '', children, ...props }) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)} {...props}>
    {children}
  </div>
);

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;