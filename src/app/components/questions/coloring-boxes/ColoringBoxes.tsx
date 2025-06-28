'use client';

import React, { useState, useEffect } from 'react';
import styles from './ColoringBoxes.module.css';
import CollapsedText from '../collapsed-text/CollapsedText';
import { CONNECTION_EVENTS } from '@/app/exercises/[year]/[semester]/[subject]/[exerciceId]/[questionId]/page';

interface ColoringBoxesContent {
  vocabulary: Array<{
    id: string;
    text: string;
  }>;
  targetSentence?: string; // اختيارية بالفعل
}

interface ColoringBoxesProps {
  content: ColoringBoxesContent;
  questionNumber: string;
  questionTitle: string;
  textImage?: string; // إضافة دعم السند
  onComplete?: (selectedWords: string[]) => void; // إضافة callback اختياري
}

export default function ColoringBoxes({ 
  content, 
  questionNumber,
  questionTitle,
  textImage,
  onComplete
}: ColoringBoxesProps) {
  const [coloredBoxes, setColoredBoxes] = useState<Set<string>>(new Set());

  // دالة للتعامل مع النقر على الصندوق
  const handleBoxClick = (boxId: string) => {
    setColoredBoxes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(boxId)) {
        newSet.delete(boxId); // إزالة اللون إذا كان ملوناً
      } else {
        newSet.add(boxId); // إضافة اللون إذا لم يكن ملوناً
      }
      
      // إرسال النتيجة للمكون الأب
      if (onComplete) {
        onComplete(Array.from(newSet));
      }
      
      return newSet;
    });
  };

  // إضافة useEffect للاستماع لأحداث التراجع والإعادة
  useEffect(() => {
    const handleUndoEvent = () => {
      setColoredBoxes(prev => {
        if (prev.size > 0) {
          const newSet = new Set(prev);
          // إزالة آخر عنصر تم تلوينه
          const lastItem = Array.from(newSet).pop();
          if (lastItem) {
            newSet.delete(lastItem);
          }
          console.log("تراجع عن آخر تلوين");
          
          // إرسال النتيجة المحدثة
          if (onComplete) {
            onComplete(Array.from(newSet));
          }
          
          return newSet;
        }
        return prev;
      });
    };
    
    const handleResetEvent = () => {
      console.log("إعادة تعيين جميع الألوان");
      setColoredBoxes(new Set());
      
      // إرسال نتيجة فارغة
      if (onComplete) {
        onComplete([]);
      }
    };
    
    // تسجيل مستمعي الأحداث
    document.addEventListener(CONNECTION_EVENTS.UNDO, handleUndoEvent);
    document.addEventListener(CONNECTION_EVENTS.RESET, handleResetEvent);
    
    // تنظيف عند إلغاء تحميل المكون
    return () => {
      document.removeEventListener(CONNECTION_EVENTS.UNDO, handleUndoEvent);
      document.removeEventListener(CONNECTION_EVENTS.RESET, handleResetEvent);
    };
  }, [onComplete]);

  return (
    <div className={styles.questionContainer}>
      <div className={styles.mainContent}>
        <div className={`${styles.exerciseArea} ${styles.penCursor}`}>
          {/* عنوان السؤال */}
          <div className={styles.questionTitle}>
            <span className={styles.questionNumber}>
              {questionNumber}
            </span>
            <span className={styles.questionText}>
              {questionTitle}
            </span>
          </div>

          {/* الجملة المستهدفة - تظهر فقط إذا كانت متوفرة */}
          {content.targetSentence && (
            <div className={styles.targetSentence}>
              <span className={styles.bulletPoint}>•</span>
              <span className={styles.sentenceText}>
                {content.targetSentence}
              </span>
            </div>
          )}

          {/* منطقة الصناديق */}
          <div className={styles.coloringArea}>
            {content.vocabulary.map((item) => (
              <div
                key={item.id}
                className={`${styles.coloringBox} ${
                  coloredBoxes.has(item.id) ? styles.colored : styles.uncolored
                }`}
                onClick={() => handleBoxClick(item.id)}
                title={`انقر لتلوين: ${item.text}`}
              >
                <span className={styles.boxText}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}