// المسار: src/app/dashboardUser/pages/exercises-list/page.tsx

'use client';

import React, { useState, useMemo } from 'react';
import styles from './page.module.css';
import StudentInfoHeader from '@/app/components/student-info-header/page';
// === استيراد الألوان من ملف JSON كـ default ===
import subjectColorData from '@/app/data/subjectColors.json'; // تأكد من المسار الصحيح
// استيراد أيقونة السهم
import { HiChevronLeft } from "react-icons/hi";

// --- واجهات البيانات ---
interface StudentData {
    name: string;
    level: string;
    age: number;
    uniqueId: string;
}
interface StudentDetailsMap {
    [key: string]: StudentData;
}
interface ExercisesListPageProps {
  selectedChildId: string;
  studentDetailsMap: StudentDetailsMap; // التأكد من استقبال هذا الكائن
}
interface Exercise {
    id: string;
    subject: string;
    title: string;
    status: string;
    periodNumber: number;
}
// --- نهاية الواجهات ---

// --- بيانات وهمية (يفضل استيرادها من ملف مشترك) ---
const mockStudentDetails: StudentDetailsMap = {
    'child1': { name: 'التلميذ الأول', level: 'السنة الأولى', age: 6, uniqueId: '123456789123' },
    'child2': { name: 'التلميذ الثاني', level: 'السنة الثالثة', age: 8, uniqueId: '987654321987' },
    'child3': { name: 'التلميذ الثالث', level: 'السنة الخامسة', age: 10, uniqueId: '112233445566' },
    '': { name: 'لم يختر', level: '-', age: 0, uniqueId: 'N/A' }
};

// دالة لتوليد بيانات وهمية أكثر تفصيلاً
const generateMockExercises = (): Exercise[] => {
    const subjects = [
        { id: 'math', name: 'الرياضيات' },
        { id: 'science', name: 'الإيقاظ العلمي' },
        { id: 'reading', name: 'القراءة' },
        { id: 'writing', name: 'الانتاج الكتابي' },
    ];
    const exercises: Exercise[] = [];
    let exerciseId = 1;
    const statuses = ['لم يبدأ', 'مكتمل', 'قيد التقدم'];

    subjects.forEach(subject => {
        for (let period = 1; period <= 5; period++) {
            for (let exNum = 1; exNum <= 5; exNum++) {
                exercises.push({
                    id: `ex-${subject.id}-${period}-${exNum}`,
                    subject: subject.name,
                    title: `التمرين عدد ${String(exNum).padStart(2, '0')}`,
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    periodNumber: period,
                });
            }
        }
    });
    return exercises;
};
const mockExercises: Exercise[] = generateMockExercises();

// دالة مساعدة للحصول على اسم الفترة بالعربية
const getPeriodName = (periodNumber: number): string => {
    const names = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
    return `الفترة ${names[periodNumber - 1] || periodNumber}`;
};
// --- نهاية البيانات الوهمية ---

// بيانات فلاتر التبويبات
const subjectFilters = [
  { id: 'all', name: 'جميع التمارين' },
  { id: 'writing', name: 'الانتاج الكتابي' },
  { id: 'reading', name: 'القراءة' },
  { id: 'math', name: 'الرياضيات' },
  { id: 'science', name: 'الإيقاظ العلمي' },
];

// واجهة لشكل البيانات المجمعة
interface GroupedExercises {
    subject: string;
    periodNumber: number;
    exercises: Exercise[];
}


