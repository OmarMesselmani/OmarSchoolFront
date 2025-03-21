'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link'; 

export default function LoginPage() {
    const [loginIdentifier, setLoginIdentifier] = useState('');
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
            {/* صور الخلفية */}
            <img src="/images/side1.png" alt="صورة يمين" className={styles.rightImage} />
            <img src="/images/side2.png" alt="صورة يسار" className={styles.leftImage} />
            
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>تسجيل الدخول</h1>
                <div className={styles.registerPageContainer}>
                    <div className={styles.imageSide}>
                        <img src="/images/hello1.jpg" alt="صورة تسجيل الدخول" className={styles.imagePlaceholder} />
                    </div>
                    <div className={styles.formSide}>
                        <form className={styles.registerForm} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="loginIdentifier" className={styles.formLabel}>البريد الإلكتروني أو رقم الهاتف:</label>
                                <input
                                    type="text"
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

                            <div className={styles.forgotPasswordLink}>
                                <a href="#" className={styles.formLink}>نسيت كلمة السر؟</a>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button type="submit" className={styles.submitButton}>تسجيل الدخول</button>
                            </div>
                        </form>

                        <div className={styles.createAccountLinkContainer}>
                            <p className={styles.createAccountText}>
                                ليس لديك حساب؟ <Link href="/auth/register" className={styles.formLink}>إنشاء حساب جديد</Link>
                            </p>
                        </div>
                    </div>
                </div>
                {/* إضافة رابط العودة إلى الصفحة الرئيسية خارج النموذج وفي منتصف الصفحة */}
                <div className={styles.homePageLinkContainer}>
                    <Link href="/" className={styles.homePageLink}>العودة إلى الصفحة الرئيسية</Link>
                </div>
            </main>
        </div>
    );
}