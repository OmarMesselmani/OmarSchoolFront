'use client'
import React from 'react'
import { HiChevronLeft, HiCheckCircle } from 'react-icons/hi'

interface SubmitAndNextButtonProps {
  onClick: () => void
  isLastQuestion?: boolean
  isLoading?: boolean
  isFinished?: boolean
  className?: string
  buttonText?: string
  nextText?: string
  finishText?: string
}

const SubmitAndNextButton: React.FC<SubmitAndNextButtonProps> = ({
  onClick,
  isLoading = false,
  isLastQuestion = false,
  isFinished = false,
  className = '',
  buttonText,
  nextText = 'التالي',
  finishText = 'إنهاء',
}) => {
  const displayText = buttonText || (isLastQuestion ? finishText : nextText)

  // disable when finished or loading
  const disabled = isFinished || isLoading

  return (
    <div className="w-full flex justify-center mt-2 mb-3">
      <button
        onClick={() => {
          if (!disabled) onClick()
        }}
        disabled={disabled}
        className={`
          bg-gray-200 hover:bg-gray-300 text-gray-700
          py-3 px-6 rounded-full shadow-md
          transition-colors duration-300
          flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <span className="text-base font-medium">{displayText}</span>

        {isLoading ? (
          <div
            className="
              inline-block h-5 w-5 animate-spin rounded-full
              border-2 border-solid border-current border-r-transparent
              align-[-0.125em] text-white
              motion-reduce:animate-[spin_1.5s_linear_infinite]
            "
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        ) : isFinished ? (
          <HiCheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <HiChevronLeft className="w-5 h-5 rtl:rotate-180" />
        )}
      </button>
    </div>
  )
}

export default SubmitAndNextButton