'use client';

import React from 'react';
import { TbArrowForwardUp } from 'react-icons/tb';
import { FaArrowsRotate } from 'react-icons/fa6';
import { BsArrow90DegLeft, BsArrowLeft, BsCheck, BsPrinter } from 'react-icons/bs';
import { LuFileCheck } from 'react-icons/lu';
import { FaSpinner } from 'react-icons/fa';
import styles from './page.module.css';

// Extend the props to include the two new Booleans:
interface ExerciseSidebarProps {
  onUndoClick?: () => void;
  onResetClick?: () => void;
}

export default function ExerciseSidebar({
  onUndoClick,
  onResetClick,
}: ExerciseSidebarProps) {
  const handleUndoClick = () => {
    console.log('تم النقر على زر التراجع');
    onUndoClick?.(); // استدعاء الدالة المُمررة
  };

  const handleResetClick = () => {
    console.log('تم النقر على زر الإعادة');
    onResetClick?.(); // استدعاء الدالة المُمررة
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        {/* Undo Section */}
        <div
          className={styles.arrowSection}
          title="تراجع"
          onClick={handleUndoClick}
          style={{ cursor: 'pointer' }}
        >
          <TbArrowForwardUp className={styles.arrowIcon} />
        </div>

        {/* Reset Section */}
        <div
          className={styles.redoSection}
          title="إعادة"
          onClick={handleResetClick}
          style={{ cursor: 'pointer' }}
        >
          <FaArrowsRotate className={styles.redoIcon} />
        </div>

        {/* Print Section */}
        <div className={styles.printSection} title="طباعة التمرين">
          <BsPrinter className={styles.printIcon} />
        </div>

        {/* Check Section */}
        <div className={styles.checkSection} title="الإصلاح">
          <LuFileCheck className={styles.checkIcon} />
        </div>
      </div>
    </div>
  );
}