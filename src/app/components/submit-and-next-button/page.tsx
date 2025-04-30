'use client';
import React from 'react';

interface SubmitAndNextButtonProps {
  onClick: () => void;
  isLastQuestion?: boolean; 
  className?: string;
  buttonText?: string;
  nextText?: string;
  finishText?: string;
}

const SubmitAndNextButton: React.FC<SubmitAndNextButtonProps> = ({
  onClick,
  isLastQuestion = false,
  className = '',
  buttonText,
  nextText = 'التالي',
  finishText = 'إنهاء'
}) => {
  // تحديد النص المناسب للعرض (التالي أو إنهاء)
  const displayText = buttonText || (isLastQuestion ? finishText : nextText);
  
  return (
    <div className="w-full flex justify-center mt-2 mb-3">
      <button 
        className={`bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-full shadow-md transition-colors duration-300 flex items-center justify-center gap-2 ${className}`}
        onClick={onClick}
      >
        <span className="text-base font-medium">{displayText}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default SubmitAndNextButton;