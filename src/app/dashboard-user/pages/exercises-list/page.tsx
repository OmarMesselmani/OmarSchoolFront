// المسار: src/app/dashboardUser/pages/exercises-list/page.tsx

'use client';

import React, { useState, useMemo } from 'react';
import styles from './page.module.css';
import StudentInfoHeader from '@/app/components/student-info-header/page';
import subjectColorData from '@/app/data/subjectColors.json'; // استيراد الألوان
import { HiChevronLeft } from "react-icons/hi"; // استيراد الأيقونة

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
  studentDetailsMap: StudentDetailsMap;
}
interface Exercise {
    id: string;
    subject: string;
    title: string;
    status: string;
    periodNumber: number;
    progress: number; // نسبة التقدم (0-100)
}
interface SubjectFilter { // واجهة لفلتر المواد
    id: string;
    name: string;
}
// --- نهاية الواجهات ---

// --- بيانات وهمية (يفضل استيرادها من ملف مشترك) ---
const mockStudentDetails: StudentDetailsMap = {
    'child1': { name: 'التلميذ الأول', level: 'السنة الأولى', age: 6, uniqueId: '123456789123' },
    'child2': { name: 'التلميذ الثاني', level: 'السنة الثالثة', age: 8, uniqueId: '987654321987' },
    'child3': { name: 'التلميذ الثالث', level: 'السنة الخامسة', age: 10, uniqueId: '112233445566' },
    '': { name: 'لم يختر', level: '-', age: 0, uniqueId: 'N/A' }
};

