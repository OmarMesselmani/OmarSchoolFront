// المسار: src/app/dashboardUser/pages/exercises-list/page.tsx

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import styles from './page.module.css';
import StudentInfoHeader from '@/app/components/student-info-header/page';
import subjectColorData from '@/app/data/subjectColors.json';
import { HiChevronLeft } from "react-icons/hi";
import Link from 'next/link';
// إضافة استيراد ملف التكوين
import { EXERCISES_CONFIG } from '@/app/config/exerciseConfig';
import { ExamWithExercises, Pack, Subject } from '@/app/data-structures/Exam';
import Cookies from 'js-cookie';

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
    selectedChildId: number;
    studentDetailsMap: StudentDetailsMap;
}
interface Exercise {
    id: string;
    subject: string;
    title: string;
    status: string;
    periodNumber: number;
    progress: number;
    link: string;
}
interface SubjectFilter {
    id: string;
    name: string;
}

// --- دالة لجلب عنوان التمرين من ملف التكوين ---
const getExerciseTitle = (exerciseNumber: number): string => {
    const exerciseKey = `exercise${exerciseNumber}`;
    const exerciseConfig = EXERCISES_CONFIG[exerciseKey];
    return exerciseConfig?.title || `التمرين رقم ${exerciseNumber}`;
};



// --- دالة محسنة لتوليد قائمة التمارين مع تحديد المادة الصحيحة ---
const generateExercisesFromConfig = (): Exercise[] => {
    const exercises: Exercise[] = [];

    // تعريف مطابقة التمارين مع المواد والمسارات
    const exerciseMapping: { [key: string]: { subject: string; path: string } } = {
        'exercise1': { subject: 'القراءة', path: '/exercises/year1/reading/introductory/exercise1/qs1' }, // ✅
        'exercise2': { subject: 'القراءة', path: '/exercises/year1/reading/introductory/exercise2/qs1' }, // ✅
        'exercise3': { subject: 'القراءة', path: '/exercises/year1/reading/introductory/exercise3/qs1' }, // ✅
        'exercise4': { subject: 'الإيقاظ العلمي', path: '/exercises/year1/science/unit1/exercise4/qs1' }, // ✅
    };

    // التكرار عبر جميع التمارين في ملف التكوين
    Object.keys(EXERCISES_CONFIG).forEach((exerciseKey) => {
        console.log(`Processing exercise: ${exerciseKey}`);
        const exerciseConfig = EXERCISES_CONFIG[exerciseKey];
        const mapping = exerciseMapping[exerciseKey];

        if (mapping) {
            exercises.push({
                id: `${mapping.subject === 'القراءة' ? 'reading' : 'science'}-year1-${exerciseKey}`,
                subject: mapping.subject,
                title: exerciseConfig.title, // جلب العنوان من ملف التكوين
                status: 'لم يبدأ',
                periodNumber: 1,
                progress: 0,
                link: mapping.path,
            });
        }
    });

    return exercises;
};

// --- استخدام الدالة المحسنة ---
const realExercisesFromConfig: Exercise[] = generateExercisesFromConfig();

// دالة مساعدة للحصول على اسم الفترة بالعربية
const getPeriodName = (periodNumber: number): string => {
    const names = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
    return `الفترة ${names[periodNumber - 1] || periodNumber}`;
};

// بيانات فلاتر التبويبات
const initialSubjectFilters: SubjectFilter[] = [
    { id: 'all', name: 'جميع التمارين' },
    { id: 'reading', name: 'القراءة' },
    { id: 'math', name: 'الرياضيات' },
    { id: 'science', name: 'الإيقاظ العلمي' },
    { id: 'islamic', name: 'التربية الإسلامية' },
    { id: 'writing', name: 'الانتاج الكتابي' },
];

