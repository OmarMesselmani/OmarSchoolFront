'use client';

import React, { useState } from 'react';
import styles from './CollapsedText.module.css';

interface CollapsedTextProps {
  textImage: string;
  title?: string;
  className?: string;
}

export default function CollapsedText({ 
  textImage, 
  title = "عرض السند",
  className = ""
}: CollapsedTextProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.collapsedTextContainer} ${className}`}>
      {/* رأس الـ Accordion - قابل للنقر */}
      <div 
        className={`${styles.accordionHeader} ${isExpanded ? styles.expanded : ''}`}
        onClick={toggleExpansion}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpansion();
          }
        }}
      >
        <span className={styles.headerTitle}>
          {isExpanded ? "إخفاء السند" : "عرض السند"}
        </span>
        <div className={`${styles.accordionIcon} ${isExpanded ? styles.rotated : ''}`}>
          {/* أيقونة + عندما مغلق */}
          <svg 
            className={`${styles.plusIcon} ${isExpanded ? styles.hidden : styles.visible}`}
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 5V19M5 12H19" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          
          {/* أيقونة - عندما مفتوح */}
          <svg 
            className={`${styles.minusIcon} ${isExpanded ? styles.visible : styles.hidden}`}
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M5 12H19" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* محتوى الـ Accordion - قابل للطي */}
      <div className={`${styles.accordionContent} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        <div className={styles.contentInner}>
          <div className={styles.textImageContainer}>
            <img 
              src={textImage} 
              alt="السند النصي للتمرين" 
              className={styles.textImage}
              onError={(e) => {
                console.error('خطأ في تحميل صورة السند:', textImage);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}