import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { AuthService } from '../../services/AuthService';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { score, feedback } = AuthService.checkPasswordStrength(password);

  const colors = [
    'bg-gray-300 dark:bg-gray-700',
    'bg-red-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-emerald-500'
  ];

  const labels = [
    'Too Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong & Secure'
  ];

  return (
    <div id="password-strength-container" className="mt-3 space-y-2 text-xs">
      <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
        <span>Password Strength:</span>
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {labels[score]}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-full rounded-full transition-all duration-300 ${
              index < score ? colors[score] : 'bg-gray-200 dark:bg-gray-800'
            }`}
          />
        ))}
      </div>

      {feedback.length > 0 && (
        <ul className="space-y-1 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          {feedback.map((item, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
