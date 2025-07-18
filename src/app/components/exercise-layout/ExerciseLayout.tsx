// ./app/components/exercise-layout/ExerciseLayout.tsx
'use client';

import React, { useEffect } from 'react';
// تأكد من أن اسم الملف هو exercise-layout.module.css وأن المسار صحيح
import styles from './exercise-layout.module.css';
import ExerciseHeader from '@/app/components/exercise-header/page';
import ExerciseSidebar from '@/app/components/exercise-sidebar/page';
import AiTalker from '@/app/components/ai-talker/page';
import ProgressStepper from '@/app/components/progress-stepper/page';
import SubmitAndNextButton from '@/app/components/submit-and-next-button/page';
import CloseButton from '@/app/components/close-button/page';
import QuestionRenderer from '../questions/QuestionRenderer';
import { ExamWithExercises, Exercise } from '@/app/data-structures/Exam';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Student } from '@/app/data-structures/Student';


// تعريف واجهة للخصائص
interface ExerciseLayoutProps {
  // children: React.ReactNode;
  examData: ExamWithExercises;
  student: Student; // إضافة خاصية الطالب
  exercises: Exercise[];
  examUniqueId?: string; // إضافة معرف الامتحان
  totalSteps: number;
  onClose: () => void;
  onUndo: () => void;
  onReset: () => void;
  onNavigateToNextExercise?: () => void;
}

const ExerciseLayout: React.FC<ExerciseLayoutProps> = ({
  // children,
  examData,
  student,
  exercises,
  examUniqueId,
  totalSteps,
  onClose,
  onUndo,
  onReset,
  onNavigateToNextExercise,
}) => {

  function getExerciseByOrder(
    exercises: Exercise[],
    order: number
  ): Exercise | undefined {
    return exercises.find(ex => ex.order === order)
  }
  //////////////////////////////////////////////////////
  // استخدم useParams من Next.js للحصول على المعلمات من URL
  const params = useParams();
  const router = useRouter();
  const stringCurrentStep = params?.questionOrder as string;
  const currentStep = parseInt(stringCurrentStep); // تحويل المعامل إلى رقم صحيح

  const ex1 = getExerciseByOrder(exercises, currentStep)
  console.log('Current Step:', currentStep);
  console.log('Exercise Data:', ex1);

  //////////////////////////////////////////////////////
  const handleStepChange = (step: number) => {
    if (step !== currentStep) {

      router.push(`/exam/${examUniqueId}/${step}`);
    }
  };
  //////////////////////////////////////////////////////
  const handleNavigateNext = () => {
    if (currentStep < totalSteps) {
      const nextQuestionNumber = currentStep + 1;
      router.push(`/exam/${examUniqueId}/${nextQuestionNumber}`);
    } else {
      router.push('/dashboard-user?section=home');
    }
  };

  const [isLastQuestion, setIsLastQuestion] = React.useState<boolean>(true);
  useEffect(() => {
    setIsLastQuestion(currentStep === totalSteps);
  }, [currentStep]);


  return (
    // استخدام الكلاسات من ملف CSS المستورد
    <div className={styles.pageContainer} style={{ paddingTop: 0, marginTop: 0 }}>
      <CloseButton onClose={onClose} position="top-right" size="md" />

      <main className={styles.exerciseContainer} style={{ paddingTop: '1rem' }}>
        <div className={styles.exerciseContent}>
          <ExerciseHeader
            trimester={examData?.semester?.name}
            unit={examData?.subject?.name}
            title={examData?.title} // تمرير عنوان التمرين
            grade={examData?.grade?.name}
            studentName={`${student?.name} ${student?.surname}`}
            onClose={onClose}
            onUndo={onUndo}
            onReset={onReset}
          />

          <div className={styles.exerciseBodyWrapper}>
            <div className={styles.mainExerciseArea}>
              {/* {children} */}
              <QuestionRenderer
                exerciseData={ex1}
                student={student} // تمرير خاصية الطالب
              />
            </div>
            {/* تمرير دوال التحكم إلى الشريط الجانبي */}
            {/* <ExerciseSidebar onUndoClick={onUndo} onResetClick={onReset} /> */}
          </div>

        </div>
      </main>

      {/* مكونات التحكم والتفاعل السفلية */}
      {/* <SubmitAndNextButton
        onClick={onNavigateNext}
        isLastQuestion={isLastQuestion}
      /> */}
      <AiTalker
        exerciseType={"غير محدد"} // تمرير نوع التمرين
        onHelpRequest={() => console.log("AI: طلب مساعدة")} // تنفيذ مؤقت
        onExplainRequest={() => console.log("AI: طلب شرح")}  // تنفيذ مؤقت
      />
      <ProgressStepper
        totalSteps={totalSteps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        allowNavigation={true}
        showNavigationButtons={true}
        onNextExercise={onNavigateToNextExercise} // تمرير الدالة هنا
        showExerciseNavigation={true}
        isLastQuestion={isLastQuestion} // تمرير حالة آخر سؤال
      />
    </div>
  );
};

export default ExerciseLayout;