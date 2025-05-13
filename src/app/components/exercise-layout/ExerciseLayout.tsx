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

// تعريف واجهة للخصائص
interface ExerciseLayoutProps {
  headerData: any; // استبدل any بنوع بيانات الهيدر الفعلي
  totalSteps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
  onNavigateNext: () => void;
  isLastQuestion: boolean;
  onUndo: () => void; // سيتم التعامل مع كيفية ربطها لاحقًا
  onReset: () => void; // سيتم التعامل مع كيفية ربطها لاحقًا
  onClose: () => void;
  children: React.ReactNode; // محتوى السؤال
  exerciseType?: string; // خاصية اختيارية لنوع التمرين (مثل "قراءة")
}

export default function ExerciseLayout({
  headerData,
  totalSteps,
  currentStep,
  onStepChange,
  onNavigateNext,
  isLastQuestion,
  onUndo,
  onReset,
  onClose,
  children,
  exerciseType = "غير محدد" // قيمة افتراضية إذا لم يتم تمرير النوع
}: ExerciseLayoutProps) {

  return (
    // استخدام الكلاسات من ملف CSS المستورد
    <div className={styles.pageContainer} style={{ paddingTop: 0, marginTop: 0 }}>
      <CloseButton onClose={onClose} position="top-right" size="md" />

      <main className={styles.exerciseContainer} style={{ paddingTop: '1rem' }}>
        <div className={styles.exerciseContent}>
          <ExerciseHeader {...headerData} />

          <div className={styles.exerciseBodyWrapper}>
            <div className={styles.mainExerciseArea}>
              {children} {/* عرض مكون السؤال هنا */}
            </div>
            {/* تمرير دوال التحكم إلى الشريط الجانبي */}
            <ExerciseSidebar onUndoClick={onUndo} onResetClick={onReset} />
          </div>

        </div>
      </main>

      {/* مكونات التحكم والتفاعل السفلية */}
      <SubmitAndNextButton
        onClick={onNavigateNext}
        isLastQuestion={isLastQuestion}
      />
      <AiTalker
        exerciseType={exerciseType} // تمرير نوع التمرين
        onHelpRequest={() => console.log("AI: طلب مساعدة")} // تنفيذ مؤقت
        onExplainRequest={() => console.log("AI: طلب شرح")}  // تنفيذ مؤقت
      />
      <ProgressStepper
        totalSteps={totalSteps}
        currentStep={currentStep}
        onStepChange={onStepChange}
        allowNavigation={true} // أو اجعلها prop للتحكم بها
      />
    </div>
  );
}