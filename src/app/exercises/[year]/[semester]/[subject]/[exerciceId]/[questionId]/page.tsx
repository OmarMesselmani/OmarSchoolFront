'use client';

import { useRouter, useParams, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ExerciseLayout from '@/app/components/exercise-layout/ExerciseLayout';
import MatchingQuestion from '@/app/components/questions/matching-question/MatchingQuestion';

// واجهة بيانات السؤال
interface QuestionData {
  items: { id: string; text: string }[];
  images: { id: string; url: string }[];
}

// واجهة بيانات الهيدر
interface HeaderData {
  trimester: string;
  unit: string;
  title: string;
  grade: string;
  studentName: string;
}

// --- دالة مساعدة لاستخلاص الرقم من السلسلة النصية ---
const extractNumberFromSlug = (slug: string | undefined | null, prefix: string): number => {
  if (slug && slug.startsWith(prefix)) {
    return parseInt(slug.substring(prefix.length), 10);
  }
  return NaN;
};

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  // --- الحالة (State) ---
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- استخراج ومعالجة params مع قيم افتراضية ---
  const exerciseSlug = (params?.exerciseId as string) || "exercise1";
  const questionSlug = (params?.questionId as string) || "question1";
  const yearParam = (params?.year as string) || "year1";
  const subjectParam = (params?.subject as string) || "reading";
  const unitParam = (params?.unit as string) || "unit1";

  const currentExerciseNumber = extractNumberFromSlug(exerciseSlug, "exercise") || 1;
  const currentQuestionNumber = extractNumberFromSlug(questionSlug, "question") || 1;

  // --- دالة لتحديث بيانات السؤال ---
  const updateQuestionData = (questionNum: number, exerciseNum: number) => {
    // البيانات الأصلية من الكود الذي كان يعمل
    const newQuestionData: QuestionData = {
      items: [
        { id: 'text1', text: 'تِلْمِيذٌ' },
        { id: 'text2', text: 'تِلْمِيذَةٌ' },
        { id: 'text3', text: 'تَلَامِيذٌ' },
      ],
      images: [
        { id: 'img2', url: '/exercices/year1/reading/introductory/exercice1/studentGirl.png' },
        { id: 'img3', url: '/exercices/year1/reading/introductory/exercice1/students.png' },
        { id: 'img1', url: '/exercices/year1/reading/introductory/exercice1/studentBoy.png' },
      ]
    };

    setQuestionData(newQuestionData);
  };

  // --- جلب البيانات ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Loading data for exercise: ${currentExerciseNumber}, question: ${currentQuestionNumber}`);
        
        // محاكاة تحميل البيانات
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // إعداد بيانات الهيدر مع الترجمة
        const gradeNames: { [key: string]: string } = {
          'year1': 'السنة الأولى',
          'year2': 'السنة الثانية',
          'year3': 'السنة الثالثة'
        };
        
        const subjectNames: { [key: string]: string } = {
          'reading': 'القراءة',
          'math': 'الرياضيات',
          'science': 'العلوم',
          'arabic': 'اللغة العربية'
        };
        
        const unitNames: { [key: string]: string } = {
          'unit1': 'الوحدة الأولى',
          'unit2': 'الوحدة الثانية',
          'unit3': 'الوحدة الثالثة'
        };

        const fetchedHeaderData: HeaderData = {
          trimester: "الثلاثي الأول",
          unit: unitNames[unitParam] || unitParam,
          title: `تمرين ${currentExerciseNumber} - سؤال ${currentQuestionNumber}`,
          grade: gradeNames[yearParam] || yearParam,
          studentName: "أحمد بن علي"
        };

        setHeaderData(fetchedHeaderData);
        updateQuestionData(currentQuestionNumber, currentExerciseNumber);
        setTotalQuestions(5);

      } catch (err) {
        console.error("Failed to fetch exercise data:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب البيانات.");
        setHeaderData(null);
        setQuestionData(null);
        setTotalQuestions(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params, currentExerciseNumber, currentQuestionNumber, yearParam, subjectParam, unitParam]);

  // --- دوال التحكم ---
  const handleNavigateNext = () => {
    console.log("التحقق من الإجابة...");
    
    if (currentQuestionNumber < totalQuestions) {
      const nextQuestionNumber = currentQuestionNumber + 1;
      const nextQuestionSlug = `question${nextQuestionNumber}`;

      // بناء المسار للسؤال التالي
      const basePathParts = pathname.split('/');
      basePathParts.pop(); // إزالة questionSlug الحالي
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
      const stepSlug = `question${step}`;
      const basePathParts = pathname.split('/');
      basePathParts.pop(); // إزالة السؤال الحالي
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
    console.log("تراجع عن آخر عملية");
    // إضافة منطق التراجع هنا
  };

  const handleReset = () => {
    console.log("إعادة تعيين السؤال");
    // إضافة منطق إعادة التعيين هنا
    updateQuestionData(currentQuestionNumber, currentExerciseNumber);
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

  if (!headerData || !questionData || totalQuestions === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        لا يمكن عرض بيانات التمرين. تأكد من صحة الرابط.
      </div>
    );
  }

  return (
    <ExerciseLayout
      headerData={headerData}
      totalSteps={totalQuestions}
      currentStep={currentQuestionNumber}
      onStepChange={handleStepChange}
      onNavigateNext={handleNavigateNext}
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