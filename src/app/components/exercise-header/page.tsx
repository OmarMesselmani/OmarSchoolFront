// الملف: components/exercise-header/ExerciseHeader.tsx
// (أو components/exercise-header/page.tsx)

import React from 'react';
// تأكد من استيراد ملف CSS بالاسم الصحيح المطابق لهذا الملف
import styles from './page.module.css';
// (أو import styles from './page.module.css';)


// واجهة الـ Props للمكون
interface ExerciseHeaderProps {
  trimester: string;
  unit: string;
  title: string;
  grade: string;
  studentName?: string; // اسم التلميذ اختياري
}

// تعريف المكون
const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  trimester,
  unit,
  title,
  grade,
  studentName,
}) => {
  // console.log('الخصائص المستلمة في الهيدر:', { trimester, unit, title, grade, studentName }); // يمكنك إزالة هذا بعد التأكد

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
        {/* العنوان الرئيسي */}
        <h1 className={styles.titleText}>{title}</h1>
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