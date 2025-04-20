'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css'; // الأنماط المحدثة الخاصة بالصفحة
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SubmitButton from '../../components/SubmitButton/SubmitButton'; // استيراد المكون

import Cookies from 'js-cookie'; // استيراد مكتبة js-cookie لإدارة الكوكيز
import checkAuth from '@/app/services/check-auth';
import LoadingPage from '@/app/components/loading-page/LoadingPage';
export default function LoginPage() {
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // لإظهار أخطاء تسجيل الدخول
    const [isFullLoading, setIsFullLoading] = useState(true);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);



        const body = {
            loginIdentifier,
            password,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/parent/sign-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) {
                Cookies.set('token', data.token, { path: '/', secure: true });
                window.location.href = "/";
            } else {
                console.error('Registration failed:', data);
                setError(data.message || 'حدث خطأ أثناء التسجيل.');
            }
        } catch (error) {
            console.error('Network or other error:', error);
            setError('حدث خطأ في الشبكة أو مشكلة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkUserAuth = async () => {
            try {
                setIsFullLoading(true);
                const authStatus = await checkAuth();
                if (authStatus.status) {
                    window.location.href = '/';
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
        return <LoadingPage />
    } else {
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
}
