'use client';

import React from 'react';
import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
  buttonText: string;
  isLoading?: boolean;
  className?: string;
}

export default function SubmitButton({
  buttonText,
  isLoading = false,
  className = ''
}: SubmitButtonProps) {
  return (
    <div className={styles.buttonContainer}>
      <button
        type="submit"
        className={`${styles.submitButton} ${className} flex items-center justify-center gap-2`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div
              className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
}
