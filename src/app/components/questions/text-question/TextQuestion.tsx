'use client';

import React, { useEffect, useState } from 'react';
import styles from './TextQuestion.module.css';
import { Student } from '@/app/data-structures/Student';

import Cookies from 'js-cookie';
import SubmitAndNextButton from '../../submit-and-next-button/page';
import { useParams } from 'next/navigation';
import LoadingPage from '../../loading-page/LoadingPage';
import { ExerciseStatus } from '@/app/data-structures/Exam';
interface TextDisplayProps {
  exerciseId?: number; // إضافة خاصية معرف التمرين
  student?: Student; // إضافة خاصية الطالب
  handleStepChange?: (step: number) => void; // إضافة هذا
}

interface segment {
  id: number;
  order: number;
  image_url?: string;
}

export default function TextDisplay({
  exerciseId,
  student,
  handleStepChange,
}: TextDisplayProps) {
  const [isFullLoading, setIsFullLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [exerciseOrder, setExerciseOrder] = useState(0);
  const [segments, setSegments] = useState<segment[]>([]);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [status, setStatus] = useState<ExerciseStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const handleNextStep = () => {
    if (handleStepChange) {
      handleStepChange(currentStep + 1);
    }
  };

  const stringCurrentStep = params?.questionOrder as string;
  const currentStep = parseInt(stringCurrentStep); // تحويل المعامل إلى رقم صحيح
  const examUniqueId = params?.uniqueId as string;
  const packUniqueCode = params?.packUniqueCode as string;
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://127.0.0.1:8000/student/image-reading/submit-exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          student_id: student?.id, // Your logic for student ID
          exercise_id: exerciseId, // Your logic for exercise ID
          exam_unique_id: examUniqueId, // Pass the exam unique ID if needed
          current_step: currentStep, // Pass the current step
          pack_unique_code: packUniqueCode, // Pass the pack unique code
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setExerciseFinished(true);
        setLoading(false);
        handleNextStep(); // Navigate to the next step if needed
      } else {
        console.error("Submission error:", result.error);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setLoading(false);
    }
  };
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

  useEffect(() => {
    const token = Cookies.get("token");
    setIsFullLoading(true);
    fetch(`http://127.0.0.1:8000/student/exercise/exercise-status/${student?.id}/${exerciseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${token}`,
      }
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus(data);
          setExerciseFinished(data.finished);
        } else {
          setError(data.error || "Unknown error occurred.");
        }
        setIsFullLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch exercise status.");
        setIsFullLoading(false);
      });
  }, [exerciseId, student?.id]);
  if (isFullLoading) {
    <LoadingPage />;
  }
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
          <SubmitAndNextButton
            isFinished={exerciseFinished}
            isLoading={loading}
            onClick={handleSubmit}
            isLastQuestion={false}
          />
        </div>
      </div>
    </div>
  );
}