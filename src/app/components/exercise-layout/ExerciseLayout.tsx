// ./app/components/exercise-layout/ExerciseLayout.tsx
'use client';

import React from 'react';
// تأكد من أن اسم الملف هو exercise-layout.module.css وأن المسار صحيح
import styles from './exercise-layout.module.css';
import ExerciseHeader from '@/app/components/exercise-header/page';
import ExerciseSidebar from '@/app/components/exercise-sidebar/page';
import AiTalker from '@/app/components/ai-talker/page';
import ProgressStepper from '@/app/components/progress-stepper/page';
import SubmitAndNextButton from '@/app/components/submit-and-next-button/page';
import CloseButton from '@/app/components/close-button/page';

// ✅ تعريف واجهة HeaderData
interface HeaderData { 
  trimester: string;
  unit: string;
  title?: string;
  grade: string;
  studentName?: string;
  exerciseId?: string; // إضافة معرف التمرين
}

// تعريف واجهة للخصائص
interface ExerciseLayoutProps {
  children: React.ReactNode;
  headerData: HeaderData;
  totalSteps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
  onNavigateNext: () => void;
  isLastQuestion: boolean;
  onClose: () => void;
  onUndo: () => void;
  onReset: () => void;
  onNavigateToNextExercise?: () => void;
}

const ExerciseLayout: React.FC<ExerciseLayoutProps> = ({
  children,
  headerData,
  totalSteps,
  currentStep,
  onStepChange,
  onNavigateNext,
  isLastQuestion,
  onClose,
  onUndo,
  onReset,
  onNavigateToNextExercise,
}) => {
  return (
    // استخدام الكلاسات من ملف CSS المستورد
    <div className={styles.pageContainer} style={{ paddingTop: 0, marginTop: 0 }}>
      <CloseButton onClose={onClose} position="top-right" size="md" />

      <main className={styles.exerciseContainer} style={{ paddingTop: '1rem' }}>
        <div className={styles.exerciseContent}>
          <ExerciseHeader 
            trimester={headerData.trimester}
            unit={headerData.unit}
            grade={headerData.grade}
            studentName={headerData.studentName}
            exerciseId={headerData.exerciseId} // ✅ تمرير exerciseId
            onClose={onClose}
            onUndo={onUndo}
            onReset={onReset}
          />

          <div className={styles.exerciseBodyWrapper}>
            <div className={styles.mainExerciseArea}>
              {children} {/* عرض مكون السؤال هنا */}
            </div>
            {/* تمرير دوال التحكم إلى الشريط الجانبي */}
            {/* <ExerciseSidebar onUndoClick={onUndo} onResetClick={onReset} /> */}
          </div>

        </div>
      </main>

      {/* مكونات التحكم والتفاعل السفلية */}
      <SubmitAndNextButton
        onClick={onNavigateNext}
        isLastQuestion={isLastQuestion}
      />
      <AiTalker
        exerciseType={"غير محدد"} // تمرير نوع التمرين
        onHelpRequest={() => console.log("AI: طلب مساعدة")} // تنفيذ مؤقت
        onExplainRequest={() => console.log("AI: طلب شرح")}  // تنفيذ مؤقت
      />
      <ProgressStepper
        totalSteps={totalSteps}
        currentStep={currentStep}
        onStepChange={onStepChange}
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