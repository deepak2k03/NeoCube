import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  glow = false,
  asChild = false,
  ...props
}, ref) => {
  const baseClasses = clsx(
    // Base button styles
    'relative inline-flex items-center justify-center',
    'font-semibold text-sm rounded-xl',
    'transition-all duration-300 transform',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100',

    // Variant specific styles
    {
      // Primary variant
      'gradient-primary text-white hover:shadow-xl hover:scale-105 active:scale-95':
        variant === 'primary',

      // Secondary variant
      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md hover:scale-105 active:scale-95':
        variant === 'secondary',

      // Outline variant
      'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md hover:scale-105 active:scale-95':
        variant === 'outline',

      // Ghost variant
      'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm hover:scale-105 active:scale-95':
        variant === 'ghost',

      // Danger variant
      'gradient-danger text-white hover:shadow-xl hover:scale-105 active:scale-95':
        variant === 'danger',
    },

    // Size specific styles
    {
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base': size === 'md',
      'px-8 py-4 text-lg': size === 'lg',
    },

    // Width styles
    {
      'w-full': fullWidth,
    },

    // Glow effect
    {
      'shadow-glow': glow,
    },

    // Custom classes
    className
  );

  const renderContent = () => {
    const contentClasses = clsx(
      'flex items-center justify-center',
      {
        'opacity-0': isLoading,
      }
    );

    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          {children && <span className="ml-2 opacity-75">Loading...</span>}
        </div>
      );
    }

    return (
      <div className={contentClasses}>
        {Icon && iconPosition === 'left' && (
          <Icon className="w-4 h-4 mr-2" />
        )}

        <span className="relative">
          {children}
          {variant === 'primary' && (
            <Sparkles className="absolute -top-1 -right-3 w-3 h-3 text-yellow-300 opacity-0 hover:opacity-100 transition-opacity" />
          )}
        </span>

        {Icon && iconPosition === 'right' && (
          <Icon className="w-4 h-4 ml-2" />
        )}
      </div>
    );
  };

  // If asChild is true, render the first child with our styles
  if (asChild && React.Children.count(children) === 1) {
    const child = React.Children.only(children);
    const childProps = {
      ...child.props,
      className: clsx(baseClasses, child.props.className),
      ref,
      disabled: disabled || isLoading,
      ...props,
    };

    return React.cloneElement(child, childProps, renderContent());
  }

  // Default: render as button
  const Comp = asChild ? 'span' : 'button';

  return (
    <Comp
      ref={ref}
      className={baseClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {renderContent()}

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 hover:opacity-20 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      </div>
    </Comp>
  );
});

Button.displayName = 'Button';

export default Button;