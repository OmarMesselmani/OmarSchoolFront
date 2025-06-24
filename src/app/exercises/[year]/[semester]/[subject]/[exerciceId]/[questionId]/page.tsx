'use client';

import { useRouter, useParams, usePathname } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import ExerciseLayout from '@/app/components/exercise-layout/ExerciseLayout';
import MatchingQuestion from '@/app/components/questions/matching-question/MatchingQuestion';
import TextDisplay from '@/app/components/questions/text-question/TextQuestion';
import Cookies from 'js-cookie';
import { Student } from '@/app/data-structures/Student';

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

// إنشاء ثوابت للأحداث المخصصة
export const CONNECTION_EVENTS = {
  UNDO: 'connection-undo',
  RESET: 'connection-reset'
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
  const [student, setStudent] = useState<Student | null>(null); // إضافة حالة للطالب
  
  // حالات خاصة بالأسئلة التفاعلية
  const [connections, setConnections] = useState<{start: string; end: string}[]>([]);
  const [startPoint, setStartPoint] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{x: number; y: number} | null>(null);

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
    let newQuestionData: QuestionData;

    // تحديد بيانات السؤال بناءً على رقم السؤال
    switch (questionNum) {
      case 1:
        // السؤال الأول - المطابقة الثانية (تم تبديله مع السؤال الأول)
        newQuestionData = {
          items: [
            { id: 'text1', text: 'مَدْرَسَةٌ' },
            { id: 'text2', text: 'كِتَابٌ' },
            { id: 'text3', text: 'قَلَمٌ' },
          ],
          images: [
            { id: 'img1', url: '/exercices/year1/reading/introductory/exercice1/school.png' },
            { id: 'img2', url: '/exercices/year1/reading/introductory/exercice1/book.png' },
            { id: 'img3', url: '/exercices/year1/reading/introductory/exercice1/pen.png' },
          ]
        };
        break;

      case 2:
        // السؤال الثاني - المطابقة الأولى (تم تبديله مع السؤال الثاني)
        newQuestionData = {
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
        break;

      default:
        // في حالة وجود خطأ في رقم السؤال، استخدم السؤال الأول كقيمة افتراضية
        newQuestionData = {
          items: [
            { id: 'text1', text: 'مَدْرَسَةٌ' },
            { id: 'text2', text: 'كِتَابٌ' },
            { id: 'text3', text: 'قَلَمٌ' },
          ],
          images: [
            { id: 'img1', url: '/exercices/year1/reading/introductory/exercice1/school.png' },
            { id: 'img2', url: '/exercices/year1/reading/introductory/exercice1/book.png' },
            { id: 'img3', url: '/exercices/year1/reading/introductory/exercice1/pen.png' },
          ]
        };
    }

    setQuestionData(newQuestionData);
    
    // إعادة تعيين حالات التوصيل عند تحديث السؤال
    setConnections([]);
    setStartPoint(null);
    setMousePos(null);
  };

  // --- دالة جلب بيانات الطالب ---
  const fetchStudentData = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.log('No authentication token found, using default student data');
        // استخدام بيانات طالب افتراضية
        const defaultStudent = {
          name: "زهرة",
          surname: "القصيبي",
          age: "7",
          current_level_name: "السنة الثانية",
          unique_id: "DEFAULT_ID"
        } as Student;
        
        setStudent(defaultStudent);
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
      // استخدام بيانات طالب افتراضية في حالة الخطأ
      setStudent({
        name: "زهرة",
        surname: "القصيبي",
        age: "7",
        current_level_name: "السنة الثانية",
        unique_id: "DEFAULT_ID"
      } as Student);
    }
  };

  // --- جلب بيانات الطالب ---
  useEffect(() => {
    fetchStudentData();
  }, []);

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
        
        // تعديل كائن unitNames لإضافة الوحدة التمهيدية
        const unitNames: { [key: string]: string } = {
          'unit1': 'الوحدة التمهيدية',
          'unit2': 'الوحدة الثانية',
          'unit3': 'الوحدة الثالثة',
          'introductory': 'الوحدة التمهيدية' // إضافة خيار بديل في حالة استخدام معرف "introductory"
        };

        // استخدام اسم الطالب من البيانات المسترجعة إذا كانت متاحة
        const studentFullName = student 
          ? `${student.name} ${student.surname}` 
          : "التلميذ: زهرة القصيبي";

        const fetchedHeaderData: HeaderData = {
          trimester: "الثلاثي الأول",
          unit: unitNames[unitParam] || unitParam,
          title: `تمرين ${currentExerciseNumber}`,
          grade: gradeNames[yearParam] || yearParam,
          studentName: studentFullName
        };

        setHeaderData(fetchedHeaderData);
        updateQuestionData(currentQuestionNumber, currentExerciseNumber);
        setTotalQuestions(2); // تعديل من 5 إلى 2 (لدينا سؤالان فقط)

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
  }, [params, currentExerciseNumber, currentQuestionNumber, yearParam, subjectParam, unitParam, student]); // أضفنا student كاعتمادية

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

  // دالة للتراجع عن آخر توصيل
  const handleUndo = useCallback(() => {
    // إرسال حدث مخصص للتراجع
    document.dispatchEvent(new CustomEvent(CONNECTION_EVENTS.UNDO));
    console.log("تم إرسال أمر التراجع");
  }, []);

  // دالة لإعادة تعيين جميع التوصيلات
  const handleReset = useCallback(() => {
    // إرسال حدث مخصص لإعادة الضبط
    document.dispatchEvent(new CustomEvent(CONNECTION_EVENTS.RESET));
    console.log("تم إرسال أمر إعادة الضبط");
  }, []);

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
      {/* عرض النص في السؤال الأول */}
      {currentQuestionNumber === 1 ? (
        <TextDisplay
          questionNumber={currentQuestionNumber.toString()}
          questionTitle="أَقْرَأُ الجُمَلَ التَّالِيَةَ:"
          textContent="" // نتركه فارغ لأننا سنستخدم صورة
          imageUrl="/exercices/year1/reading/introductory/exercice1/text.png" // تم حذف "/public" من المسار
        />
      ) : (
        <MatchingQuestion
          items={questionData.items}
          images={questionData.images}
          questionNumber={currentQuestionNumber.toString()}
        />
      )}
    </ExerciseLayout>
  );
}