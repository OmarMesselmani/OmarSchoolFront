// المسار المقترح: src/app/dashboardUser/components/SubjectProgressCardContent.tsx
import React from 'react';
import styles from './page.module.css'; // ملف CSS خاص بهذا المكون
// *** تعديل: تحديث مسار استيراد ContinueButton ***
// يفترض أن @ يشير إلى src/app وأن المكون موجود في components/continue-button/page.tsx
import ContinueButton from '@/app/components/continue-button/page';

export interface SubjectProgressCardContentProps {
  unit: string;
  progress: number;
  onContinueClick: () => void;
  subjectId?: string; // إضافة معرف المادة
}

const SubjectProgressCardContent: React.FC<SubjectProgressCardContentProps> = ({
  unit,
  progress,
  onContinueClick,
  subjectId
}) => {
  return (
    <div className={styles.contentContainer}>
      <p className={styles.unitTitle}>{unit}</p>

      <div className={styles.progressInfo}>
        <span>نسبة الإنجاز</span>
        <span>{progress}%</span>
      </div>

      <div className={styles.progressBarBackground}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${progress}%` }}
        />
      </div>
      <button
        onClick={onContinueClick}
        className={styles.continueButton}
      >
        المتابعة
      </button>
    </div>
  );
};

export default SubjectProgressCardContent;

