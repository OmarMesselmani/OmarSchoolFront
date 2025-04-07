// المسار: src/app/parent/add-child/page.tsx

'use client';

import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import styles from './page.module.css'; // استخدام الأنماط الجديدة
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import SubmitButton from '@/app/components/SubmitButton/SubmitButton'; // استيراد زر الإرسال

// واجهة لبيانات الطفل
interface ChildData {
    id: number; // معرف فريد لكل طفل في الحالة المؤقتة
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    schoolLevel: string;
    hasFailedPreviously: string; // 'yes' or 'no' or ''
    failedYear?: string;
}

// دالة لإنشاء بيانات طفل فارغة بمعرف فريد
const createEmptyChild = (): ChildData => ({
    id: Date.now() + Math.random(), // معرف مؤقت بسيط
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    schoolLevel: '',
    hasFailedPreviously: '',
    failedYear: '',
});

// دالة مساعدة للحصول على الكلمة الترتيبية
const getOrdinalWord = (index: number): string => {
    if (index === 0) return "الأول";
    if (index === 1) return "الثاني";
    if (index === 2) return "الثالث";
    return `${index + 1}`; // كاحتياط إذا زاد العدد عن 3
};


export default function AddChildPage() {
    // استخدام مصفوفة لتخزين بيانات الأطفال
    const [children, setChildren] = useState<ChildData[]>([createEmptyChild()]); // ابدأ بطفل واحد

    // حالة التحميل والخطأ (مشتركة لكل النموذج)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // دالة لإضافة نموذج طفل جديد (بحد أقصى 3)
    const addChildForm = () => {
        if (children.length >= 3) {
            setError("لا يمكنك إضافة أكثر من 3 تلاميذ.");
            setSuccessMessage(null);
            return;
        }
        setError(null);
        setSuccessMessage(null);
        setChildren(prev => [...prev, createEmptyChild()]);
    };

    // دالة لتحديث بيانات طفل معين في المصفوفة
    const updateChildData = (index: number, field: keyof Omit<ChildData, 'id'>, value: string) => {
        setChildren(prev => {
            const updatedChildren = [...prev];
            if(updatedChildren[index]) {
                updatedChildren[index] = { ...updatedChildren[index], [field]: value };
                if (field === 'hasFailedPreviously' && value === 'no') {
                    updatedChildren[index].failedYear = '';
                }
            }
            return updatedChildren;
        });
    };

    // معالج تغيير اختيار الرسوب
    const handleFailChange = (index: number, value: 'yes' | 'no') => {
        updateChildData(index, 'hasFailedPreviously', value);
    };


    // دالة إرسال النموذج (ترسل بيانات كل الأطفال)
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);
        let formIsValid = true;

        // التحقق من صحة بيانات كل طفل
        children.forEach((child, index) => {
            if (!child.firstName || !child.lastName || !child.gender || !child.dateOfBirth || !child.schoolLevel || !child.hasFailedPreviously) {
                setError(`يرجى ملء جميع الحقول المطلوبة للطفل ${getOrdinalWord(index)}.`);
                formIsValid = false;
                return;
            }
            if (child.hasFailedPreviously === 'yes' && !child.failedYear) {
                 setError(`يرجى تحديد سنة الرسوب للطفل ${getOrdinalWord(index)}.`);
                 formIsValid = false;
                 return;
            }
        });

        if (!formIsValid) return;

        setIsLoading(true);
        const childrenDataToSend = children.map(({ id, ...rest }) => rest);
        console.log("بيانات الأطفال للإرسال:", childrenDataToSend);

        // --- محاكاة إرسال البيانات إلى الخادم ---
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Children added successfully');
            setSuccessMessage(`تمت إضافة ${children.length} تلميذ/تلاميذ بنجاح!`);
            setChildren([createEmptyChild()]);
        } catch (err) {
            console.error(err);
            setError('حدث خطأ في الشبكة أو مشكلة أخرى.');
        } finally {
            setIsLoading(false);
        }
        // --- نهاية محاكاة الإرسال ---
    };

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
                            {/* المرور على مصفوفة الأطفال وعرض نموذج لكل منهم */}
                            {children.map((child, index) => (
                                <React.Fragment key={child.id}>
                                    {/* إضافة خط فاصل قبل الطفل الثاني والثالث */}
                                    {index > 0 && <hr className="border-gray-200 my-6" />}

                                     {/* إظهار العنوان فقط إذا كان هناك أكثر من طفل وتغيير النص */}
                                     {children.length > 1 && (
                                        <h3 className="text-lg font-semibold mb-4 text-[#DD2946] text-center">
                                            بيانات التلميذ {getOrdinalWord(index)}
                                        </h3>
                                    )}

                                    {/* باقي حقول النموذج للطفل */}
                                    <div className="child-section mb-6 last:mb-0">
                                        {/* حقل الاسم الأول */}
                                        <div className={styles.formGroup}>
                                            <label htmlFor={`firstName-${index}`} className={styles.formLabel}>اسم التلميذ:</label>
                                            <input type="text" id={`firstName-${index}`} className={styles.formInput} value={child.firstName} onChange={(e) => updateChildData(index, 'firstName', e.target.value)} required disabled={isLoading}/>
                                        </div>

                                        {/* حقل اللقب */}
                                        <div className={styles.formGroup}>
                                            <label htmlFor={`lastName-${index}`} className={styles.formLabel}>لقب التلميذ:</label>
                                            <input type="text" id={`lastName-${index}`} className={styles.formInput} value={child.lastName} onChange={(e) => updateChildData(index, 'lastName', e.target.value)} required disabled={isLoading}/>
                                        </div>

                                        {/* حقل الجنس */}
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>جنس التلميذ:</label>
                                            <div className={styles.radioGroup}>
                                                <label className={styles.radioLabel}>
                                                    <input type="radio" name={`childGender-${index}`} value="male" checked={child.gender === 'male'} onChange={(e) => updateChildData(index, 'gender', e.target.value)} className={styles.radioInput} required disabled={isLoading}/> ذكر
                                                </label>
                                                <label className={styles.radioLabel}>
                                                    <input type="radio" name={`childGender-${index}`} value="female" checked={child.gender === 'female'} onChange={(e) => updateChildData(index, 'gender', e.target.value)} className={styles.radioInput} required disabled={isLoading}/> أنثى
                                                </label>
                                            </div>
                                        </div>

                                        {/* حقل تاريخ الميلاد */}
                                        <div className={styles.formGroup}>
                                            <label htmlFor={`dateOfBirth-${index}`} className={styles.formLabel}>تاريخ الميلاد:</label>
                                            <input type="date" id={`dateOfBirth-${index}`} className={styles.formInput} value={child.dateOfBirth} onChange={(e) => updateChildData(index, 'dateOfBirth', e.target.value)} required disabled={isLoading} max={new Date().toISOString().split("T")[0]} />
                                        </div>

                                        {/* حقل المستوى الدراسي الحالي */}
                                        <div className={styles.formGroup}>
                                            <label htmlFor={`schoolLevel-${index}`} className={styles.formLabel}>المستوى الدراسي الحالي:</label>
                                            <select id={`schoolLevel-${index}`} className={styles.formSelect} value={child.schoolLevel} onChange={(e) => updateChildData(index, 'schoolLevel', e.target.value)} required disabled={isLoading}>
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
                                                    <input type="radio" name={`hasFailed-${index}`} value="yes" checked={child.hasFailedPreviously === 'yes'} onChange={(e) => handleFailChange(index, e.target.value as 'yes' | 'no')} className={styles.radioInput} required disabled={isLoading}/> نعم
                                                </label>
                                                <label className={styles.radioLabel}>
                                                    <input type="radio" name={`hasFailed-${index}`} value="no" checked={child.hasFailedPreviously === 'no'} onChange={(e) => handleFailChange(index, e.target.value as 'yes' | 'no')} className={styles.radioInput} required disabled={isLoading}/> لا
                                                </label>
                                            </div>
                                        </div>

                                        {/* حقل سنة الرسوب (يظهر شرطيًا بسلاسة) */}
                                        <div className={`${styles.formGroup} ${styles.conditionalFieldContainer} ${child.hasFailedPreviously === 'yes' ? styles.visible : ''}`}>
                                            <label htmlFor={`failedYear-${index}`} className={styles.formLabel}>ماهي السنة الدراسية التي سبق له الرسوب فيها؟</label>
                                            <select
                                                id={`failedYear-${index}`}
                                                className={styles.formSelect}
                                                value={child.failedYear || ''}
                                                onChange={(e) => updateChildData(index, 'failedYear', e.target.value)}
                                                disabled={isLoading || child.hasFailedPreviously !== 'yes'}
                                                tabIndex={child.hasFailedPreviously === 'yes' ? 0 : -1}
                                            >
                                                <option value="" disabled>-- اختر السنة --</option>
                                                <option value="السنة الأولى">السنة الأولى</option>
                                                <option value="السنة الثانية">السنة الثانية</option>
                                                <option value="السنة الثالثة">السنة الثالثة</option>
                                                <option value="السنة الرابعة">السنة الرابعة</option>
                                                <option value="السنة الخامسة">السنة الخامسة</option>
                                                <option value="السنة السادسة">السنة السادسة</option>
                                            </select>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}

                            {/* عرض رسائل الخطأ أو النجاح */}
                            {error && <p className={styles.errorMessage}>{error}</p>}
                            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                            {/* زر الإرسال يأتي أولاً */}
                             {/* *** تعديل: إعادة النص الديناميكي للزر *** */}
                            <SubmitButton
                                buttonText={children.length > 1 ? "إضافة التلاميذ" : "إضافة التلميذ"}
                                isLoading={isLoading}
                            />

                             {/* زر الإضافة أو رسالة الحد الأقصى تأتي ثانياً */}
                             {children.length < 3 ? (
                                <button
                                    type="button"
                                    onClick={addChildForm}
                                    className={styles.addButton}
                                    disabled={isLoading}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    إضافة تلميذ آخر
                                </button>
                            ) : (
                                <p className={styles.limitMessage}>لقد بلغت الحد الأقصى لإضافة التلاميذ.</p>
                            )}

                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
