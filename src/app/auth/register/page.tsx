'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';

const tunisianStates = [
    "أريانة", "باجة", "بن عروس", "بنزرت", "تطاوين", "توزر", "تونس", "جندوبة", "زغوان", "سليانة", "سوسة", "سيدي بوزيد", "صفاقس", "قابس", "قفصة", "القصرين", "القيروان", "قبلي", "الكاف", "مدنين", "المنستير", "المهدية", "نابل"
];

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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log({ firstName, lastName, gender, phoneNumber, email, state, password, confirmPassword, termsAgreed });
        alert('تم تقديم نموذج التسجيل (سيتم استبدال هذا بتنفيذ التسجيل الفعلي)');
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 8) {
            setPhoneNumber(numericValue);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>إنشاء حساب جديد</h1>
                <div className={styles.registerPageContainer}>
                    <div className={styles.imageSide}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="/images/hello1.png"
                                alt="صورة التسجيل"
                                width={450}
                                height={350}
                                priority
                                className={styles.registerImage}
                            />
                        </div>
                    </div>
                    <div className={styles.formSide}>
                        <form className={styles.registerForm} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName" className={styles.formLabel}>
                                    الاسم:
                                </label>
                                <input type="text" id="firstName" className={styles.formInput} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="lastName" className={styles.formLabel}>
                                    اللقب:
                                </label>
                                <input type="text" id="lastName" className={styles.formInput} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="gender" className={styles.formLabel}>
                                    الجنس:
                                </label>
                                <div className={styles.radioGroup}>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={gender === 'male'}
                                            onChange={(e) => setGender(e.target.value)}
                                            className={styles.radioInput}
                                        />
                                        ذكر
                                    </label>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={gender === 'female'}
                                            onChange={(e) => setGender(e.target.value)}
                                            className={styles.radioInput}
                                        />
                                        أنثى
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phoneNumber" className={styles.formLabel}>
                                    رقم الهاتف:
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    className={styles.formInput}
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.formLabel}>
                                    البريد الإلكتروني (اختياري):
                                </label>
                                <input type="email" id="email" className={styles.formInput} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="state" className={styles.formLabel}>
                                    الولاية:
                                </label>
                                <select id="state" className={styles.formSelect} value={state} onChange={(e) => setState(e.target.value)} required>
                                    <option value="">اختر ولاية</option>
                                    {tunisianStates.map((stateName) => (
                                        <option key={stateName} value={stateName}>{stateName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.formLabel}>
                                    كلمة السر:
                                </label>
                                <input type="password" id="password" className={styles.formInput} value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.formLabel}>
                                    تأكيد كلمة السر:
                                </label>
                                <input type="password" id="confirmPassword" className={styles.formInput} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        id="termsAgreed"
                                        className={styles.checkboxInput}
                                        checked={termsAgreed}
                                        onChange={(e) => setTermsAgreed(e.target.checked)}
                                        required
                                    />
                                    <label htmlFor="termsAgreed" className={styles.checkboxLabel}>
                                        اطلعت على <Link href="/terms" className={styles.termsLink} target="_blank" rel="noopener noreferrer">شروط استخدام المنصة</Link> وأوافق عليها
                                    </label>
                                </div>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button type="submit" className={styles.submitButton} disabled={!termsAgreed}>إتمام التسجيل</button>
                            </div>
                            <div className={styles.loginLinkContainer}>
                                <span className={styles.loginLinkText}>
                                    لديك حساب؟ <Link href="/auth/login" className={styles.loginLink}>تسجيل الدخول</Link>
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