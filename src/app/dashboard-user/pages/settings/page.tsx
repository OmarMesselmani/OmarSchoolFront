'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import DashboardCard from '@/app/components/dashboard-card/page';
import SubmitButton from '@/app/components/SubmitButton/SubmitButton';
import {
  RiUserLine,
  RiLockLine,
  RiNotification3Line,
  RiDeleteBinLine,
  RiAddLine, 
} from 'react-icons/ri';
import { GoPeople } from 'react-icons/go';

// Props interface for the component
interface SettingsPageProps {
  selectedChildId?: string; 
  studentDetailsMap: { [key: string]: { name: string; level: string; age: number; uniqueId: string; } };
  onUpdateStudentLevel: (studentId: string, newLevel: string) => void; 
  onDeleteStudent: (studentId: string) => void; 
  onAddStudent: () => void; 
}

// Settings card data interface
interface SettingsCardData {
  title: string;
  icon: React.ReactNode;
  isDanger?: boolean;
  component: React.ReactNode;
  areaClass?: string;
}

// Card template component
const SettingsCardTemplate = ({
  title,
  icon,
  children,
  isDanger = false,
  customClass = '',
  areaClass = '',
  className = ''
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isDanger?: boolean;
  customClass?: string;
  areaClass?: string;
  className?: string;
}) => (
  <div className={`${styles.settingsCardWrapper} ${isDanger ? styles.dangerCard : ''} ${areaClass} ${className}`}>
    <div className={`${styles.customHeader} ${isDanger ? styles.dangerHeader : ''}`}>
      <span className={styles.headerTitle}>{title}</span>
      <span className={styles.headerIcon}>{icon}</span>
    </div>
    <DashboardCard
      className={`${isDanger ? styles.dangerCardInner : ''} ${styles.settingsCard} ${customClass}`}
      style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
    >
      <div className={`${styles.cardBody} ${isDanger ? styles.dangerCardBody : ''}`}>
        {children}
      </div>
    </DashboardCard>
  </div>
);

