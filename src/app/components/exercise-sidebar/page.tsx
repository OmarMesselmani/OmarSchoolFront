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
  onUndoClick: () => void;
  onNextClick: () => void;
  onResetClick: () => void;
  exerciseAlreadyDone: boolean;
  loading: boolean;
}

export default function ExerciseSidebar({
  onUndoClick,
  onNextClick,
  onResetClick,
  exerciseAlreadyDone,
  loading,
}: ExerciseSidebarProps) {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        {/* Undo Section */}
        <div
          className={styles.arrowSection}
          title="تراجع"
          onClick={onUndoClick}
          style={{ cursor: 'pointer' }}
        >
          <TbArrowForwardUp className={styles.arrowIcon} />
        </div>

        {/* Reset Section */}
        <div
          className={styles.redoSection}
          title="إعادة"
          onClick={onResetClick}
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

        {/* Next Exercise Button */}
        <div
          className={styles.redoSection}
          title="التمرين التالي"
          // Disable onClick if loading or if exercise is already done
          onClick={!loading && !exerciseAlreadyDone ? onNextClick : undefined}
          style={{ cursor: !loading && !exerciseAlreadyDone ? 'pointer' : 'default' }}
        >
          {loading ? (
            // Spinner: ensure you have a CSS animation for the spinnerIcon class
            <FaSpinner className={styles.spinnerIcon} />
          ) : exerciseAlreadyDone ? (
            // Green check icon if already done
            <BsCheck className={styles.checkIcon} style={{ color: 'green' }} />
          ) : (
            // Default next arrow
            <BsArrowLeft className={styles.printIcon} />
          )}
        </div>
      </div>
    </div>
  );
}