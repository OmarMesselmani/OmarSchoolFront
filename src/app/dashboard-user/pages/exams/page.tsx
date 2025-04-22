// المسار: src/app/dashboardUser/pages/exams/page.tsx

'use client';

import React, { useState, useMemo } from 'react';
// تأكد من أن ملف CSS موجود في نفس المجلد أو عدّل المسار
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
// واجهة Props لهذه الصفحة
interface ExamsPageProps {
  selectedChildId: string;
  studentDetailsMap: StudentDetailsMap;
}
// واجهة بيانات الامتحان
interface Exam {
    id: string;
    subject: string;
    title: string;
    status: string; // 'لم يبدأ', 'مكتمل', 'قيد الإنجاز'
    periodNumber: number;
    progress: number; // سنستخدمه للتصميم (0, 1-99, 100)
    score?: number; // اختياري: درجة الامتحان
}
// واجهة لفلتر المواد
interface SubjectFilter {
    id: string;
    name: string;
}
// --- نهاية الواجهات ---

// --- بيانات وهمية (يفضل استيرادها أو جلبها من API) ---
const mockStudentDetails: StudentDetailsMap = {
    'child1': { name: 'التلميذ الأول', level: 'السنة الأولى', age: 6, uniqueId: '123456789123' },
    'child2': { name: 'التلميذ الثاني', level: 'السنة الثالثة', age: 8, uniqueId: '987654321987' },
    'child3': { name: 'التلميذ الثالث', level: 'السنة الخامسة', age: 10, uniqueId: '112233445566' },
    '': { name: 'لم يختر', level: '-', age: 0, uniqueId: 'N/A' }
};

// دالة لتوليد بيانات امتحانات وهمية (10 نماذج لكل فترة/مادة)
const generateMockExams = (): Exam[] => {
    const subjects = [
        { id: 'math', name: 'الرياضيات' },
        { id: 'science', name: 'الإيقاظ العلمي' },
        { id: 'islamic', name: 'التربية الإسلامية' },
        { id: 'reading', name: 'القراءة' },
        { id: 'writing', name: 'الانتاج الكتابي' },
    ];
    const exams: Exam[] = [];
    let examId = 1;
    // استخدام نفس حالات التمارين لتطبيق نفس الألوان والتدرج
    const statuses = ['لم يبدأ', 'مكتمل', 'قيد الإنجاز'];

    subjects.forEach(subject => {
        // لنفترض 3 فترات (ثلاثيات) للامتحانات كمثال
        for (let period = 1; period <= 3; period++) {
            // 10 نماذج لكل فترة
            for (let exNum = 1; exNum <= 10; exNum++) { // <-- تغيير هنا إلى 10
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                let progress = 0;
                if (status === 'مكتمل') {
                    progress = 100;
                } else if (status === 'قيد الإنجاز') {
                    progress = Math.floor(Math.random() * 81) + 10; // 10-90
                } // "لم يبدأ" يبقى 0

                exams.push({
                    id: `exam-${subject.id}-${period}-${exNum}`, // تغيير المعرف
                    subject: subject.name,
                    title: `نموذج ${String(exNum).padStart(2, '0')}`, // عنوان النموذج
                    status: status,
                    periodNumber: period,
                    progress: progress // استخدام progress للتلوين
                });
            }
        }
    });
    return exams;
};
const mockExams: Exam[] = generateMockExams(); // إنشاء البيانات الوهمية للامتحانات

// دالة مساعدة للحصول على اسم الفترة/الثلاثي بالعربية
const getPeriodName = (periodNumber: number): string => {
    const names = ['الأول', 'الثاني', 'الثالث']; // تعديل للثلاثي
    return `الثلاثي ${names[periodNumber - 1] || periodNumber}`;
};
// --- نهاية البيانات الوهمية ---

// بيانات فلاتر التبويبات (تتضمن الآن "جميع الامتحانات")
const subjectFilters: SubjectFilter[] = [
  { id: 'all', name: 'جميع الامتحانات' },
  { id: 'writing', name: 'الانتاج الكتابي' },
  { id: 'reading', name: 'القراءة' },
  { id: 'islamic', name: 'التربية الإسلامية' },
  { id: 'science', name: 'الإيقاظ العلمي' },
  { id: 'math', name: 'الرياضيات' },
];

