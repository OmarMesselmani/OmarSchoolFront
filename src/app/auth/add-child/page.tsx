// المسار: src/app/parent/add-child/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import SubmitButton from '@/app/components/SubmitButton/SubmitButton';
import checkAuth from '@/app/services/check-auth';
import Cookies from 'js-cookie';
import LoadingPage from '@/app/components/loading-page/LoadingPage';
import { Student } from '@/app/data-structures/Student';

// واجهة لبيانات الطفل

export default function AddChildPage() {
    // استخدام كائن واحد لتخزين بيانات التلميذ
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [currentLevel, setCurrentLevel] = useState('');
    const [hasFailedBefore, setHasFailedBefore] = useState<boolean | null>(false);
    const [failedYears, setFailedYears] = useState<string[]>([]);


    // حالة التحميل والخطأ
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [failedYearError, setFailedYearError] = useState<string | null>(null); // إضافة حالة خطأ خاصة بسنة الرسوب
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isFullLoading, setIsFullLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // حالة تسجيل الدخول

    // دالة إرسال النموذج (ترسل بيانات كل الأطفال)
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setFailedYearError(null); // إعادة تعيين رسالة خطأ سنة الرسوب
        setSuccessMessage(null);

        // التحقق من صحة البيانات المدخلة
        if (!name || !surname || !gender || !dateOfBirth || !currentLevel || !hasFailedBefore) {
            setError('يرجى ملء جميع الحقول المطلوبة.');
            setIsLoading(false);
            return;
        }

        // التحقق من اختيار سنة الرسوب إذا كانت الإجابة "نعم"
        if (hasFailedBefore === true && (failedYears.length === 0)) {
            setFailedYearError('يرجى اختيار السنة التي رسب فيها التلميذ.');
            setIsLoading(false);
            return;
        }

        try {
            const studentData = {
                name,
                surname,
                gender,
                date_of_birth: dateOfBirth,
                current_level: currentLevel,
                has_failed_before: hasFailedBefore,
                failed_year: failedYears.join(','), // or just failedYears if backend accepts array
            };

            const token = Cookies.get('token');
            const response = await fetch('http://127.0.0.1:8000/student/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ students: studentData }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage('تمت إضافة التلميذ بنجاح.');
                setTimeout(() => {
                    window.location.href = '/dashboard-user';
                }, 2000);
            } else {
                setError(data.message || 'حدث خطأ أثناء إضافة التلميذ.');
            }
        } catch (error) {
            console.error(error);
            setError('حدث خطأ في الشبكة.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkUserAuth = async () => {
            try {
                const authStatus = await checkAuth();
                if (!authStatus.status) {
                    window.location.href = '/login';
                } else {
                    setIsFullLoading(false);
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        }
        checkUserAuth();
    }, []);

    if (isFullLoading) {
        return <LoadingPage />;
    }

    return (
        <div className={styles.pageContainer}>
            <Head>
                <title>إضافة تلميذ</title>
            </Head>
            <Header />
            <main className={styles.exerciseContainer}>
                <div className={styles.mainContent}>
                    <h1 className={styles.pageTitle}>إضافة تلميذ</h1>
                    <div className={styles.formContainer}>

                        <form onSubmit={handleSubmit}>
                            {/* باقي حقول النموذج للطفل */}
                            <div className="child-section mb-6 last:mb-0">
                                {/* حقل الاسم الأول */}
                                <div className={styles.formGroup}>
                                    <label htmlFor={`name`} className={styles.formLabel}>اسم التلميذ:</label>
                                    <input type="text" id={`name`} className={styles.formInput} value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                                </div>

                                {/* حقل اللقب */}
                                <div className={styles.formGroup}>
                                    <label htmlFor={`surname`} className={styles.formLabel}>لقب التلميذ:</label>
                                    <input type="text" id={`surname`} className={styles.formInput} value={surname} onChange={(e) => setSurname(e.target.value)} required disabled={isLoading} />
                                </div>

                                {/* حقل الجنس */}
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>جنس التلميذ:</label>
                                    <div className={styles.radioGroup}>
                                        <label className={styles.radioLabel}>
                                            <input type="radio" name={`childGender`} value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} className={styles.radioInput} required disabled={isLoading} /> ذكر
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input type="radio" name={`childGender`} value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} className={styles.radioInput} required disabled={isLoading} /> أنثى
                                        </label>
                                    </div>
                                </div>

                                {/* حقل تاريخ الميلاد */}
                                <div className={styles.formGroup}>
                                    <label htmlFor={`dateOfBirth`} className={styles.formLabel}>تاريخ الميلاد:</label>
                                    <input type="date" id={`dateOfBirth`} className={styles.formInput} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required disabled={isLoading} max={new Date().toISOString().split("T")[0]} />
                                </div>

                                {/* حقل المستوى الدراسي الحالي */}
                                <div className={styles.formGroup}>
                                    <label htmlFor={`currentLevel`} className={styles.formLabel}>المستوى الدراسي الحالي:</label>
                                    <select id={`currentLevel`} className={styles.formSelect} value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} required disabled={isLoading}>
                                        <option value="" disabled>-- اختر المستوى --</option>
                                        <option value="السنة الأولى">السنة الأولى</option>
                                        <option value="السنة الثانية">السنة الثانية</option>
                                        <option value="السنة الثالثة">السنة الثالثة</option>
                                        <option value="السنة الرابعة">السنة الرابعة</option>
                                        <option value="السنة الخامسة">السنة الخامسة</option>
                                        <option value="السنة السادسة">السنة السادسة</option>
                                    </select>
                                </div>

                                {/* حقل سؤال الرسوب */}
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>هل رسب التلميذ سابقًا؟</label>
                                    <div className={styles.radioGroup}>
                                        <label className={styles.radioLabel}>
                                            <input type="radio" name={`hasFailed`} value={"true"} checked={hasFailedBefore === true} onChange={(e) => setHasFailedBefore(true)} className={styles.radioInput} required disabled={isLoading} /> نعم
                                        </label>
                                        <label className={styles.radioLabel}>
                                            <input type="radio" name={`hasFailed`} value={"false"} checked={hasFailedBefore === false} onChange={(e) => setHasFailedBefore(false)} className={styles.radioInput} required disabled={isLoading} /> لا
                                        </label>
                                    </div>
                                </div>

                                {/* حقل سنة الرسوب (يظهر شرطيًا بسلاسة) - مع دعم الاختيار المتعدد */}
                                <div className={`${styles.formGroup} ${styles.conditionalFieldContainer} ${hasFailedBefore === true ? styles.visible : ''}`}>
                                    <label className={styles.formLabel}>ماهي السنة الدراسية التي سبق له الرسوب فيها؟</label>
                                    <div className={styles.checkboxGroup}>
                                        {['السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'السنة الخامسة', 'السنة السادسة']
                                            // فلترة السنوات بحيث لا تتجاوز المستوى الحالي للطالب
                                            .filter(year => {
                                                // ترتيب السنوات الدراسية
                                                const yearOrder = {
                                                    'السنة الأولى': 1,
                                                    'السنة الثانية': 2,
                                                    'السنة الثالثة': 3,
                                                    'السنة الرابعة': 4,
                                                    'السنة الخامسة': 5,
                                                    'السنة السادسة': 6
                                                };

                                                // السماح فقط بالسنوات التي تسبق أو تساوي المستوى الحالي للطالب
                                                return yearOrder[year as keyof typeof yearOrder] <= yearOrder[currentLevel as keyof typeof yearOrder];
                                            })
                                            .map((year) => (
                                                <label key={year} className={styles.checkboxLabel}>
                                                    <input
                                                        type="checkbox"
                                                        checked={failedYears.includes(year)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFailedYears([...failedYears, year]);
                                                            } else {
                                                                setFailedYears(failedYears.filter((y) => y !== year));
                                                            }
                                                        }}
                                                    />

                                                    {year}
                                                </label>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            {/* عرض رسائل الخطأ أو النجاح */}
                            {error && <p className={styles.errorMessage}>{error}</p>}
                            {failedYearError && <p className={styles.errorMessage}>{failedYearError}</p>} {/* عرض رسالة خطأ سنة الرسوب */}
                            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                            {/* زر الإرسال يأتي أولاً */}
                            <SubmitButton
                                buttonText="إضافة التلميذ"
                                isLoading={isLoading}
                            />
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
