'use client';

import { useRouter, useParams, usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import ExerciseLayout from '@/app/components/exercise-layout/ExerciseLayout';
import { EXERCISES_CONFIG, ExerciseConfig, QuestionConfig } from '@/app/config/exerciseConfig';
import QuestionRenderer from '@/app/components/questions/QuestionRenderer';
import Cookies from 'js-cookie';
import { Student } from '@/app/data-structures/Student';
import { ExamWithExercises } from '@/app/data-structures/Exam';

// واجهة بيانات الهيدر
interface HeaderData {
  trimester: string;
  unit: string;
  title?: string;
  grade: string;
  studentName?: string;
  exerciseId: string;
}

// ✅ تصدير الثوابت
export const CONNECTION_EVENTS = {
  UNDO: 'connection-undo',
  RESET: 'connection-reset'
};

// --- دالة مساعدة لاستخلاص الرقم من السلسلة النصية ---
const extractNumberFromSlug = (slug: string | undefined | null, prefix: string): number => {
  if (slug && slug.startsWith(prefix)) {
    const num = parseInt(slug.substring(prefix.length), 10);
    return isNaN(num) ? 1 : num;
  }
  return 1;
};

// ✅ دالة محدثة للتعامل مع تنسيق "qs" فقط
const extractQuestionNumber = (slug: string | undefined | null): number => {
  // التحقق من تنسيق "qs" فقط
  if (slug && slug.startsWith('qs')) {
    const num = parseInt(slug.substring(2), 10); // إزالة "qs" والحصول على الرقم
    return isNaN(num) ? 1 : num;
  }

  // إذا كان التنسيق غير صحيح، إرجاع قيمة افتراضية
  console.warn(`Invalid question format: ${slug}. Expected format: qs[number]`);
  return 1;
};

// ✅ إضافة التحقق من تنسيق السؤال والتوجيه التلقائي
export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  // --- الحالة (State) ---
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [examData, setExamData] = useState<ExamWithExercises | null>(null);

  // --- استخراج ومعالجة params بدون قيم افتراضية ---
  const exerciseSlug = params?.exerciceId as string;
  const questionSlug = params?.questionId as string;
  const yearParam = params?.year as string;
  const subjectParam = params?.subject as string;
  const unitParam = params?.unit as string;

  console.log('URL Parameters:', { exerciseSlug, questionSlug, yearParam, subjectParam, unitParam });

  // التحقق من وجود المعاملات المطلوبة
  if (!exerciseSlug || !questionSlug || !yearParam || !subjectParam) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        خطأ: معاملات الرابط غير صحيحة
      </div>
    );
  }

  // ✅ إضافة: التحقق من تنسيق السؤال وإعادة التوجيه إذا لزم الأمر
  if (!questionSlug.startsWith('qs')) {
    // تحويل التنسيق القديم إلى الجديد
    const correctQuestionSlug = questionSlug.startsWith('question')
      ? `qs${questionSlug.substring(8)}` // تحويل question1 إلى qs1
      : 'qs1'; // قيمة افتراضية

    const correctPath = pathname.replace(`/${questionSlug}`, `/${correctQuestionSlug}`);
    console.log(`Redirecting from ${questionSlug} to ${correctQuestionSlug}`);

    // إعادة توجيه فورية
    router.replace(correctPath);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">جاري إعادة التوجيه إلى التنسيق الصحيح...</div>
      </div>
    );
  }

  // تعديل استخلاص رقم السؤال
  const currentExerciseNumber = extractNumberFromSlug(exerciseSlug, "exercise");
  const currentQuestionNumber = extractQuestionNumber(questionSlug);

  console.log('Extracted Numbers:', { currentExerciseNumber, currentQuestionNumber });

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
      const token = Cookies.get('token');
      if (!token) {
        window.location.href = '/login';
      }

      const response = await fetch(`http://127.0.0.1:8000/student/exam/1`, {
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
      console.log("Exam data fetched successfully:", examData);
    } catch (error: any) {
      console.error("Error fetching student data:", error.message);
    }
  };

  // --- دالة لجلب تكوين التمرين ---
  const getExerciseConfig = (): ExerciseConfig | null => {
    const exerciseKey = `exercise${currentExerciseNumber}`;
    console.log('Looking for exercise config:', exerciseKey);
    const config = EXERCISES_CONFIG[exerciseKey] || null;
    console.log('Found exercise config:', config);
    return config;
  };

  // --- دالة لجلب تكوين السؤال الحالي ---
  const getCurrentQuestionConfig = (): QuestionConfig | null => {
    const exerciseConfig = getExerciseConfig();
    if (!exerciseConfig) return null;
    

    const questionIndex = currentQuestionNumber - 1;
    console.log('Looking for question at index:', questionIndex);
    const questionConfig = exerciseConfig.questions[questionIndex] || null;
    console.log('Found question config:', questionConfig);
    return questionConfig;
  };

  // --- جلب بيانات الطالب ---
  useEffect(() => {
    fetchStudentData();
    fetchExamData();
  }, []);

  // --- جلب البيانات ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`Loading data for exercise: ${currentExerciseNumber}, question: ${currentQuestionNumber}`);

        // الحصول على تكوين التمرين
        const exerciseConfig = getExerciseConfig();
        if (!exerciseConfig) {
          throw new Error(`التمرين رقم ${currentExerciseNumber} غير موجود`);
        }


        const studentFullName = student
          ? `${student.name} ${student.surname}`
          : "";

        const exerciseKey = `exercise${currentExerciseNumber}`;

        const fetchedHeaderData: HeaderData = {
          trimester: examData?.semester?.name,
          unit: examData?.subject?.name,
          grade: examData?.grade?.name,
          studentName: studentFullName,
          exerciseId: exerciseKey
        };

        setHeaderData(fetchedHeaderData);
        setTotalQuestions(exerciseConfig.questions.length);

      } catch (err) {
        console.error("Failed to fetch exercise data:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب البيانات.");
        setHeaderData(null);
        setTotalQuestions(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (exerciseSlug && questionSlug && yearParam && subjectParam) {
      fetchData();
    }
  }, [currentExerciseNumber, currentQuestionNumber, yearParam, subjectParam, unitParam, student]);

  // --- دوال التحكم ---
  const handleNavigateNext = () => {
    console.log("التحقق من الإجابة...");

    if (currentQuestionNumber < totalQuestions) {
      const nextQuestionNumber = currentQuestionNumber + 1;
      const nextQuestionSlug = `qs${nextQuestionNumber}`;

      const basePathParts = pathname.split('/');
      basePathParts.pop();
      const basePathWithoutQuestion = basePathParts.join('/');

      const nextPath = `${basePathWithoutQuestion}/${nextQuestionSlug}`;
      console.log(`Navigating to: ${nextPath}`);
      router.push(nextPath);
    } else {
      console.log("انتهاء التمرين!");
      router.push('/dashboard-user?section=home');
    }
  };

  const handleStepChange = (step: number) => {
    if (step !== currentQuestionNumber) {
      const stepSlug = `qs${step}`;
      const basePathParts = pathname.split('/');
      basePathParts.pop();
      const basePathWithoutQuestion = basePathParts.join('/');

      const nextPath = `${basePathWithoutQuestion}/${stepSlug}`;
      console.log(`Navigating directly to step: ${nextPath}`);
      router.push(nextPath);
    }
  };

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

  const handleNavigateToNextExercise = () => {
    if (currentQuestionNumber === totalQuestions) {
      const nextExerciseNumber = currentExerciseNumber + 1;
      const nextExercisePath = `/exercises/${yearParam}/${subjectParam}/${unitParam}/exercise${nextExerciseNumber}/qs1`;

      const nextExerciseKey = `exercise${nextExerciseNumber}`;
      if (EXERCISES_CONFIG[nextExerciseKey]) {
        console.log(`Navigating to next exercise: ${nextExercisePath}`);
        router.push(nextExercisePath);
      } else {
        console.log("No next exercise available");
        router.push('/dashboard-user?section=home');
      }
    }
  };

  // --- العرض (Render) ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">جاري تحميل السؤال...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        خطأ: {error}
      </div>
    );
  }

  const exerciseConfig = getExerciseConfig();
  const currentQuestionConfig = getCurrentQuestionConfig();

  if (!headerData || !exerciseConfig || !currentQuestionConfig) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        لا يمكن عرض بيانات التمرين. تأكد من صحة الرابط.
        <br />
        <small>
          التمرين: {currentExerciseNumber}, السؤال: {currentQuestionNumber}
        </small>
      </div>
    );
  }

  return (
    <ExerciseLayout
      headerData={headerData}
      totalSteps={examData?.exercises_count || 0}
      currentStep={currentQuestionNumber}
      onStepChange={handleStepChange}
      onNavigateNext={handleNavigateNext}
      isLastQuestion={currentQuestionNumber === totalQuestions}
      onClose={handleClose}
      onUndo={handleUndo}
      onReset={handleReset}
      onNavigateToNextExercise={handleNavigateToNextExercise}
    >
      {/* displayin the current question */}
      <QuestionRenderer
        questionConfig={currentQuestionConfig}
        exerciseAssets={exerciseConfig.assets}
      />
    </ExerciseLayout>
  );
}