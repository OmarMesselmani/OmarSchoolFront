'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CloseButtonProps {
  onClose?: () => void;
  redirectPath?: string; // مسار إعادة التوجيه الاختياري
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'; // موضع الزر
  size?: 'sm' | 'md' | 'lg'; // حجم الزر
  customClassName?: string; // تخصيص إضافي للأنماط
  darkMode?: boolean; // خيار للوضع الداكن
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onClose,
  redirectPath = '/dashboard-user?section=home', // المسار الافتراضي
  position = 'top-right', // الموضع الافتراضي
  size = 'md', // الحجم الافتراضي
  customClassName = '',
  darkMode = false,
}) => {
  const router = useRouter();

  // تحديد أحجام الزر بناءً على الخيار المحدد - تصغير الأحجام
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  // تحديد مواضع الزر بناءً على الخيار المحدد
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const handleClick = () => {
    if (onClose) {
      onClose();
    } else if (redirectPath) {
      router.push(redirectPath);
    }
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50 ${sizeClasses[size]} rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} flex items-center justify-center cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-500'} transition-colors ${customClassName}`}
      onClick={handleClick}
      title="إغلاق"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size === 'sm' ? '12' : size === 'lg' ? '20' : '16'} 
        height={size === 'sm' ? '12' : size === 'lg' ? '20' : '16'} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  );
};

export default CloseButton;