// ترتيب أهمية المواد (يمكن تعديله للامتحانات إذا اختلف)
const subjectImportanceOrder = ['الرياضيات', 'الإيقاظ العلمي', 'التربية الإسلامية', 'القراءة', 'الانتاج الكتابي'];

// واجهة لشكل البيانات المجمعة
interface GroupedExams {
    subject: string;
    periodNumber: number; // أو فترة/ثلاثي
    exams: Exam[];
}


const ExamsPage: React.FC<ExamsPageProps> = ({
    selectedChildId,
    studentDetailsMap
}) => {

  // البحث عن بيانات الطالب
  const defaultStudentData: StudentData = mockStudentDetails[''] || { name: 'لم يختر', level: '-', age: 0, uniqueId: 'N/A' };
  const selectedStudentData = studentDetailsMap[selectedChildId] || defaultStudentData;

  const [activeFilter, setActiveFilter] = useState<string>('all');

  // فرز فلاتر التبويبات للعرض
  const sortedTabFilters = useMemo((): SubjectFilter[] => {
      const allFilter = subjectFilters.find(f => f.id === 'all');
      const subjectOnlyFilters = subjectFilters.filter(f => f.id !== 'all');
      subjectOnlyFilters.sort((a, b) => {
          const indexA = subjectImportanceOrder.indexOf(a.name);
          const indexB = subjectImportanceOrder.indexOf(b.name);
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
      });
      return allFilter ? [allFilter, ...subjectOnlyFilters] : subjectOnlyFilters;
  }, []);

  // حساب اسم الفلتر النشط
  const activeFilterName = useMemo(() => {
      return subjectFilters.find(f => f.id === activeFilter)?.name || 'جميع الامتحانات';
  }, [activeFilter]);

  // منطق التصفية والتجميع والفرز للامتحانات
  const groupedAndFilteredExams = useMemo((): GroupedExams[] => {
    let examsToShow = mockExams;
    if (activeFilter !== 'all') {
      const activeFilterData = subjectFilters.find(f => f.id === activeFilter);
      const targetSubjectName = activeFilterData ? activeFilterData.name : '';
      examsToShow = mockExams.filter(exam => exam.subject === targetSubjectName);
    }
    const groups: { [key: string]: { subject: string; periodNumber: number; exams: Exam[] } } = {};
    examsToShow.forEach(exam => {
      const key = `${exam.subject}-${exam.periodNumber}`;
      if (!groups[key]) { groups[key] = { subject: exam.subject, periodNumber: exam.periodNumber, exams: [] }; }
      groups[key].exams.push(exam);
    });
    return Object.values(groups).sort((a, b) => {
        if (a.periodNumber !== b.periodNumber) { return a.periodNumber - b.periodNumber; }
        const indexA = subjectImportanceOrder.indexOf(a.subject);
        const indexB = subjectImportanceOrder.indexOf(b.subject);
        if (indexA === -1 && indexB === -1) return 0; if (indexA === -1) return 1; if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, [activeFilter]);


  // ألوان الحالة الفاتحة للخلفيات/التدرج
  const statusBackgroundColors = {
      completed: '#dcfce7',      // أخضر فاتح لـ "مكتمل"
      inProgress: '#fce9ec',      // وردي فاتح لـ "قيد الإنجاز"
      notStarted: '#e5e7eb'       // رمادي فاتح لـ "لم يبدأ" أو "مجدول" أو "لم يجتز"
  };
  // اللون المتبقي في حالة "قيد الإنجاز" هو الأبيض
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
                {sortedTabFilters.map(filter => {
                    let inlineStyles: React.CSSProperties = {};
                    const isActive = activeFilter === filter.id;
                    // منطق ألوان الأزرار
                     if (filter.id === 'all') {
                        if (isActive) { inlineStyles = { backgroundColor: 'var(--main-color, #DD2946)', borderColor: 'var(--main-color, #DD2946)' }; }
                    } else {
                        const cardBgColor = (subjectColorData.subjectCardBgColors as Record<string, string>)[filter.id];
                        const titleBgColor = (subjectColorData.subjectTitleBgColors as Record<string, string>)[filter.id];
                        if (isActive) {
                            if (titleBgColor) { inlineStyles = { backgroundColor: titleBgColor, borderColor: titleBgColor }; }
                            else { inlineStyles = { backgroundColor: 'var(--main-color, #DD2946)', borderColor: 'var(--main-color, #DD2946)'}; }
                        } else {
                            if (cardBgColor && titleBgColor) { inlineStyles = { backgroundColor: cardBgColor, borderColor: titleBgColor, color: titleBgColor }; }
                        }
                    }
                    return ( <button key={filter.id} className={`${styles.tabItem} ${isActive ? styles.active : ''}`} style={inlineStyles} onClick={() => setActiveFilter(filter.id)}> {filter.name} </button> );
                })}
             </div>
        </div>

        {/* منطقة عرض قائمة الامتحانات المجمعة */}
        <div className={styles.groupedExerciseListContainer}>
            {groupedAndFilteredExams.length > 0 ? (
              groupedAndFilteredExams.map(group => {
                const subjectId = subjectFilters.find(f => f.name === group.subject)?.id || '';
                const headerBgColor = (subjectColorData.subjectTitleBgColors as Record<string, string>)[subjectId] || '#A1A1AA';
                const bodyBgColor = '#ffffff';

                return (
                  <div key={`${group.subject}-${group.periodNumber}`} className={styles.subjectGroup}>
                    {/* رأس المجموعة */}
                    <div className={styles.groupHeader} style={{ backgroundColor: headerBgColor }}>
                      <span className={styles.groupSubjectName}>{group.subject}</span>
                      <span className={styles.groupPeriodName}>{getPeriodName(group.periodNumber)}</span>
                    </div>
                    {/* قائمة امتحانات المجموعة */}
                    <div className={styles.groupExerciseList} style={{ backgroundColor: bodyBgColor }}>
                      {group.exams.map((exam) => { // استخدام exam هنا
                        // حساب ستايل الخلفية بناءً على الحالة ونسبة التقدم
                        let itemStyle: React.CSSProperties = {};
                        let progressFillColor = statusBackgroundColors.notStarted; // اللون الافتراضي

                        if (exam.status === 'مكتمل') {
                            progressFillColor = statusBackgroundColors.completed;
                            itemStyle = { backgroundColor: progressFillColor }; // لون أخضر فاتح صلب
                        } else if (exam.status === 'لم يبدأ' || exam.status === 'مجدول' || exam.status === 'لم يجتز') {
                            // يمكن استخدام ألوان مختلفة لهذه الحالات إذا أردت
                            progressFillColor = statusBackgroundColors.notStarted;
                            itemStyle = { backgroundColor: progressFillColor }; // لون رمادي فاتح صلب
                        } else if (exam.status === 'قيد الإنجاز') { // نفس حالة التمارين
                            progressFillColor = statusBackgroundColors.inProgress;
                            itemStyle = {
                                // تطبيق التدرج الوردي -> الأبيض
                                background: `linear-gradient(to left, ${progressFillColor} ${exam.progress}%, ${remainingColorInProgress} ${exam.progress}%)`
                            };
                        } else { // حالة افتراضية
                            itemStyle = { backgroundColor: statusBackgroundColors.notStarted };
                        }

                        return (
                          // عنصر الامتحان
                          <div
                              key={exam.id}
                              className={styles.groupedExerciseItem} // استخدام نفس الكلاسات حالياً
                              style={itemStyle}
                          >
                            {/* عنوان الامتحان */}
                            <span className={styles.exerciseTitle}>{exam.title}</span>
                            {/* حاوية الحالة والأيقونة */}
                            <div className={styles.statusIconGroup}>
                                {/* نص الحالة + النسبة المئوية */}
                                <span className={styles.exerciseStatusText}>
                                    {exam.status} {exam.progress}%
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
              // رسالة في حال عدم وجود امتحانات
              <p className={styles.noExercises}>لا توجد امتحانات متاحة لهذا الفلتر.</p>
            )}
        </div>
    </div>
  );
};

export default ExamsPage; // تغيير اسم التصدير