// المسار المقترح: src/app/components/continue-button/page.tsx

'use client';

import React from 'react';
// تأكد من أن المسار صحيح لملف CSS
import styles from './page.module.css';

interface ContinueButtonProps {
  onClick: () => void; // دالة النقر (مطلوبة)
  buttonText?: string; // نص الزر (اختياري)
  isLoading?: boolean; // حالة التحميل (اختياري)
  className?: string; // كلاسات إضافية (اختياري)
  disabled?: boolean; // خاصية التعطيل (اختياري)
}

export default function ContinueButton({
  onClick,
  buttonText = "المتابعة", // النص الافتراضي
  isLoading = false,
  className = '',
  disabled = false
}: ContinueButtonProps) {
  return (
    <button
      type="button" // ليس submit افتراضيًا
      // إزالة flex إذا لم تعد هناك حاجة لتوسيط السبينر
      className={`${styles.continueButton} ${className}`}
      // تعطيل الزر إذا كان قيد التحميل أو تم تمرير disabled
      disabled={isLoading || disabled}
      onClick={onClick}
    >
       {/* عرض النص دائمًا */}
      {buttonText}
    </button>
  );
}

