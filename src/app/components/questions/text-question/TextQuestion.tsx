'use client';

import React from 'react';
import styles from './TextQuestion.module.css';

interface TextDisplayProps {
  questionNumber?: string;
  questionTitle?: string;
  textContent?: string;
  imageUrl?: string; // إضافة خاصية لرابط الصورة
}

export default function TextDisplay({ 
  questionNumber = "",
  questionTitle = "",
  textContent = "",
  imageUrl
}: TextDisplayProps) {
  return (
    <div className={styles.questionContainer}>
      <div className={styles.mainContent}>
        <div className={styles.exerciseArea}>
          {/* عرض عنوان السؤال فقط إذا كان موجوداً */}
          {(questionNumber || questionTitle) && (
            <div className={styles.questionTitle}>
              {questionNumber && (
                <span className={styles.questionNumber}>
                  {questionNumber}
                </span>
              )}
              {questionTitle && (
                <span className={styles.questionText}>
                  {questionTitle}
                </span>
              )}
            </div>
          )}

          {/* صندوق النص */}
          <div className={styles.textBox}>
            <div className={styles.textLabel}>
              السند
            </div>
            <div className={styles.textContent}>
              {/* عرض الصورة إذا كانت متوفرة، وإلا عرض النص */}
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="نص التمرين" 
                  className={styles.textImage}
                />
              ) : (
                textContent
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}