'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link'; // استيراد компонент Link

export default function LoginPage() {
    const [loginIdentifier, setLoginIdentifier] = useState(''); // لحفظ البريد الإلكتروني أو رقم الهاتف
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // هنا يمكنك إضافة كود لمعالجة تسجيل الدخول وإرسال البيانات إلى الخادم
        console.log({
            loginIdentifier, // يمكن أن يكون بريد إلكتروني أو رقم هاتف
            password,
        });
        alert('تم تقديم نموذج تسجيل الدخول (سيتم استبدال هذا بتنفيذ تسجيل الدخول الفعلي)');
    };

    return (
        <div className={styles.pageContainer}>
            <Header />

            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>تسجيل الدخول</h1> {/* عنوان صفحة تسجيل الدخول */}

                <div className={styles.registerPageContainer}> {/* إعادة استخدام نفس حاوية صفحة التسجيل للتصميم المتشابه */}
                    <div className={styles.imageSide}>
                        <div className={styles.imagePlaceholder}>صورة</div> {/* نفس عنصر نائب الصورة */}
                    </div>

                    <div className={styles.formSide}>
                        <form className={styles.registerForm} onSubmit={handleSubmit}> {/* إعادة استخدام نفس ستايل النموذج */}

                            <div className={styles.formGroup}>
                                <label htmlFor="loginIdentifier" className={styles.formLabel}>البريد الإلكتروني أو رقم الهاتف:</label> {/*  تعديل الليبل */}
                                <input
                                    type="text" // نوع الإدخال يمكن أن يكون نص لاستقبال البريد الإلكتروني أو رقم الهاتف
                                    id="loginIdentifier"
                                    className={styles.formInput}
                                    value={loginIdentifier}
                                    onChange={(e) => setLoginIdentifier(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.formLabel}>كلمة السر:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={styles.formInput}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.forgotPasswordLink}> {/* رابط "نسيت كلمة السر" -  تم نقله للأعلى */}
                                <a href="#" className={styles.formLink}>نسيت كلمة السر؟</a>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button type="submit" className={styles.submitButton}>تسجيل الدخول</button> {/* تعديل نص الزر */}
                            </div>


                        </form>

                        <div className={styles.createAccountLinkContainer}> {/* حاوية لرابط إنشاء حساب */}
                            <p className={styles.createAccountText}>
                                ليس لديك حساب؟ <Link href="/auth/register" className={styles.formLink}>إنشاء حساب جديد</Link> {/* رابط لصفحة التسجيل */}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}