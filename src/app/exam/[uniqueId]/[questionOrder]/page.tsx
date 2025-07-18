'use client';

import { useRouter, useParams, usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import ExerciseLayout from '@/app/components/exercise-layout/ExerciseLayout';
import Cookies from 'js-cookie';
import { Student } from '@/app/data-structures/Student';
import { ExamWithExercises } from '@/app/data-structures/Exam';
import LoadingPage from '@/app/components/loading-page/LoadingPage';



// ✅ تصدير الثوابت
export const CONNECTION_EVENTS = {
  UNDO: 'connection-undo',
  RESET: 'connection-reset'
};




// ✅ إضافة التحقق من تنسيق السؤال والتوجيه التلقائي
export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();

  // --- الحالة (State) ---
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [examData, setExamData] = useState<ExamWithExercises | null>(null);


  const unique_id = params?.uniqueId as string;


  // التحقق من وجود المعاملات المطلوبة
  if (!unique_id) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        خطأ: معاملات الرابط غير صحيحة
      </div>
    );
  }




  // --- دالة جلب بيانات الطالب ---
  const fetchStudentData = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.log('No authentication token found');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/parent/get-selected-student`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch student data.");
      }

      const data = await response.json();
      setStudent(data.student);
      console.log("Student data fetched successfully:", data.student);

    } catch (error: any) {
      console.error("Error fetching student data:", error.message);
      setStudent(null);
    }
  };

  //lena besh njib el exam
  const fetchExamData = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get('token');
      if (!token) {
        window.location.href = '/login';
      }

      const response = await fetch(`http://127.0.0.1:8000/student/exam/${unique_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch student data.");
      }

      const data = await response.json();
      setExamData(data);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching student data:", error.message);
      setIsLoading(false);
    }
  };


  // --- جلب بيانات الطالب ---
  useEffect(() => {
    fetchStudentData();
    fetchExamData();
  }, []);



  const handleClose = () => {
    router.push('/dashboard-user?section=home');
  };

  // ✅ الآن CONNECTION_EVENTS مُعرّف ويمكن الوصول إليه
  const handleUndo = useCallback(() => {
    document.dispatchEvent(new CustomEvent(CONNECTION_EVENTS.UNDO));
    console.log("تم إرسال أمر التراجع");
  }, []);

  const handleReset = useCallback(() => {
    document.dispatchEvent(new CustomEvent(CONNECTION_EVENTS.RESET));
    console.log("تم إرسال أمر إعادة الضبط");
  }, []);

  // const handleNavigateToNextExercise = () => {
  //   if (currentQuestionNumber === totalQuestions) {
  //     const nextExerciseNumber = currentExerciseNumber + 1;
  //     const nextExercisePath = `/exercises/${yearParam}/${subjectParam}/${unitParam}/exercise${nextExerciseNumber}/qs1`;

  //     const nextExerciseKey = `exercise${nextExerciseNumber}`;
  //     if (EXERCISES_CONFIG[nextExerciseKey]) {
  //       console.log(`Navigating to next exercise: ${nextExercisePath}`);
  //       router.push(nextExercisePath);
  //     } else {
  //       console.log("No next exercise available");
  //       router.push('/dashboard-user?section=home');
  //     }
  //   }
  // };

  // --- العرض (Render) ---
  if (isLoading) {
    return (
      <LoadingPage />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        خطأ: {error}
      </div>
    );
  }

  // const exerciseConfig = getExerciseConfig();
  // const currentQuestionConfig = getCurrentQuestionConfig();

  // if (!headerData || !exerciseConfig || !currentQuestionConfig) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen text-red-600">
  //       لا يمكن عرض بيانات التمرين. تأكد من صحة الرابط.
  //       <br />
  //       <small>
  //         التمرين: {currentExerciseNumber}, السؤال: {currentQuestionNumber}
  //       </small>
  //     </div>
  //   );
  // }

  return (
    <ExerciseLayout
      student={student}
      examData={examData}
      exercises={examData?.exercises || []}
      examUniqueId={unique_id}
      totalSteps={examData?.exercises_count || 0}
      onClose={handleClose}
      onUndo={handleUndo}
      onReset={handleReset}
    // onNavigateToNextExercise={handleNavigateToNextExercise}
    >
      {/* displayin the current question */}
      {/* <QuestionRenderer
        questionConfig={currentQuestionConfig}
        exerciseAssets={exerciseConfig.assets}
      /> */}
    </ExerciseLayout>
  );
}