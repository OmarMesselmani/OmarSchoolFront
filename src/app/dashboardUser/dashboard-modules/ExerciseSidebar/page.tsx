'use client';

import React from 'react';
import { TbArrowForwardUp, TbPlayerTrackPrevFilled } from 'react-icons/tb';
import { FaArrowsRotate } from 'react-icons/fa6';
import { BsPrinter } from 'react-icons/bs';
import { HiArrowRightCircle, HiArrowLeftCircle } from 'react-icons/hi2';
import { LuFileCheck } from 'react-icons/lu';
import styles from './page.module.css';

// واجهة لتحديد الخصائص التي يستقبلها المكون
interface ExerciseSidebarProps {
  onUndoClick: () => void; // دالة التراجع
  onResetClick: () => void; // *** جديد: دالة إعادة الضبط (مسح الكل) ***
  // يمكن إضافة دوال أخرى للخصائص الأخرى إذا لزم الأمر
  // onPrintClick: () => void;
}

// تعديل المكون لاستقبال الخصائص الجديدة
export default function ExerciseSidebar({ onUndoClick, onResetClick }: ExerciseSidebarProps) {
  return (
    // استخدام الأنماط من CSS Modules
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        {/* قسم السؤال التالي */}
        <div className={styles.nextSection} title="السؤال التالي">
          <HiArrowLeftCircle className={styles.nextIcon} />
        </div>

        {/* قسم السؤال السّابق */}
        <div className={styles.prevSection} title="السؤال السّابق">
          <HiArrowRightCircle className={styles.prevIcon} />
        </div>

        {/* قسم التراجع */}
        <div
          className={styles.arrowSection}
          title="تراجع"
          onClick={onUndoClick}
          style={{ cursor: 'pointer' }}
        >
          <TbArrowForwardUp className={styles.arrowIcon} />
        </div>

        {/* *** قسم إعادة الضبط (مسح الكل) - إضافة onClick *** */}
        <div
          className={styles.redoSection}
          title="إعادة"
          onClick={onResetClick} // استدعاء الدالة المُمررة عند النقر
          style={{ cursor: 'pointer' }} // إضافة مؤشر ليدل على أنه قابل للنقر
        >
          <FaArrowsRotate className={styles.redoIcon} />
        </div>

        {/* قسم الطباعة (لم يتم ربط وظيفة به بعد) */}
        <div className={styles.printSection} title="طباعة التمرين">
          <BsPrinter className={styles.printIcon} />
        </div>

        <div className={styles.nextExerciseSection} title="التمرين التالي">
          <TbPlayerTrackPrevFilled className={styles.nextExerciseIcon} />
        </div>

        <div className={styles.checkSection} title="الإصلاح">
          <LuFileCheck className={styles.checkIcon} />
        </div>
      </div>
    </div>
  );
}
