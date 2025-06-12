// المسار: ./app/exercises/[year]/[subject]/[unit]/[exerciseId]/[questionId]/page.tsx
'use client';

import { useRouter, useParams, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ExerciseLayout from '@/app/components/exercise-layout/ExerciseLayout'; // تأكد من المسار
import MatchingQuestion from '@/app/components/questions/matching-question/MatchingQuestion'; // تأكد من المسار

// واجهة مقترحة لبيانات السؤال (يمكن تعديلها حسب الحاجة)
interface QuestionData {
  items: { id: string; text: string }[];
  images: { id: string; url: string }[];
  // أضف هنا الإجابات الصحيحة إذا أردت جلبها للتحقق
  // correctConnections?: { start: string; end: string }[];
}

// واجهة مقترحة لبيانات الهيدر (عدلها لتناسب بياناتك)
interface HeaderData {
  trimester: string;
  unit: string;
  title: string;
  grade: string;
  studentName: string; // قد يأتي هذا من مكان آخر (مثل حالة المستخدم العامة)
}

// --- دالة مساعدة لاستخلاص الرقم من السلسلة النصية ---
// السطر الجديد: دالة مساعدة
const extractNumberFromSlug = (slug: string | undefined | null, prefix: string): number => {
  if (slug && slug.startsWith(prefix)) {
    return parseInt(slug.substring(prefix.length), 10);
  }
  return NaN; // أو أي قيمة افتراضية أو معالجة خطأ مناسبة
};

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname(); // المسار الكامل الحالي e.g., /exercises/y1/subj/unit1/exercise1/question1

  // --- الحالة (State) ---
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // حالة لتخزين رسائل الخطأ

  // --- استخراج ومعالجة params ---
  // السطر المعدل: استخدام الدالة المساعدة لاستخلاص الأرقام
  const exerciseSlug = params?.exerciseId as string;
  const questionSlug = params?.questionId as string;

  const currentExerciseNumber = extractNumberFromSlug(exerciseSlug, "exercise");
  const currentQuestionNumber = extractNumberFromSlug(questionSlug, "question");

  // يمكنك استخراج باقي params بنفس الطريقة (year, subject, unit)
  const yearParam = params?.year as string;
  const subjectParam = params?.subject as string;
  const unitParam = params?.unit as string;


  // --- جلب البيانات ---
  useEffect(() => {
    // السطر المعدل: التأكد من أن لدينا أرقام صالحة للتمرين والسؤال
    if (!isNaN(currentExerciseNumber) && !isNaN(currentQuestionNumber)) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        // السطر المعدل: استخدام الأرقام في رسالة الـ console
        console.log(`Workspaceing data for exercise: ${currentExerciseNumber}, question: ${currentQuestionNumber}`);

        try {
          // ==============================================================
          // !!! هام: استبدل هذا الجزء بمنطق جلب البيانات الفعلي من الـ API !!!
          // ستحتاج لإرسال currentExerciseNumber و currentQuestionNumber للـ API
          // ==============================================================
          console.warn("Using placeholder data. Replace with actual API call.");
          await new Promise(resolve => setTimeout(resolve, 500));
          const fetchedTotalQuestions = 5;
          const fetchedHeaderData = {
            // السطر المعدل: استخدام الأرقام أو params في بيانات الهيدر
            trimester: `الثلاثي ${currentExerciseNumber}`,
            unit: `الوحدة ${unitParam || '?'}`,
            title: `تمرين ${currentExerciseNumber} - سؤال ${currentQuestionNumber}`,
            grade: `السنة ${yearParam || '?'}`,
            studentName: "أحمد بن علي"
          };
          const fetchedQuestionData = {
              items: [
                  { id: `t${currentQuestionNumber}-1`, text: `نص السؤال ${currentQuestionNumber} - 1` },
                  { id: `t${currentQuestionNumber}-2`, text: `نص السؤال ${currentQuestionNumber} - 2` },
              ],
              images: [
                  { id: `i${currentQuestionNumber}-1`, url: `/images/placeholder${currentQuestionNumber}A.png` },
                  { id: `i${currentQuestionNumber}-2`, url: `/images/placeholder${currentQuestionNumber}B.png` },
              ]
          };

          setTotalQuestions(fetchedTotalQuestions);
          setHeaderData(fetchedHeaderData);
          setQuestionData(fetchedQuestionData);

        } catch (err) {
          console.error("Failed to fetch exercise data:", err);
          setError(err instanceof Error ? err.message : "حدث خطأ غير معروف أثناء جلب البيانات.");
          setHeaderData(null);
          setQuestionData(null);
          setTotalQuestions(0);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setError("المعرفات المطلوبة للسؤال أو التمرين غير موجودة في المسار أو أن صيغتها غير صحيحة.");
      setIsLoading(false);
    }
  }, [params, currentExerciseNumber, currentQuestionNumber, yearParam, unitParam]); // تحديث الاعتماديات


  // --- دوال التحكم ---
  const handleNavigateNext = () => {
    console.log("التحقق من الإجابة (لم يتم التنفيذ بعد)...");
    // السطر المعدل: استخدام currentQuestionNumber
    if (currentQuestionNumber < totalQuestions) {
      // السطر المعدل: استخدام currentQuestionNumber لبناء nextQuestionSlug
      const nextQuestionNumber = currentQuestionNumber + 1;
      const nextQuestionSlug = `question${nextQuestionNumber}`;

      // بناء المسار الأساسي بدون معرّف السؤال الحالي
      // e.g., /exercises/year1/reading/introductory/exercise1
      const basePathParts = pathname.split('/');
      basePathParts.pop(); // إزالة questionSlug القديم
      const basePathWithoutQuestion = basePathParts.join('/');

      const nextPath = `${basePathWithoutQuestion}/${nextQuestionSlug}`;
      console.log(`Navigating to: ${nextPath}`);
      router.push(nextPath);
    } else {
      console.log("انتهاء التمرين!");
      // مثال للانتقال للتمرين التالي (يتطلب منطق إضافي لتحديد التمرين التالي)
      // const nextExerciseNumber = currentExerciseNumber + 1;
      // router.push(`/exercises/${yearParam}/${subjectParam}/${unitParam}/exercise${nextExerciseNumber}/question1`);
      router.push('/dashboard-user?section=home');
    }
  };

  const handleStepChange = (step: number) => { // step هنا هو الرقم
    // السطر المعدل: استخدام currentQuestionNumber للمقارنة
    if (!isNaN(currentQuestionNumber) && step !== currentQuestionNumber) {
        const stepSlug = `question${step}`;
        const basePathParts = pathname.split('/');
        basePathParts.pop(); // Remove current question slug
        const basePathWithoutQuestion = basePathParts.join('/');

        const nextPath = `${basePathWithoutQuestion}/${stepSlug}`;
        console.log(`Navigating directly to step: ${nextPath}`);
        router.push(nextPath);
    }
  };

  const handleClose = () => {
    router.push('/dashboard-user?section=home');
  };

  const handleUndo = () => {
    console.warn("Undo function needs proper implementation.");
  };

  const handleReset = () => {
    console.warn("Reset function needs proper implementation.");
  };

  // --- العرض (Render) ---
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">جاري تحميل السؤال...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">خطأ: {error}</div>;
  }
  // السطر المعدل: استخدام currentQuestionNumber للتحقق
  if (!headerData || !questionData || totalQuestions === 0 || isNaN(currentQuestionNumber)) {
     return <div className="flex justify-center items-center min-h-screen text-red-600">لا يمكن عرض بيانات التمرين. تأكد من صحة الرابط.</div>;
  }

  return (
    <ExerciseLayout
        headerData={headerData}
        totalSteps={totalQuestions}
        // السطر المعدل: تمرير currentQuestionNumber
        currentStep={currentQuestionNumber}
        onStepChange={handleStepChange}
        onNavigateNext={handleNavigateNext}
        // السطر المعدل: استخدام currentQuestionNumber
        isLastQuestion={currentQuestionNumber === totalQuestions}
        onClose={handleClose}
        onUndo={handleUndo}
        onReset={handleReset}
    >
        <MatchingQuestion
            items={questionData.items}
            images={questionData.images}
        />
    </ExerciseLayout>
  );
}