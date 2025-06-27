'use client';

import React from 'react';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlineChevronRight, HiOutlineChevronLeft } from 'react-icons/hi';

interface ProgressStepperProps {
  totalSteps: number;
  currentStep: number;
  onStepChange?: (step: number) => void;
  allowNavigation?: boolean;
  showNavigationButtons?: boolean;
  onNextExercise?: () => void;
  onPrevExercise?: () => void;
  showExerciseNavigation?: boolean;
  isLastQuestion?: boolean;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  totalSteps,
  currentStep,
  onStepChange,
  allowNavigation = false,
  showNavigationButtons = true,
  onNextExercise,
  onPrevExercise,
  showExerciseNavigation = true,
  isLastQuestion = false,
}) => {
  const validTotalSteps = Math.max(1, totalSteps);
  const validCurrentStep = Math.min(Math.max(1, currentStep), validTotalSteps);
  
  const isFirstStep = validCurrentStep === 1;
  const isLastStep = validCurrentStep === validTotalSteps;

  const handleStepClick = (stepIndex: number) => {
    if (allowNavigation && onStepChange) {
      onStepChange(stepIndex);
    }
  };

  const handlePrevStep = () => {
    if (!isFirstStep && onStepChange) {
      onStepChange(validCurrentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (!isLastStep && onStepChange) {
      onStepChange(validCurrentStep + 1);
    }
  };

  return (
    <div className="w-full py-4 flex justify-center items-center px-4 z-10 mt-4 mb-[30px]">
      <div className="flex w-full max-w-4xl mx-auto items-center gap-4 px-4">
        {/* أزرار التنقل بين الأسئلة والتمارين */}
        <div className="flex items-center gap-2">
          {/* زر التمرين السابق */}
          {showExerciseNavigation && (
            <button 
              className={`flex items-center justify-center w-9 h-9 rounded-full 
                ${onPrevExercise 
                  ? 'bg-gray-400 text-white hover:bg-gray-500' 
                  : 'bg-gray-300 text-gray-500'} 
                transition-colors`}
              onClick={onPrevExercise}
              disabled={!onPrevExercise}
              title="التمرين السابق"
            >
              <HiOutlineChevronDoubleLeft size={18} className="rtl:rotate-180" />
            </button>
          )}

          {/* زر السؤال السابق */}
          {showNavigationButtons && (
            <button 
              className={`flex items-center justify-center w-9 h-9 rounded-full ${
                !isFirstStep ? 'bg-[#DD2946] text-white hover:bg-[#c12340]' : 'bg-gray-300 text-gray-500'
              } transition-colors`}
              onClick={handlePrevStep}
              disabled={isFirstStep}
              title="السؤال السابق"
            >
              <HiOutlineChevronRight size={18} />
            </button>
          )}
        </div>
        
        {/* شريط التقدم */}
        <div className="flex gap-2 flex-1">
          {Array.from({ length: validTotalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === validCurrentStep;
            const isPast = stepNumber < validCurrentStep;
            
            return (
              <div
                key={`step-${index}`}
                className={`
                  h-1 rounded-full flex-1 transition-all duration-300
                  ${isActive ? 'bg-[#DD2946]' : isPast ? 'bg-gray-400' : 'bg-gray-300'}
                  ${allowNavigation ? 'cursor-pointer' : ''}
                `}
                style={{
                  transform: isActive ? 'scaleY(1.5)' : 'scaleY(1)',
                }}
                onClick={() => handleStepClick(stepNumber)}
                title={`السؤال ${stepNumber} من ${validTotalSteps}`}
              />
            );
          })}
        </div>
        
        {/* أزرار التنقل التالية */}
        <div className="flex items-center gap-2">
          {/* زر السؤال التالي */}
          {showNavigationButtons && (
            <button 
              className={`flex items-center justify-center w-9 h-9 rounded-full ${
                !isLastStep ? 'bg-[#DD2946] text-white hover:bg-[#c12340]' : 'bg-gray-300 text-gray-500'
              } transition-colors`}
              onClick={handleNextStep}
              disabled={isLastStep}
              title="السؤال التالي"
            >
              <HiOutlineChevronLeft size={18} />
            </button>
          )}

          {/* زر التمرين التالي - تحديث المنطق */}
          {showExerciseNavigation && (
            <button 
              className={`flex items-center justify-center w-9 h-9 rounded-full 
                ${(onNextExercise && isLastQuestion) 
                  ? 'bg-[#DD2946] text-white hover:bg-[#c12340]' // اللون الرئيسي عند آخر سؤال
                  : onNextExercise 
                    ? 'bg-gray-400 text-white hover:bg-gray-500' // رمادي بدلاً من الأزرق
                    : 'bg-gray-300 text-gray-500'} 
                transition-colors`}
              onClick={onNextExercise}
              disabled={!onNextExercise || !isLastQuestion} // تفعيل الزر فقط في آخر سؤال
              title="التمرين التالي"
            >
              <HiOutlineChevronDoubleRight size={18} className="rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;