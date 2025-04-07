// المسار: src/app/auth/register/page.tsx (أو المسار الصحيح لديك)
'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css'; // الأنماط الخاصة بالصفحة
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import delegationsByState from '../../data/delegation.json';
import SubmitButton from '../../components/SubmitButton/SubmitButton'; // *** جديد: استيراد المكون ***

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [state, setState] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [address, setAddress] = useState('');
    const [delegation, setDelegation] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [isLoading, setIsLoading] = useState(false); // حالة تحميل (اختياري)
    const [error, setError] = useState<string | null>(null); // حالة للخطأ

    useEffect(() => {
        setDelegation('');
    }, [state]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null); // مسح الخطأ السابق
        if (password !== confirmPassword) {
            setError("كلمتا السر غير متطابقتين.");
            return;
        }
        if (!termsAgreed) {
             setError("يجب الموافقة على شروط الاستخدام.");
             return;
        }

        setIsLoading(true); // بدء التحميل
        const body = { /* ... بيانات النموذج ... */ }; // بيانات النموذج كما كانت

        try {
            const response = await fetch('http://127.0.0.1:8000/parent/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Registration successful:', data);
                // TODO: Handle successful registration (e.g., redirect to login or dashboard)
                alert('تم التسجيل بنجاح!');
            } else {
                console.error('Registration failed:', data);
                setError(data.message || 'حدث خطأ أثناء التسجيل.');
            }
        } catch (error) {
            console.error('Network or other error:', error);
            setError('حدث خطأ في الشبكة أو مشكلة أخرى.');
        } finally {
            setIsLoading(false); // إيقاف التحميل
        }
    };

    // ... (باقي الدوال المساعدة handlePhoneNumberChange, handlePostalCodeChange) ...
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };


    return (
        <div className={styles.pageContainer}>
            <Header />
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>إنشاء حساب للولي</h1>
                <div className={styles.registerPageContainer}>
                    <div className={styles.formSide}>
                        <form className={styles.registerForm} onSubmit={handleSubmit}>
                            {/* --- حقول النموذج --- */}
                            {/* الاسم */}
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName" className={styles.formLabel}>الاسم:</label>
                                <input type="text" id="firstName" className={styles.formInput} value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isLoading}/>
                            </div>
                            {/* اللقب */}
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName" className={styles.formLabel}>اللقب:</label>
                                <input type="text" id="lastName" className={styles.formInput} value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isLoading}/>
                            </div>
                             {/* الجنس */}
                             <div className={styles.formGroup}>
                                 <label htmlFor="gender" className={styles.formLabel}>الجنس:</label>
                                 <div className={styles.radioGroup}>
                                     <label className={styles.radioLabel}>
                                         <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} className={styles.radioInput} disabled={isLoading}/> ذكر
                                     </label>
                                     <label className={styles.radioLabel}>
                                         <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} className={styles.radioInput} disabled={isLoading}/> أنثى
                                     </label>
                                 </div>
                             </div>
                            {/* رقم الهاتف */}
                            <div className={styles.formGroup}>
                                <label htmlFor="phoneNumber" className={styles.formLabel}>رقم الهاتف:</label>
                                <input type="tel" id="phoneNumber" className={styles.formInput} value={phoneNumber} onChange={handlePhoneNumberChange} dir="rtl" required disabled={isLoading}/>
                            </div>
                            {/* البريد الإلكتروني */}
                            <div className={styles.formGroup}>
                                 <label htmlFor="email" className={styles.formLabel}>البريد الإلكتروني (اختياري):</label>
                                 <input type="email" id="email" className={styles.formInput} value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
                             </div>
                             {/* الولاية */}
                             <div className={styles.formGroup}>
                                 <label htmlFor="state" className={styles.formLabel}>الولاية:</label>
                                 <select id="state" className={styles.formSelect} value={state} onChange={(e) => { setState(e.target.value); setDelegation(''); }} required disabled={isLoading}>
                                     <option value="">اختر ولاية</option>
                                     {Object.keys(delegationsByState).map((stateName) => (<option key={stateName} value={stateName}>{stateName}</option>))}
                                 </select>
                             </div>
                             {/* المعتمدية والترقيم البريدي */}
                             <div className={styles.formRow}>
                                <div className={styles.formGroupHalf}>
                                     <label htmlFor="delegation" className={styles.formLabel}>المعتمدية:</label>
                                     <select id="delegation" className={styles.formSelect} value={delegation} onChange={(e) => setDelegation(e.target.value)} required disabled={isLoading}>
                                         <option value="">اختر معتمدية</option>
                                         {state && delegationsByState[state]?.map((delegationName) => (<option key={delegationName} value={delegationName}>{delegationName}</option>))}
                                     </select>
                                 </div>
                                 <div className={styles.formGroupHalf}>
                                     <label htmlFor="postalCode" className={styles.formLabel}>الترقيم البريدي:</label>
                                     <input type="text" id="postalCode" className={styles.formInput} value={postalCode} onChange={handlePostalCodeChange} maxLength={4} required disabled={isLoading}/>
                                 </div>
                             </div>
                             {/* العنوان */}
                             <div className={styles.formGroup}>
                                 <label htmlFor="address" className={styles.formLabel}>العنوان:</label>
                                 <input type="text" id="address" className={styles.formInput} value={address} onChange={(e) => setAddress(e.target.value)} required disabled={isLoading}/>
                             </div>
                            {/* كلمة السر */}
                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.formLabel}>كلمة السر:</label>
                                <input type="password" id="password" className={styles.formInput} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading}/>
                            </div>
                            {/* تأكيد كلمة السر */}
                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.formLabel}>تأكيد كلمة السر:</label>
                                <input type="password" id="confirmPassword" className={styles.formInput} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading}/>
                            </div>
                            {/* الموافقة على الشروط */}
                            <div className={styles.formGroup}>
                                <div className={styles.checkboxGroup}>
                                    <input type="checkbox" id="termsAgreed" className={styles.checkboxInput} checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} required disabled={isLoading}/>
                                    <label htmlFor="termsAgreed" className={styles.checkboxLabel}>
                                        اطلعت على <Link href="/terms" className={styles.termsLink} target="_blank" rel="noopener noreferrer">شروط استخدام المنصة</Link> وأوافق عليها
                                    </label>
                                </div>
                            </div>

                             {/* عرض رسالة الخطأ */}
                             {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                            {/* *** تعديل: استخدام المكون SubmitButton *** */}
                            <SubmitButton
                                buttonText="إتمام التسجيل"
                                isLoading={isLoading}
                            />
                            {/* -------------------------------------- */}

                            <div className={styles.loginLinkContainer}>
                                <span className={styles.loginLinkText}>
                                    لديك حساب؟ <Link href="/auth/login" className={styles.formLink}>تسجيل الدخول</Link>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// ملاحظة: تم إضافة حالة isLoading و error كمثال لتحسين تجربة المستخدم
// يجب تعديل منطق fetch ليتناسب مع الـ API الفعلي لديك.
