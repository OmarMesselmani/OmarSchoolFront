// المسار: src/app/auth/login/page.tsx

'use client';

import React, { useState } from 'react';
import styles from './page.module.css'; // الأنماط المحدثة الخاصة بالصفحة
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SubmitButton from '../../components/SubmitButton/SubmitButton'; // استيراد المكون

export default function LoginPage() {
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // لإظهار أخطاء تسجيل الدخول

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null); // مسح الخطأ السابق
        console.log({ loginIdentifier, password });

        // --- محاكاة طلب تسجيل الدخول ---
        // استبدل هذا بمنطق fetch الفعلي للـ API الخاص بك
        try {
            // مثال: const response = await fetch('/api/auth/login', { ... });
            await new Promise(resolve => setTimeout(resolve, 1500)); // محاكاة تأخير الشبكة
            // const data = await response.json();
            // if (response.ok) {
                 // TODO: Handle successful login (e.g., save token, redirect)
                 alert('تم تسجيل الدخول بنجاح (محاكاة)');
                 // window.location.href = '/dashboard'; // مثال لإعادة التوجيه
            // } else {
            //     setError(data.message || 'بيانات الدخول غير صحيحة.');
            // }
            // مثال لخطأ محاكاة
             if (password !== 'password') {
                setError('كلمة السر غير صحيحة (مثال)');
             } else {
                alert('تم تسجيل الدخول بنجاح (محاكاة)');
             }

        } catch (err) {
            console.error(err);
            setError('حدث خطأ في الشبكة أو مشكلة أخرى.');
        } finally {
             setIsLoading(false);
        }
         // --- نهاية المحاكاة ---
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            {/* استخدام mainContent مباشرة أو exerciseContainer إذا أردت نفس الهوامش */}
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>تسجيل الدخول</h1>
                {/* استخدام حاوية الصفحة ذات العمودين */}
                <div className={styles.registerPageContainer}>
                    {/* الإبقاء على جانب الصورة */}
                    <div className={styles.imageSide}>
                        <img src="/images/hello1.jpg" alt="صورة تسجيل الدخول" className={styles.imagePlaceholder} />
                    </div>
                    {/* جانب النموذج */}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={styles.forgotPasswordLink}>
                                <a href="#" className={styles.formLink}>نسيت كلمة السر؟</a>
                            </div>

                            {/* عرض رسالة الخطأ */}
                            {error && <p className={styles.errorMessage}>{error}</p>}

                            {/* استخدام المكون SubmitButton */}
                            <SubmitButton
                                buttonText="تسجيل الدخول"
                                isLoading={isLoading}
                            />
                        </form>

                        <div className={styles.loginLinkContainer}> {/* إعادة تسمية الكلاس ليكون أوضح */}
                            <p className={styles.loginLinkText}> {/* استخدام كلاس منفصل للنص */}
                                ليس لديك حساب؟ <Link href="/auth/register" className={styles.formLink}>إنشاء حساب جديد</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
