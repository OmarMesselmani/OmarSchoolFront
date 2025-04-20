'use client';

import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import styles from './HomePage.module.css';
import sharedStyles from '../page.module.css';
import { Exercise, introductoryExercises } from '@/app/exercises/data';
import { useRouter } from 'next/navigation';

interface ExerciseProps {
  exercise: Exercise;
  onClick: (path: string) => void;
}

const ExerciseComponent: React.FC<ExerciseProps> = ({ exercise, onClick }) => {
  return (
    <div 
      className={styles.exercise} 
      onClick={() => onClick(exercise.path)}
    >
      <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
      <IoIosArrowBack className={styles.arrowIcon} />
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();

  const handleExerciseClick = (path: string) => {
    console.log('Navigating to:', path);
    router.push(path);
  };

  return (
    <div className={sharedStyles.mainContent}>
      <div className={styles.introductoryUnit}>
        <h1 className={styles.unitTitle}>الوحدة التمهيدية</h1>
        {introductoryExercises.map((exercise) => (
          <ExerciseComponent 
            key={exercise.id}
            exercise={exercise}
            onClick={handleExerciseClick}
          />
        ))}
      </div>
    </div>
  );
}