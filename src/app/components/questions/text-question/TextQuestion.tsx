'use client';

import React, { useEffect, useState } from 'react';
import styles from './TextQuestion.module.css';
import { Student } from '@/app/data-structures/Student';

import Cookies from 'js-cookie';
interface TextDisplayProps {
  exerciseId?: number; // إضافة خاصية معرف التمرين
  student?: Student; // إضافة خاصية الطالب
}

interface segment {
  id: number;
  order: number;
  image_url?: string;
}

export default function TextDisplay({
  exerciseId,
  student,
}: TextDisplayProps) {
  const [isFullLoading, setIsFullLoading] = useState(true);
  const [questionTitle, setQuestionTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [exerciseOrder, setExerciseOrder] = useState(0);
  const [segments, setSegments] = useState<segment[]>([]);

  useEffect(() => {
    setIsFullLoading(true);

    fetch(`http://127.0.0.1:8000/student/get-exercise-data/${exerciseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${Cookies.get("token")}`,
      }
    })
      .then(res => {
        if (res.status === 401) {
          // Redirect to login
          window.location.href = "/auth/login";
          return null; // short‐circuit the chain
        }
        return res.json();
      })
      .then(data => {
        setSegments(data?.segments || []);
        setExerciseOrder(data?.exercise_order || 0);
        setQuestionTitle(data?.title || '');
        setInstruction(data?.instruction || '');

      })
      .catch(err => console.error(err))
      .finally(() => setIsFullLoading(false));
  }, [exerciseId]);
  return (
    <div className={styles.questionContainer}>
      <div className={styles.mainContent}>
        <div className={styles.exerciseArea}>
          {/* عرض عنوان السؤال فقط إذا كان موجوداً */}
          {(questionTitle) && (
            <div className={styles.questionTitle}>
              {exerciseOrder && (
                <span className={styles.questionNumber}>
                  {exerciseOrder}
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
              {
                segments.map((segment) => (
                  <div key={segment.id} className={styles.textSegment}>
                    {segment.image_url && (
                      <img
                        src={segment.image_url}
                        alt={`Segment ${segment.order}`}
                        className={styles.textImage}
                      />
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}