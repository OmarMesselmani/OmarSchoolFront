'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const tunisianStates = [
    "أريانة", "باجة", "بن عروس", "بنزرت", "تطاوين", "توزر", "تونس", "جندوبة", "زغوان", "سليانة", "سوسة", "سيدي بوزيد", "صفاقس", "قابس", "قفصة", "القصرين", "القيروان", "قبلي", "الكاف", "مدنين", "المنستير", "المهدية", "نابل"
];

const delegationsByState: { [key: string]: string[] } = {
    "أريانة": ["أريانة المدينة", "التضامن", "قلعة الأندلس", "المنيهلة", "رواد", "سيدي ثابت", "سكرة"],
    "باجة": ["عمدون", "باجة الشمالية", "باجة الجنوبية", "غوبلات", "مجاز الباب", "نفزة", "تبرسق", "تستور", "تيبار"],
    "بن عروس": ["بن عروس", "بومهل", "المروج", "الزهراء", "فوشانة", "حمام الشط", "حمام الأنف", "المحمدية", "المدينة الجديدة", "مقرين", "مرناق", "رادس"],
    "بنزرت": ["بنزرت الشمالية", "بنزرت الجنوبية", "جومين", "العالية", "غار الملح", "غزالة", "ماطر", "منزل بورقيبة", "منزل جميل", "رأس الجبل", "سجنان", "تينجة", "أوتيك", "زرزونة"],
    "جندوبة": ["عين دراهم", "بلطة", "بوسالم", "فرنانة", "غار الدماء", "جندوبة", "جندوبة الشمالية", "وادي مليز", "طبرقة"],
    "سيدي بوزيد": ["بئر الحفي", "جلمة", "المزونة", "المكناسي", "منزل بوزيان", "أولاد حفوز", "الرقاب", "السبالة أولاد عسكر", "سيدي علي بن عون", "سيدي بوزيد الشرقية", "سيدي بوزيد الغربية", "سوق الجديد"],
    "سليانة": ["برقو", "بوعرادة", "العروسة", "الكريب", "قعفور", "كسرة", "مكثر", "الروحية", "سيدي بورويس", "سليانة الشمالية", "سليانة الجنوبية"],
    "سوسة": ["أكودة", "بوفيشة", "النفيضة", "حمام سوسة", "هرقلة", "القلعة الكبرى", "القلعة الصغرى", "كندار", "مساكن", "سيدي بوعلي", "سيدي الهاني", "سوسة جوهرة", "سوسة المدينة", "سوسة الرياض", "سوسة سيدي عبد الحميد", "الزاوية القصيبة الثريات"],
    "صفاقس": ["عقارب", "بئر علي بن خليفة", "العامرة", "الغريبة", "الحنشة", "جبنيانة", "قرقنة", "المحرس", "منزل شاكر", "ساقية الداير", "ساقية الزيت", "صفاقس المدينة", "صفاقس الغربية", "صفاقس الجنوبية", "الصخيرة", "طينة"],
    "تطاوين": ["بئر الأحمر", "الذهيبة", "غمراسن", "رمادة", "الصمار", "تطاوين الشمالية", "تطاوين الجنوبية"],
    "قابس": ["قابس المدينة", "قابس الغربية", "قابس الجنوبية", "غنوش", "الحامة", "مارث", "المطوية", "مطماطة الجديدة", "منزل الحبيب", "متوية"],
    "قفصة": ["بلخير", "قفصة الشمالية", "قفصة الجنوبية", "القطار", "القصر", "المظيلة", "المتلوي", "أم العرائس", "الرديف", "السند", "سيدي عيش"],
    "القصرين": ["العيون", "الزهور", "فريانة", "فوسانة", "حاسي الفريد", "حيدرة", "جدليان", "القصرين الشمالية", "القصرين الجنوبية", "ماجل بلعباس", "سبيطلة", "سبيبة", "تالة"],
    "القيروان": ["العلا", "بوحجلة", "الشبيكة", "الشراردة", "حفوز", "حاجب العيون", "القيروان الشمالية", "القيروان الجنوبية", "نصر الله", "الوسلاتية", "السبيخة"],
    "الكاف": ["الدهماني", "السرس", "جريصة", "القلعة الخصبة", "قلعة سنان", "الكاف الشرقية", "الكاف الغربية", "قصور", "نبر", "ساقية سيدي يوسف", "تاجروين"],
    "المهدية": ["بومرداس", "الشابة", "شربان", "الجم", "هبيرة", "قصور الساف", "المهدية", "ملولش", "أولاد الشامخ", "سيدي علوان", "السواسي"],
    "المنستير": ["البقالطة", "البمبلة", "بني حسان", "جمال", "قصيبة المديوني", "قصر هلال", "المكنين", "المنستير", "الوردانين", "الساحلين", "صيادة-لمطة-بوحجر", "طبلبة", "زرمدين"],
    "مدنين": ["بن قردان", "بني خداش", "جربة أجيم", "جربة ميدون", "جربة حومة السوق", "مدنين الشمالية", "مدنين الجنوبية", "سيدي مخلوف", "جرجيس"],
    "منوبة": ["برج العامري", "دوار هيشر", "البطان", "الجديدة", "منوبة", "مرناقية", "وادي الليل", "طبربة"],
    "نابل": ["بني خيار", "بني خلاد", "بوعرقوب", "دار شعبان الفهري", "الميدة", "قرمبالية", "حمام الغزاز", "الحمامات", "الهوارية", "قليبية", "قربة", "منزل بوزلفة", "منزل تميم", "نابل", "سليمان", "تاكلسة"],
    "توزر": ["دقاش", "حزوة", "نفطة", "تمغزة", "توزر"],
    "تونس": ["باب بحر", "باب سويقة", "باردو", "البحيرة", "قرطاج", "الخضراء", "المنزه", "الوردية", "التحرير", "الزهور", "الحرايرية", "جبل الجلود", "الكبارية", "حلق الوادي", "المرسى", "الكرم", "المدينة", "العمران", "العمران الأعلى", "سيدي البشير", "سيدي حسين", "السيجومي"],
    "زغوان": ["بئر مشارقة", "الفحص", "الناظور", "صواف", "زغوان", "الزريبة"],
    "قبلي": ["دوز الشمالية", "دوز الجنوبية", "الفوار", "قبلي الشمالية", "قبلي الجنوبية", "سوق الأحد"]
};

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

    useEffect(() => {
        setDelegation('');
    }, [state]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log({ 
            firstName, 
            lastName, 
            gender, 
            phoneNumber, 
            email, 
            state,
            delegation,
            postalCode,
            address,
            password, 
            confirmPassword, 
            termsAgreed 
        });
        alert('تم تقديم نموذج التسجيل (سيتم استبدال هذا بتنفيذ التسجيل الفعلي)');
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 8) {
            setPhoneNumber(numericValue);
        }
    };

    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 4) {
            setPostalCode(numericValue);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <main className={styles.mainContent}>
                <h1 className={styles.pageTitle}>إنشاء حساب للولي</h1>
                <div className={styles.registerPageContainer}>
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
                                    dir="rtl"
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
                                <select 
                                    id="state" 
                                    className={styles.formSelect} 
                                    value={state} 
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        setDelegation('');
                                    }} 
                                    required
                                >
                                    <option value="">اختر ولاية</option>
                                    {Object.keys(delegationsByState).map((stateName) => (
                                        <option key={stateName} value={stateName}>{stateName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroupHalf}>
                                    <label htmlFor="delegation" className={styles.formLabel}>
                                        المعتمدية:
                                    </label>
                                    <select 
                                        id="delegation" 
                                        className={styles.formSelect} 
                                        value={delegation} 
                                        onChange={(e) => setDelegation(e.target.value)}
                                        required 
                                    >
                                        <option value="">اختر معتمدية</option>
                                        {state && delegationsByState[state]?.map((delegationName) => (
                                            <option key={delegationName} value={delegationName}>
                                                {delegationName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroupHalf}>
                                    <label htmlFor="postalCode" className={styles.formLabel}>
                                        الترقيم البريدي:
                                    </label>
                                    <input 
                                        type="text" 
                                        id="postalCode" 
                                        className={styles.formInput} 
                                        value={postalCode}
                                        onChange={handlePostalCodeChange}
                                        maxLength={4}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="address" className={styles.formLabel}>
                                    العنوان:
                                </label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    className={styles.formInput} 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)}
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.formLabel}>
                                    كلمة السر:
                                </label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    className={styles.formInput} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
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
                                <button type="submit" className={styles.submitButton}>إتمام التسجيل</button>
                            </div>
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