const ExercisesListPage: React.FC<ExercisesListPageProps> = ({
    selectedChildId,
    studentDetailsMap // استقبال ال props الصحيحة
}) => {

  // البحث عن بيانات الطالب مع قيمة افتراضية
  const defaultStudentData: StudentData = mockStudentDetails[''] || { name: 'لم يختر', level: '-', age: 0, uniqueId: 'N/A' };
  const selectedStudentData = studentDetailsMap[selectedChildId] || defaultStudentData;

  const [activeFilter, setActiveFilter] = useState<string>('all');

  // حساب اسم الفلتر النشط
  const activeFilterName = useMemo(() => {
      return subjectFilters.find(f => f.id === activeFilter)?.name || 'جميع التمارين';
  }, [activeFilter]);

  // منطق التصفية والتجميع
  const groupedAndFilteredExercises = useMemo((): GroupedExercises[] => {
    let exercisesToShow = mockExercises;
    if (activeFilter !== 'all') {
      const activeFilterData = subjectFilters.find(f => f.id === activeFilter);
      const targetSubjectName = activeFilterData ? activeFilterData.name : '';
      exercisesToShow = mockExercises.filter(exercise => exercise.subject === targetSubjectName);
    }
    const groups: { [key: string]: { subject: string; periodNumber: number; exercises: Exercise[] } } = {};
    exercisesToShow.forEach(exercise => {
      const key = `${exercise.subject}-${exercise.periodNumber}`;
      if (!groups[key]) {
        groups[key] = { subject: exercise.subject, periodNumber: exercise.periodNumber, exercises: [] };
      }
      groups[key].exercises.push(exercise);
    });
    return Object.values(groups).sort((a, b) => {
        if (a.subject < b.subject) return -1; if (a.subject > b.subject) return 1;
        return a.periodNumber - b.periodNumber;
    });
  }, [activeFilter]);


  return (
    <div className={styles.pageContainer}>
        {/* شريط معلومات التلميذ */}
        <div className={styles.fullWidthSpan}>
             <StudentInfoHeader
                 studentName={selectedStudentData.name}
                 schoolLevel={selectedStudentData.level}
                 age={selectedStudentData.age}
                 uniqueId={selectedStudentData.uniqueId}
             />
        </div>

        {/* شريط التبويبات */}
        <div className={styles.tabsContainer}>
             <h3 className={styles.activeTabTitle}>{activeFilterName}</h3>
             <div className={styles.tabButtonsGroup}>
                {subjectFilters.map(filter => {
                    let inlineStyles: React.CSSProperties = {};
                    const isActive = activeFilter === filter.id;

                    if (filter.id === 'all') {
                        if (isActive) {
                             inlineStyles = {
                                backgroundColor: 'var(--main-color, #DD2946)',
                                borderColor: 'var(--main-color, #DD2946)',
                             };
                        }
                    } else {
                        const cardBgColor = (subjectColorData.subjectCardBgColors as Record<string, string>)[filter.id];
                        const titleBgColor = (subjectColorData.subjectTitleBgColors as Record<string, string>)[filter.id];
                        if (isActive) {
                            if (titleBgColor) {
                                inlineStyles = { backgroundColor: titleBgColor, borderColor: titleBgColor };
                            } else {
                                 inlineStyles = { backgroundColor: 'var(--main-color, #DD2946)', borderColor: 'var(--main-color, #DD2946)'};
                            }
                        } else {
                            if (cardBgColor && titleBgColor) {
                                inlineStyles = { backgroundColor: cardBgColor, borderColor: titleBgColor, color: titleBgColor };
                            }
                        }
                    }
                    return (
                        <button
                            key={filter.id}
                            className={`${styles.tabItem} ${isActive ? styles.active : ''}`}
                            style={inlineStyles}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            {filter.name}
                        </button>
                    );
                })}
             </div>
        </div>

        {/* منطقة عرض قائمة التمارين المجمعة */}
        <div className={styles.groupedExerciseListContainer}>
            {groupedAndFilteredExercises.length > 0 ? (
              groupedAndFilteredExercises.map(group => {
                const subjectId = subjectFilters.find(f => f.name === group.subject)?.id || '';
                const headerBgColor = (subjectColorData.subjectTitleBgColors as Record<string, string>)[subjectId] || '#A1A1AA';
                const bodyBgColor = (subjectColorData.subjectCardBgColors as Record<string, string>)[subjectId] || '#F4F4F5';

                return (
                  <div key={`${group.subject}-${group.periodNumber}`} className={styles.subjectGroup} style={{ backgroundColor: bodyBgColor }}>
                    <div className={styles.groupHeader} style={{ backgroundColor: headerBgColor }}>
                      <span className={styles.groupSubjectName}>{group.subject}</span>
                      <span className={styles.groupPeriodName}>{getPeriodName(group.periodNumber)}</span>
                    </div>
                    <div className={styles.groupExerciseList}>
                      {/* إضافة return المفقودة سابقاً */}
                      {group.exercises.map((exercise) => {
                        return ( // <-- RETURN
                          <div key={exercise.id} className={styles.groupedExerciseItem}>
                            <span>{exercise.title}</span>
                            <HiChevronLeft className={styles.exerciseActionIcon} />
                          </div>
                        ); // <-- نهاية RETURN
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.noExercises}>لا توجد تمارين متاحة لهذا الفلتر.</p>
            )}
        </div>
    </div>
  );
};

export default ExercisesListPage;