export default function SettingsPage({
  studentDetailsMap = {}, 
  onUpdateStudentLevel = (studentId, newLevel) => console.warn('onUpdateStudentLevel not provided', studentId, newLevel),
  onDeleteStudent = (studentId) => console.warn('onDeleteStudent not provided', studentId),
  onAddStudent = () => console.warn('onAddStudent not provided'), 
}: SettingsPageProps) {
  const router = useRouter();
  
  // User data state
  const [email, setEmail] = useState('parent@example.com');
  const [phone, setPhone] = useState('99123456');
  const [firstName, setFirstName] = useState('محمد');
  const [lastName, setLastName] = useState('العربي');

  // Security data state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications data state
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // حذف states المتعلقة بإعدادات المظهر
  // const [darkMode, setDarkMode] = useState(false);
  // const [fontScale, setFontScale] = useState(100);

  // إضافة حالة لتتبع التلميذ الذي تم تغيير مستواه وسبب التغيير
  const [studentBeingUpdated, setStudentBeingUpdated] = useState<string | null>(null);
  const [levelChangeReason, setLevelChangeReason] = useState<string>('error'); // القيمة الافتراضية هي الخيار الأول
  const [otherReasonText, setOtherReasonText] = useState('');
  const [hasStudentChanges, setHasStudentChanges] = useState(false);

  // دالة لضبط ارتفاع textarea حسب المحتوى - تم نقلها هنا قبل استخدامها
  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; // إعادة تعيين الارتفاع
    textarea.style.height = `${textarea.scrollHeight}px`; // تعيين الارتفاع حسب المحتوى
    
    setOtherReasonText(textarea.value); // تحديث قيمة النص
  };

  // Available school years
  const schoolYears = [
    { value: '1', label: 'السنة الأولى' },
    { value: '2', label: 'السنة الثانية' },
    { value: '3', label: 'السنة الثالثة' },
    { value: '4', label: 'السنة الرابعة' },
    { value: '5', label: 'السنة الخامسة' },
    { value: '6', label: 'السنة السادسة' },
  ];

  // Event handlers
  const handleSaveAccountInfo = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('تم حفظ معلومات الحساب');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }
    console.log('تم تغيير كلمة المرور');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('تم حفظ إعدادات الإشعارات');
  };

  // دالة لتعامل مع تغيير السبب - تضاف هنا
  const handleReasonChange = (newReason: string) => {
    setLevelChangeReason(newReason);
    
    // إذا تغير الاختيار من "سبب آخر" إلى خيار آخر، إعادة تعيين النص
    if (newReason !== 'other') {
      setOtherReasonText('');
    }
  };

  const handleYearChange = (studentId: string, newLevelValue: string) => {
    const selectedYearObject = schoolYears.find(year => year.value === newLevelValue);
    const currentStudent = filteredStudentDetailsMap[studentId];
    const currentLevel = schoolYears.find(year => year.label === currentStudent?.level)?.value;
    
    if (selectedYearObject && currentLevel !== newLevelValue) {
      // إذا تغير المستوى، اجعل هذا التلميذ نشطًا ليظهر مربع الأسباب
      setStudentBeingUpdated(studentId);
      setLevelChangeReason('error'); // إعادة تعيين القيمة الافتراضية
      setOtherReasonText(''); // إعادة تعيين نص السبب الآخر
      setHasStudentChanges(true); // تعيين أن هناك تغييرات تحتاج للحفظ
    }
  };

  const handleDeleteStudentClick = (studentId: string, studentName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف التلميذ ${studentName}؟`)) {
      onDeleteStudent(studentId);
      console.log(`Deleting student ${studentId}`);
    }
  };

  // إضافة دالة للتراجع عن تغيير المستوى - تضاف هنا
  const handleCancelLevelChange = (studentId: string) => {
    // إلغاء عملية تغيير المستوى
    setStudentBeingUpdated(null);
    setLevelChangeReason('error');
    setOtherReasonText('');
    
    // إعادة تعيين حالة التغييرات
    setHasStudentChanges(false);
    
    // طباعة رسالة تشير إلى إلغاء العملية
    console.log(`تم إلغاء تعديل مستوى التلميذ ${studentId}`);
  };

  const handleSaveStudentData = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // حفظ بيانات التلاميذ مع أسباب التغيير إن وجدت
    if (studentBeingUpdated) {
      const reason = levelChangeReason === 'other' 
        ? `سبب آخر: ${otherReasonText || 'غير محدد'}` 
        : levelChangeReason === 'error' 
          ? 'أخطأت أثناء عملية إضافة التلميذ'
          : 'رسوب التلميذ في السنة الفارطة';
      
      console.log(`سبب تغيير المستوى للتلميذ ${studentBeingUpdated}: ${reason}`);
      
      // إعادة تعيين الحقل النصي
      setOtherReasonText('');
    }
    
    // إغلاق قسم أسباب التغيير
    setStudentBeingUpdated(null);
    setHasStudentChanges(false);
    
    console.log('تم حفظ بيانات التلاميذ');
    alert('تم حفظ بيانات التلاميذ بنجاح');
  };

  // Filter out the student named "لم يختر"
  const filteredStudentDetailsMap = Object.entries(studentDetailsMap)
    .filter(([key, student]) => student.name !== "لم يختر") // Ensure this matches the exact name to filter
    .reduce((acc, [key, student]) => {
      acc[key] = student;
      return acc;
    }, {} as { [key: string]: { name: string; level: string; age: number; uniqueId: string; } });


  const settingsCards: SettingsCardData[] = [
    {
      title: "معلومات الحساب",
      icon: <RiUserLine size={20} />,
      areaClass: styles.cardArea1,
      component: (
        <form onSubmit={handleSaveAccountInfo} className={`${styles.settingsForm} ${styles.flexGrow}`}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>الاسم</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.formInput} placeholder="الاسم"/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>اللقب</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.formInput} placeholder="اللقب"/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.formInput} placeholder="example@domain.com"/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>رقم الهاتف</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={styles.formInput} placeholder="9X XXX XXX"/>
          </div>
          <div className={styles.formActions}>
            <SubmitButton 
              onClick={(e) => handleSaveAccountInfo(e as unknown as React.FormEvent)}
              text="حفظ التغييرات" 
            />
          </div>
        </form>
      )
    },
    {
      title: "تعديل كلمة المرور",
      icon: <RiLockLine size={20} />,
      areaClass: styles.cardArea2,
      component: (
        <form onSubmit={handleChangePassword} className={`${styles.settingsForm} ${styles.flexGrow}`}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>كلمة المرور الحالية</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={styles.formInput} placeholder="أدخل كلمة المرور الحالية" required/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>كلمة المرور الجديدة</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={styles.formInput} placeholder="أدخل كلمة المرور الجديدة" required/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>تأكيد كلمة المرور</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.formInput} placeholder="أدخل كلمة المرور الجديدة مرة أخرى" required/>
          </div>
          <div className={styles.formActions}>
            <SubmitButton 
              onClick={(e) => handleChangePassword(e as unknown as React.FormEvent)}
              text="تغيير كلمة المرور" 
            />
          </div>
        </form>
      )
    },
    {
      title: "قائمة التلاميذ",
      icon: <GoPeople size={20} />,
      areaClass: styles.cardArea3,
      component: (
        <div className={`${styles.studentListContainerOuter} ${styles.flexGrow}`}>
          {/* القسم الخاص بعرض التلاميذ */}
          {filteredStudentDetailsMap && Object.keys(filteredStudentDetailsMap).length > 0 ? (
            <ul className={styles.studentListUnstyled}>
              {Object.values(filteredStudentDetailsMap).map((student) => {
                const currentYearValue = schoolYears.find(year => year.label === student.level)?.value || '';
                const isBeingUpdated = studentBeingUpdated === student.uniqueId;
                
                return (
                  <li key={student.uniqueId} className={styles.studentEditableItem}>
                    <div className={styles.studentItemHeader}>
                      <div className={styles.studentNameContainer}>
                        <span className={styles.studentNameLabel}>التلميذ:</span>
                        <span className={styles.studentNameValue}>{student.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteStudentClick(student.uniqueId, student.name)}
                        className={styles.deleteStudentButton}
                        title={`حذف التلميذ ${student.name}`}
                      >
                        <RiDeleteBinLine size={20} />
                      </button>
                    </div>
                    
                    <div className={styles.studentYearModificationBlock}>
                      <label htmlFor={`year-${student.uniqueId}`} className={styles.yearLabelTitle}>
                        تعديل السنة الدراسية:
                      </label>
                      <select
                        id={`year-${student.uniqueId}`}
                        value={currentYearValue}
                        onChange={(e) => handleYearChange(student.uniqueId, e.target.value)}
                        className={styles.yearSelectDropdown}
                        disabled={isBeingUpdated} // تعطيل القائمة المنسدلة أثناء إظهار أسباب التغيير
                      >
                        {schoolYears.map(year => (
                          <option key={year.value} value={year.value}>
                            {year.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* قائمة أسباب تغيير المستوى - تظهر فقط للتلميذ الذي تم تغيير مستواه */}
                    {isBeingUpdated && (
                      <div className={styles.reasonSelectionContainer}>
                        <h4 className={styles.reasonTitle}>سبب تعديل السنة الدراسية</h4>
                        
                        <div className={styles.radioGroup}>
                          <label className={styles.radioLabel}>
                            <input 
                              type="radio" 
                              name={`reason-${student.uniqueId}`} 
                              value="error"
                              checked={levelChangeReason === 'error'}
                              onChange={() => handleReasonChange('error')}
                            />
                            <span className={styles.radioText}>أخطأت أثناء عملية إضافة التلميذ</span>
                          </label>
                        </div>
                        
                        <div className={styles.radioGroup}>
                          <label className={styles.radioLabel}>
                            <input 
                              type="radio" 
                              name={`reason-${student.uniqueId}`} 
                              value="failed"
                              checked={levelChangeReason === 'failed'}
                              onChange={() => handleReasonChange('failed')}
                            />
                            <span className={styles.radioText}>رسوب التلميذ في السنة الفارطة</span>
                          </label>
                        </div>
                        
                        <div className={styles.radioGroup}>
                          <label className={styles.radioLabel}>
                            <input 
                              type="radio" 
                              name={`reason-${student.uniqueId}`} 
                              value="other"
                              checked={levelChangeReason === 'other'}
                              onChange={() => handleReasonChange('other')}
                            />
                            <span className={styles.radioText}>سبب آخر</span>
                          </label>
                        </div>
                        
                        {/* إضافة حقل نصي يظهر فقط عند اختيار "سبب آخر" */}
                        {levelChangeReason === 'other' && (
                          <div className={styles.otherReasonContainer}>
                            <textarea
                              value={otherReasonText}
                              className={styles.otherReasonInput}
                              placeholder="اذكر السبب"
                              onChange={adjustTextareaHeight}
                              rows={1}
                            />
                          </div>
                        )}
                        
                        {/* إضافة زر الإلغاء فقط */}
                        <div className={styles.reasonActions}>
                          <button 
                            type="button"
                            onClick={() => handleCancelLevelChange(student.uniqueId)}
                            className={styles.secondaryButton}
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.noStudentsText}>لا يوجد تلاميذ مسجلين حالياً.</p>
          )}

          {/* زر إضافة تلميذ - كما كان في الأصل */}
          <button
            onClick={() => router.push('/auth/add-child')}
            className={styles.addStudentButton}
          >
            <RiAddLine size={22} className={styles.addStudentButtonIcon} />
            إضافة تلميذ
          </button>
          
          {/* زر حفظ البيانات - في أسفل البطاقة */}
          <div className={styles.formActions}>
            <SubmitButton 
              onClick={handleSaveStudentData}
              text="حفظ البيانات"
              disabled={!hasStudentChanges}
            />
          </div>
        </div>
      )
    },
    {
      title: "الإشعارات",
      icon: <RiNotification3Line size={20} />,
      areaClass: styles.cardArea6, // يمكن تغيير رقم المنطقة إلى cardArea4 إذا أردت
      component: (
        <form className={styles.settingsForm}>
          <div className={`${styles.flexGrow}`}>
            {/* إبقاء فقط على خيار البريد الإلكتروني */}
            <div className={styles.switchGroup}>
              <div className={styles.switchInfo}>
                <h4 className={styles.switchTitle}>إشعارات البريد الإلكتروني</h4>
                <p className={styles.switchDesc}>استلام الإشعارات عبر البريد الإلكتروني</p>
              </div>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => {
                    setEmailNotifications(e.target.checked);
                    console.log('تم حفظ إعدادات الإشعارات');
                  }}
                />
                <span className={styles.switchToggle}></span>
              </label>
            </div>
          </div>
        </form>
      )
    },
    {
      title: "حذف الحساب",
      icon: <RiDeleteBinLine size={20} />,
      isDanger: true,
      areaClass: styles.cardArea9,
      component: (
        <div className={styles.specialDangerSection}>
          <p className={styles.dangerText}>سيتم حذف حسابك في غضون ثلاثين يوما، وخلال هذه الفترة سيتم تعطيل حسابك، حيث يمكنك استرجاعه بفتحه مجددا.</p>
          <p className={styles.dangerText}>بعد انتهاء فترة المهلة سيتم حذف حسابك نهائيا مع جميع البيانات الخاصة به، ولا يمكنك استرجاعه بعد ذلك.</p>
          <div className={styles.formActions}>
            <button className={styles.dangerButton}>حذف الحساب</button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.cardsGrid}>
        {settingsCards.map((card, index) => (
          <SettingsCardTemplate
            key={`${card.title}-${index}`}
            title={card.title}
            icon={card.icon}
            isDanger={card.isDanger}
            areaClass={card.areaClass}
            className={card.isDanger ? styles.dangerCard : ''}
            customClass={card.isDanger ? styles.dangerCardBody : ''}  // إضافة هذا السطر المهم
          >
            {card.component}
          </SettingsCardTemplate>
        ))}
      </div>
    </div>
  );
}