// دالة لتوليد بيانات وهمية مع progress ونص الحالة المعدل
const generateMockExercises = (): Exercise[] => {
    const subjects = [
        { id: 'math', name: 'الرياضيات' },
        { id: 'science', name: 'الإيقاظ العلمي' },
        { id: 'islamic', name: 'التربية الإسلامية' }, // إضافة المادة الجديدة هنا أيضاً
        { id: 'reading', name: 'القراءة' },
        { id: 'writing', name: 'الانتاج الكتابي' },
    ];
    const exercises: Exercise[] = [];
    let exerciseId = 1;
    const statuses = ['لم يبدأ', 'مكتمل', 'قيد الإنجاز']; // استخدام النص الجديد

    subjects.forEach(subject => {
        for (let period = 1; period <= 5; period++) {
            for (let exNum = 1; exNum <= 5; exNum++) {
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                let progress = 0;
                if (status === 'مكتمل') {
                    progress = 100;
                } else if (status === 'قيد الإنجاز') { // استخدام النص الجديد
                    progress = Math.floor(Math.random() * 81) + 10; // 10-90
                }
                exercises.push({
                    id: `ex-${subject.id}-${period}-${exNum}`,
                    subject: subject.name,
                    title: `التمرين عدد ${String(exNum).padStart(2, '0')}`,
                    status: status,
                    periodNumber: period,
                    progress: progress
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

// بيانات فلاتر التبويبات (غير مرتبة مبدئياً)
const initialSubjectFilters: SubjectFilter[] = [
  { id: 'all', name: 'جميع التمارين' },
  { id: 'writing', name: 'الانتاج الكتابي' },
  { id: 'reading', name: 'القراءة' },
  { id: 'islamic', name: 'التربية الإسلامية' }, // المادة الجديدة
  { id: 'science', name: 'الإيقاظ العلمي' },
  { id: 'math', name: 'الرياضيات' },
];

// تحديد ترتيب أهمية المواد
const subjectImportanceOrder = ['الرياضيات', 'الإيقاظ العلمي', 'التربية الإسلامية', 'القراءة', 'الانتاج الكتابي'];

// واجهة لشكل البيانات المجمعة
interface GroupedExercises {
    subject: string;
    periodNumber: number;
    exercises: Exercise[];
}


const ExercisesListPage: React.FC<ExercisesListPageProps> = ({
    selectedChildId,
    studentDetailsMap
}) => {

  // البحث عن بيانات الطالب مع قيمة افتراضية
  const defaultStudentData: StudentData = mockStudentDetails[''] || { name: 'لم يختر', level: '-', age: 0, uniqueId: 'N/A' };
  const selectedStudentData = studentDetailsMap[selectedChildId] || defaultStudentData;

  const [activeFilter, setActiveFilter] = useState<string>('all');

  // فرز فلاتر التبويبات للعرض بناءً على الأهمية
  const sortedTabFilters = useMemo((): SubjectFilter[] => {
      const allFilter = initialSubjectFilters.find(f => f.id === 'all');
      const subjectOnlyFilters = initialSubjectFilters.filter(f => f.id !== 'all');

      subjectOnlyFilters.sort((a, b) => {
          const indexA = subjectImportanceOrder.indexOf(a.name);
          const indexB = subjectImportanceOrder.indexOf(b.name);
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
      });

      // وضع "جميع التمارين" أولاً ليظهر أقصى اليسار في مجموعة الأزرار
      return allFilter ? [allFilter, ...subjectOnlyFilters] : subjectOnlyFilters;
  }, []); // هذا التأثير يعمل مرة واحدة عند تحميل المكون

  // حساب اسم الفلتر النشط
  const activeFilterName = useMemo(() => {
      // البحث في المصفوفة الأصلية لضمان إيجاد الاسم الصحيح
      return initialSubjectFilters.find(f => f.id === activeFilter)?.name || 'جميع التمارين';
  }, [activeFilter]);

  // منطق التصفية والتجميع والفرز لعرض البطاقات
  const groupedAndFilteredExercises = useMemo((): GroupedExercises[] => {
    let exercisesToShow = mockExercises;
    // 1. التصفية حسب التبويب النشط
    if (activeFilter !== 'all') {
      const activeFilterData = initialSubjectFilters.find(f => f.id === activeFilter); // البحث في الأصلي
      const targetSubjectName = activeFilterData ? activeFilterData.name : '';
      exercisesToShow = mockExercises.filter(exercise => exercise.subject === targetSubjectName);
    }
    // 2. التجميع حسب المادة والفترة
    const groups: { [key: string]: { subject: string; periodNumber: number; exercises: Exercise[] } } = {};
    exercisesToShow.forEach(exercise => {
      const key = `${exercise.subject}-${exercise.periodNumber}`;
      if (!groups[key]) {
        groups[key] = { subject: exercise.subject, periodNumber: exercise.periodNumber, exercises: [] };
      }
      groups[key].exercises.push(exercise);
    });
    // 3. الفرز حسب الفترة ثم أهمية المادة
    return Object.values(groups).sort((a, b) => {
        if (a.periodNumber !== b.periodNumber) { return a.periodNumber - b.periodNumber; }
        const indexA = subjectImportanceOrder.indexOf(a.subject);
        const indexB = subjectImportanceOrder.indexOf(b.subject);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, [activeFilter]);


  // ألوان الحالة للخلفيات
  const statusBackgroundColors = {
      completed: '#dcfce7',
      inProgress: '#fce9ec',
      notStarted: '#e5e7eb'
  };
  const remainingColorInProgress = "#ffffff";


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
                {/* استخدام المصفوفة المفرزة sortedTabFilters لعرض الأزرار */}
                {sortedTabFilters.map(filter => {
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
                // البحث عن المعرف الإنجليزي للمادة لتطبيق اللون الصحيح
                const subjectId = initialSubjectFilters.find(f => f.name === group.subject)?.id || ''; // البحث في الأصلي
                const headerBgColor = (subjectColorData.subjectTitleBgColors as Record<string, string>)[subjectId] || '#A1A1AA';
                const bodyBgColor = '#ffffff'; // خلفية بيضاء لقائمة التمارين

                return (
                  <div key={`${group.subject}-${group.periodNumber}`} className={styles.subjectGroup}>
                    {/* رأس المجموعة */}
                    <div className={styles.groupHeader} style={{ backgroundColor: headerBgColor }}>
                      <span className={styles.groupSubjectName}>{group.subject}</span>
                      <span className={styles.groupPeriodName}>{getPeriodName(group.periodNumber)}</span>
                    </div>
                    {/* قائمة تمارين المجموعة */}
                    <div className={styles.groupExerciseList} style={{ backgroundColor: bodyBgColor }}>
                      {group.exercises.map((exercise) => {
                        // حساب ستايل الخلفية بناءً على الحالة
                        let itemStyle: React.CSSProperties = {};
                        let progressFillColor = statusBackgroundColors.notStarted;

                        if (exercise.status === 'مكتمل') {
                            progressFillColor = statusBackgroundColors.completed;
                            itemStyle = { backgroundColor: progressFillColor };
                        } else if (exercise.status === 'لم يبدأ') {
                            progressFillColor = statusBackgroundColors.notStarted;
                            itemStyle = { backgroundColor: progressFillColor };
                        } else if (exercise.status === 'قيد الإنجاز') { // استخدام النص الجديد
                            progressFillColor = statusBackgroundColors.inProgress;
                            itemStyle = {
                                background: `linear-gradient(to left, ${progressFillColor} ${exercise.progress}%, ${remainingColorInProgress} ${exercise.progress}%)`
                            };
                        } else {
                            itemStyle = { backgroundColor: statusBackgroundColors.notStarted };
                        }

                        return (
                          // عنصر التمرين
                          <div
                              key={exercise.id}
                              className={styles.groupedExerciseItem}
                              style={itemStyle}
                          >
                            {/* عنوان التمرين */}
                            <span className={styles.exerciseTitle}>{exercise.title}</span>
                            {/* حاوية الحالة والأيقونة */}
                            <div className={styles.statusIconGroup}>
                                {/* نص الحالة + النسبة المئوية */}
                                <span className={styles.exerciseStatusText}>
                                    {exercise.status} {exercise.progress}%
                                </span>
                                {/* أيقونة السهم */}
                                <HiChevronLeft className={styles.exerciseActionIcon} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              // رسالة في حال عدم وجود تمارين
              <p className={styles.noExercises}>لا توجد تمارين متاحة لهذا الفلتر.</p>
            )}
        </div>
    </div>
  );
};

export default ExercisesListPage;