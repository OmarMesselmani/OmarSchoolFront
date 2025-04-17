// المسار المقترح: src/app/dashboardUser/components/StudentInfoHeader.tsx

import React from 'react';
import styles from './page.module.css';

interface StudentInfoHeaderProps {
  studentName: string;
  schoolLevel: string;
  age: number | string; // يمكن أن يكون رقمًا أو نصًا مثل "غير محدد"
  uniqueId: string;
}

const StudentInfoHeader: React.FC<StudentInfoHeaderProps> = ({
  studentName,
  schoolLevel,
  age,
  uniqueId,
}) => {
  return (
    <div className={styles.infoHeaderContainer}>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>اسم التلميذ:</span>
        <span className={styles.infoValue}>{studentName}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>المستوى التعليمي:</span>
        <span className={styles.infoValue}>{schoolLevel}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>عمره:</span>
        {/* إضافة كلمة سنوات */}
        <span className={styles.infoValue}>{age} سنوات</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>المعرف الوحيد:</span>
        <span className={styles.infoValue}>{uniqueId}</span>
      </div>
    </div>
  );
};

export default StudentInfoHeader;

