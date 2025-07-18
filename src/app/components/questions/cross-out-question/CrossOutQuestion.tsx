'use client';

import React, { useState, useEffect } from 'react';
import styles from './CrossOutQuestion.module.css';
import { CONNECTION_EVENTS } from '@/app/exam/[uniqueId]/[questionOrder]/page';

interface Statement {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface CrossOutQuestionContent {
  statements: Statement[];
}

interface CrossOutQuestionProps {
  content: CrossOutQuestionContent;
  questionNumber: string;
  questionTitle: string;
}

export default function CrossOutQuestion({
  content,
  questionNumber,
  questionTitle
}: CrossOutQuestionProps) {
  const [crossedOutStatements, setCrossedOutStatements] = useState<Set<string>>(new Set());

  // دالة للتعامل مع النقر على العبارة
  const handleStatementClick = (statementId: string) => {
    setCrossedOutStatements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(statementId)) {
        newSet.delete(statementId); // إزالة الشطب إذا كانت مشطوبة
      } else {
        newSet.add(statementId); // إضافة الشطب إذا لم تكن مشطوبة
      }
      return newSet;
    });
  };

  // إضافة useEffect للاستماع لأحداث التراجع والإعادة
  useEffect(() => {
    const handleUndoEvent = () => {
      setCrossedOutStatements(prev => {
        if (prev.size > 0) {
          const newSet = new Set(prev);
          // إزالة آخر عنصر تم شطبه
          const lastItem = Array.from(newSet).pop();
          if (lastItem) {
            newSet.delete(lastItem);
          }
          console.log("تراجع عن آخر شطب");
          return newSet;
        }
        return prev;
      });
    };

    const handleResetEvent = () => {
      console.log("إعادة تعيين جميع الشطب");
      setCrossedOutStatements(new Set());
    };

    // تسجيل مستمعي الأحداث
    document.addEventListener(CONNECTION_EVENTS.UNDO, handleUndoEvent);
    document.addEventListener(CONNECTION_EVENTS.RESET, handleResetEvent);

    // تنظيف عند إلغاء تحميل المكون
    return () => {
      document.removeEventListener(CONNECTION_EVENTS.UNDO, handleUndoEvent);
      document.removeEventListener(CONNECTION_EVENTS.RESET, handleResetEvent);
    };
  }, []);

  return (
    <div className={styles.questionContainer}>
      <div className={styles.mainContent}>
        <div className={styles.exerciseArea}>
          {/* عنوان السؤال */}
          <div className={styles.questionTitle}>
            <span className={styles.questionNumber}>
              {questionNumber}
            </span>
            <span className={styles.questionText}>
              {questionTitle}
            </span>
          </div>

          {/* منطقة العبارات */}
          <div className={styles.statementsArea}>
            {content.statements.map((statement) => (
              <div
                key={statement.id}
                className={styles.statementContainer}
              >
                <span className={styles.bulletPoint}>•</span>
                <div
                  className={`${styles.statementText} ${crossedOutStatements.has(statement.id) ? styles.crossedOut : ''
                    }`}
                  onClick={() => handleStatementClick(statement.id)}
                  title={`انقر لشطب: ${statement.text}`}
                >
                  {statement.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}