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
import { Pack, Subject } from '@/app/data-structures/Exam';
import Cookies from 'js-cookie';
import router from 'next/router';
import LoadingPage from '@/app/components/loading-page/LoadingPage';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchPacksData();
        fetchSubjectsData();
    }, [activeFilter])

    const fetchSubjectsData = async () => {
        try {
            setIsLoading(true);
            const token = Cookies.get('token');
            if (!token) {
                window.location.href = '/auth/login';
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
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExerciseOrder = async (exam_id: number, pack_unique_code: string, student_id: number, exam_unique_code: string) => {
        try {
            setIsLoading(true);
            const token = Cookies.get('token');
            if (!token) {
                window.location.href = '/auth/login';
            }

            const response = await fetch(`http://127.0.0.1:8000/student/exam/current-exercise-order?`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    exam_id: exam_id,
                    pack_unique_code: pack_unique_code,
                    student_id: student_id, // تمرير معرف الطالب
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch student data.");
            }

            const data = await response.json();
            const step = parseInt(data.order);
            if (step >= 0) {
                window.location.href = (`/exam/${pack_unique_code}/${exam_unique_code}/${step}`);
            }
        } catch (error: any) {
            console.error("Error fetching student data:", error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const fetchPacksData = async () => {
        try {
            setIsLoading(true);
            const token = Cookies.get('token');
            if (!token) {
                window.location.href = '/auth/login';
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
        } finally {
            setIsLoading(false);
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





    // ألوان الحالة للخلفيات
    const statusBackgroundColors = {
        completed: '#dcfce7',
        inProgress: '#fce9ec',
        notStarted: '#e5e7eb'
    };
    const remainingColorInProgress = "#ffffff";

    if (isLoading) {
        return (
            <LoadingPage />
        );
    }
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
                    packData.map(pack => {
                        // const headerBgColor = (subjectColorData.subjectTitleBgColors as Record<string, string>)[subjectId] || '#A1A1AA';
                        const bodyBgColor = '#ffffff';

                        return (
                            <div key={`${pack.subject}-${pack?.period?.name}`} className={styles.packContainer}>
                                <div className={styles.packTitle}>{pack?.title}</div>

                                {pack?.exams.map((exam) => {
                                    let itemStyle: React.CSSProperties = {};
                                    let progressFillColor = statusBackgroundColors.notStarted;
                                    if (exam.status === 'finished') {
                                        progressFillColor = statusBackgroundColors.completed;
                                        itemStyle = { backgroundColor: progressFillColor };
                                    } else if (exam.status === 'pending') {
                                        progressFillColor = statusBackgroundColors.notStarted;
                                        itemStyle = { backgroundColor: progressFillColor };
                                    } else if (exam.status === 'in_progress') {
                                        progressFillColor = statusBackgroundColors.inProgress;
                                        itemStyle = {
                                            background: `linear-gradient(to left, ${progressFillColor} ${exam.progress}%, ${remainingColorInProgress} ${exam.progress}%)`
                                        };
                                    } else {
                                        itemStyle = { backgroundColor: statusBackgroundColors.notStarted };
                                    }
                                    return (
                                        <div key={exam?.id} className={styles.subjectGroup}>
                                            {/* رأس المجموعة */}
                                            <div className={styles.groupHeader} style={{ backgroundColor: '#A1A1AA' }}>
                                                <span className={styles.groupSubjectName}>{exam?.subject?.name}</span>
                                                <span className={styles.groupPeriodName}>{pack?.period?.name}</span>
                                            </div>
                                            {/* قائمة تمارين المجموعة */}
                                            <div className={styles.groupExerciseList} style={{ backgroundColor: bodyBgColor }}>
                                                <button
                                                    key={exam.id}
                                                    // href={`/exam/${pack?.unique_code}/${exam?.unique_id}/0`} 
                                                    onClick={() => fetchExerciseOrder(exam?.id, pack?.unique_code, selectedChildId, exam?.unique_id)}
                                                    className={styles.exerciseLink}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <div
                                                        className={styles.groupedExerciseItem}
                                                        style={itemStyle}
                                                    >
                                                        {/* عنوان التمرين */}
                                                        <div className={styles.exerciseTitleContainer}>
                                                            <span className={styles.exerciseTitle}>{exam.title}</span>
                                                        </div>
                                                        {/* حاوية الحالة والأيقونة */}
                                                        <div className={styles.statusIconGroup}>
                                                            {/* نص الحالة + النسبة المئوية */}
                                                            <span className={styles.exerciseStatusText}>
                                                                {exam.status} {exam.progress > 0 ? `${exam.progress}%` : ''}
                                                            </span>
                                                            {/* أيقونة السهم */}
                                                            <HiChevronLeft className={styles.exerciseActionIcon} />
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>)
                                })}
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