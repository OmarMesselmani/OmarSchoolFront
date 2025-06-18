'use client';

import React from 'react';
import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
  text: string;
  type?: 'submit' | 'button' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  iconOnly?: React.ReactNode;
  customClass?: string;
  customStyles?: React.CSSProperties;
  title?: string;
}

export default function SubmitButton({
  text,
  type = 'submit',
  variant = 'primary',
  disabled = false,
  onClick,
  iconBefore,
  iconAfter,
  iconOnly,
  customClass = '',
  customStyles,
  title
}: SubmitButtonProps) {
  return (
    <div className={styles.buttonContainer}>
      <button
        type={type}
        className={`${styles.submitButton} ${customClass} flex items-center justify-center gap-2`}
        disabled={disabled}
        onClick={onClick}
        style={customStyles}
        title={title}
      >
        {iconBefore && !iconOnly && <span className="icon">{iconBefore}</span>}
        {text}
        {iconAfter && !iconOnly && <span className="icon">{iconAfter}</span>}
        {iconOnly}
      </button>
    </div>
  );
}