// تحديد ترتيب أهمية المواد
const subjectImportanceOrder = ['القراءة', 'الرياضيات', 'الإيقاظ العلمي', 'التربية الإسلامية', 'الانتاج الكتابي'];

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
    const [packData, setPackData] = useState<Pack[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeFilter, setActiveFilter] = useState<number>(null);

    useEffect(() => {
        fetchPacksData();
        fetchSubjectsData();
    }, [activeFilter])

    const fetchSubjectsData = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                window.location.href = '/login';
            }

            const response = await fetch(`http://127.0.0.1:8000/student/subjects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch student data.");
            }

            const data: Subject[] = await response.json();
            console.log("Fetched exam data:", data);
            setSubjects(data);
        } catch (error: any) {
            console.error("Error fetching student data:", error.message);
        }
    };


    const fetchPacksData = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                window.location.href = '/login';
            }

            const response = await fetch(`http://127.0.0.1:8000/student/packs?subject_id=${activeFilter}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch student data.");
            }

            const data: Pack[] = await response.json();
            console.log("Fetched exam data:", data);
            setPackData(data);
        } catch (error: any) {
            console.error("Error fetching student data:", error.message);
        }
    };

    // البحث عن بيانات الطالب مع قيمة افتراضية في حالة عدم وجود بيانات
    const defaultStudentData: StudentData = {
        name: 'طالب غير محدد',
        level: 'غير محدد',
        age: 0,
        uniqueId: 'N/A'
    };
    const selectedStudentData = studentDetailsMap[selectedChildId] || defaultStudentData;



    var targetSubjectName: string = 'جميع التمارين';
    // منطق التصفية والتجميع والفرز لعرض البطاقات
    const groupedAndFilteredExercises = useMemo((): GroupedExercises[] => {
        // استخدام التمارين المولدة من ملف التكوين
        let exercisesToShow = realExercisesFromConfig;

        // 1. التصفية حسب التبويب النشط
        if (activeFilter !== null) {
            const activeFilterData = subjects.find(f => f.id === activeFilter);
            targetSubjectName = activeFilterData ? activeFilterData.name : '';
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
                    childID={selectedChildId}
                />
            </div>

            {/* شريط التبويبات */}
            <div className={styles.tabsContainer}>
                <h3 className={styles.activeTabTitle}>{targetSubjectName}</h3>
                <div className={styles.tabButtonsGroup}>
                    {subjects.map(filter => {
                        let inlineStyles: React.CSSProperties = {};
                        const isActive = activeFilter === filter.id;


                        const cardBgColor = (subjectColorData.subjectCardBgColors as Record<string, string>)[filter.id];
                        const titleBgColor = (subjectColorData.subjectTitleBgColors as Record<string, string>)[filter.id];
                        if (isActive) {
                            if (titleBgColor) {
                                inlineStyles = { backgroundColor: titleBgColor, borderColor: titleBgColor };
                            } else {
                                inlineStyles = { backgroundColor: 'var(--main-color, #DD2946)', borderColor: 'var(--main-color, #DD2946)' };
                            }
                        } else {
                            if (cardBgColor && titleBgColor) {
                                inlineStyles = { backgroundColor: cardBgColor, borderColor: titleBgColor, color: titleBgColor };
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
                {packData.length > 0 ? (
                    packData.map(group => {
                        // const headerBgColor = (subjectColorData.subjectTitleBgColors as Record<string, string>)[subjectId] || '#A1A1AA';
                        const bodyBgColor = '#ffffff';

                        return (
                            <div key={`${group.subject}-${group?.period?.name}`} className={styles.subjectGroup}>
                                {/* رأس المجموعة */}
                                <div className={styles.groupHeader} style={{ backgroundColor: '#A1A1AA' }}>
                                    <span className={styles.groupSubjectName}>{group?.subject?.name}</span>
                                    <span className={styles.groupPeriodName}>{group?.period?.name}</span>
                                </div>
                                {/* قائمة تمارين المجموعة */}
                                <div className={styles.groupExerciseList} style={{ backgroundColor: bodyBgColor }}>
                                    {group?.exams.map((exercise) => {
                                        // حساب ستايل الخلفية بناءً على الحالة
                                        let itemStyle: React.CSSProperties = {};
                                        let progressFillColor = statusBackgroundColors.notStarted;

                                        if (exercise.status === 'finished') {
                                            progressFillColor = statusBackgroundColors.completed;
                                            itemStyle = { backgroundColor: progressFillColor };
                                        } else if (exercise.status === 'pending') {
                                            progressFillColor = statusBackgroundColors.notStarted;
                                            itemStyle = { backgroundColor: progressFillColor };
                                        } else if (exercise.status === 'in_progress') {
                                            progressFillColor = statusBackgroundColors.inProgress;
                                            itemStyle = {
                                                background: `linear-gradient(to left, ${progressFillColor} ${exercise.progress}%, ${remainingColorInProgress} ${exercise.progress}%)`
                                            };
                                        } else {
                                            itemStyle = { backgroundColor: statusBackgroundColors.notStarted };
                                        }

                                        return (
                                            <Link
                                                key={exercise.id}
                                                href="/subject-exercises"
                                                // href={exercise.link}
                                                className={styles.exerciseLink}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <div
                                                    className={styles.groupedExerciseItem}
                                                    style={itemStyle}
                                                >
                                                    {/* عنوان التمرين */}
                                                    <div className={styles.exerciseTitleContainer}>
                                                        <span className={styles.exerciseTitle}>{exercise.title}</span>
                                                    </div>
                                                    {/* حاوية الحالة والأيقونة */}
                                                    <div className={styles.statusIconGroup}>
                                                        {/* نص الحالة + النسبة المئوية */}
                                                        <span className={styles.exerciseStatusText}>
                                                            {exercise.status} {exercise.progress > 0 ? `${exercise.progress}%` : ''}
                                                        </span>
                                                        {/* أيقونة السهم */}
                                                        <HiChevronLeft className={styles.exerciseActionIcon} />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className={styles.noExercises}>لا توجد تمارين متاحة لهذا القسم.</p>
                )}
            </div>
        </div>
    );
};

export default ExercisesListPage;