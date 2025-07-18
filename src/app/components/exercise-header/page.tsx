// الملف: components/exercise-header/ExerciseHeader.tsx
// (أو components/exercise-header/page.tsx)

import React from 'react';
// تأكد من استيراد ملف CSS بالاسم الصحيح المطابق لهذا الملف
import styles from './page.module.css';
// استيراد ملف التكوين
import { EXERCISES_CONFIG } from '@/app/config/exerciseConfig';

// واجهة الـ Props للمكون
interface ExerciseHeaderProps {
  trimester: string;
  unit: string;
  title?: string; // جعل العنوان اختياري
  grade: string;
  studentName?: string;
  // إضافة خاصية جديدة للحصول على العنوان من التكوين
  onClose?: () => void;
  onUndo?: () => void;
  onReset?: () => void;
}

// تعريف المكون
const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  trimester,
  unit,
  title,
  grade,
  studentName,
  onClose,
  onUndo,
  onReset,
}) => {
  // دالة للحصول على عنوان التمرين من ملف التكوين
  const getExerciseTitle = (): string => {    

    
    // إذا تم تمرير title مباشرة، نستخدمه
    if (title) {
      return title;
    }
    
    // في حالة عدم وجود أي منهما، نستخدم عنوان افتراضي
    return 'تمرين غير محدد';
  };

  const displayTitle = getExerciseTitle();
  console.log('ExerciseHeader - Final display title:', displayTitle); // للتتبع

  return (
    // الحاوية الرئيسية للهيدر
    <div dir="rtl" className={styles.headerContainer}>
      {/* العمود الأيمن */}
      <div className={`${styles.column} ${styles.columnRight}`}>
        <p className={styles.textLine}>{trimester}</p>
        <p className={styles.textLine}>{unit}</p>
      </div>

      {/* العمود الأوسط */}
      <div className={`${styles.column} ${styles.columnMiddle}`}>
        {/* العنوان الرئيسي من ملف التكوين */}
        <h1 className={styles.titleText}>{displayTitle}</h1>
      </div>

      {/* العمود الأيسر */}
      <div className={`${styles.column} ${styles.columnLeft}`}>
        <p className={styles.textLine}>{grade}</p>
        {/* عرض اسم التلميذ فقط إذا كان متوفراً */}
        {studentName && (
          <p className={styles.studentNameText}>
            {/* جعل كلمة "التلميذ:" عريضة */}
            <strong>التلميذ:</strong>
            {' '} {/* مسافة اختيارية */}
            {studentName}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExerciseHeader;