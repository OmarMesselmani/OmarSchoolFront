// المسار المقترح: src/app/components/exam-list-item/page.tsx

'use client';

import React from 'react';
import styles from './page.module.css'; // استخدام page.module.css
import { IoChevronBack } from "react-icons/io5"; // استيراد أيقونة السهم (تظهر لليسار في RTL)

interface ExamListItemProps {
  subject: string;
  examTitle: string;
  titleBgColor: string; // لون خلفية اسم المادة
  onClick: () => void; // دالة النقر على العنصر
}

const ExamListItem: React.FC<ExamListItemProps> = ({
  subject,
  examTitle,
  titleBgColor,
  onClick
}) => {
  return (
    <div className={styles.itemContainer} onClick={onClick}>
      <div className={styles.contentWrapper}>
        <span
          className={styles.subjectTag}
          // تطبيق لون الخلفية الممرر كمتغير CSS
          style={{ '--title-bg-color': titleBgColor } as React.CSSProperties}
        >
          {subject}
        </span>
        <p className={styles.examTitle}>{examTitle}</p>
      </div>
      <IoChevronBack className={styles.arrowIcon} />
    </div>
  );
};

export default ExamListItem;

