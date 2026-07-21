import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../stores/StoreContext';

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const { theme } = useStore();
  
  const baseStyle = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border-2 high-contrast:border-yellow-400",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 high-contrast:bg-white high-contrast:text-black high-contrast:border-2 high-contrast:border-black",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 high-contrast:bg-red-950 high-contrast:text-red-100 high-contrast:border-2 high-contrast:border-red-500",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 high-contrast:border-2 high-contrast:border-white high-contrast:text-white",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 high-contrast:text-white high-contrast:hover:bg-white high-contrast:hover:text-black"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 high-contrast:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 high-contrast:border-2 high-contrast:border-yellow-400 high-contrast:bg-black high-contrast:text-white ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1 dark:text-red-400">{error}</p>}
    </div>
  );
};

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 high-contrast:text-white">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 high-contrast:border-2 high-contrast:border-yellow-400 high-contrast:bg-black high-contrast:text-white ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

// Checkbox component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', id, ...props }) => {
  return (
    <div className="flex items-center space-x-2 py-1 mb-2">
      <input
        type="checkbox"
        id={id}
        className={`h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-indigo-400 high-contrast:border-2 high-contrast:border-yellow-400 ${className}`}
        {...props}
      />
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300 high-contrast:text-white">
        {label}
      </label>
    </div>
  );
};

// Radio Group & Radio component
interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio: React.FC<RadioProps> = ({ label, className = '', id, ...props }) => {
  return (
    <div className="flex items-center space-x-2 py-1 mb-1">
      <input
        type="radio"
        id={id}
        className={`h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-indigo-400 high-contrast:border-2 high-contrast:border-yellow-400 ${className}`}
        {...props}
      />
      <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300 high-contrast:text-white">
        {label}
      </label>
    </div>
  );
};

// Avatar component
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', status }) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-slate-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500'
  };

  const initials = alt ? alt.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'GX';

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          className={`${sizeClasses[size]} rounded-full object-cover border border-slate-200 dark:border-slate-700`}
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900`}>
          {initials}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${statusClasses[status]}`} />
      )}
    </div>
  );
};

// Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverEffect = false, className = '', ...props }) => {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 bg-white p-5 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 high-contrast:border-2 high-contrast:border-white high-contrast:bg-black high-contrast:text-white transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Skeletons
export const SkeletonLoader: React.FC<{ lines?: number; circle?: boolean }> = ({ lines = 3, circle = false }) => {
  return (
    <div className="animate-pulse space-y-3 w-full">
      {circle && <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full" />}
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="h-4 bg-slate-200 dark:bg-slate-800 rounded"
          style={{ width: idx === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
};
