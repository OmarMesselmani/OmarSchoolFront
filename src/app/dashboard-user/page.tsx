'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import Header from '../components/Header'; // تأكد من المسار الصحيح
import Footer from '../components/Footer'; // تأكد من المسار الصحيح
import { RiFileListLine } from 'react-icons/ri';
import { IoSettingsOutline, IoPersonOutline } from 'react-icons/io5';
import { LuChartLine, LuLogOut } from 'react-icons/lu';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { LiaClipboardListSolid } from "react-icons/lia"; // استيراد أيقونة الامتحانات
// استيراد Hook السياق الخاص بالهيدر
import { useHeaderVisibility } from '../contexts/header-context'; // تأكد من المسار الصحيح
import Cookies from 'js-cookie';

// --- استيراد مكونات الصفحات الفرعية ---
import DashboardOverview from './pages/dashboard-overview/page'; // تأكد من المسار kebab-case
import ExercisesListPage from './pages/exercises-list/page';
import LoadingPage from '../components/loading-page/LoadingPage';
import checkAuth from '../services/check-auth';
import ExamsPage from './pages/exams/page';
import { useSearchParams } from 'next/navigation';
import { Student } from '../data-structures/Student';
// --- تعريف المكونات المؤقتة الأخرى أو استيرادها ---
interface StudentData { name: string; level: string; age: number; uniqueId: string; }
interface StudentDetailsMap { [key: string]: StudentData; }
interface PageProps { selectedChildId: number; studentDetailsMap: StudentDetailsMap; }
const StudentResults: React.FC<PageProps> = ({ selectedChildId, studentDetailsMap }) => (<div className="p-4">صفحة النتائج والاحصائيات للطالب: {selectedChildId || 'N/A'}</div>);
const ProfilePage: React.FC<PageProps> = ({ selectedChildId, studentDetailsMap }) => (<div className="p-4">الملف الشخصي للطالب: {selectedChildId || 'N/A'}</div>);
const OffersPage: React.FC<PageProps> = ({ selectedChildId, studentDetailsMap }) => (<div className="p-4">صفحة العروض</div>);
const SettingsPage: React.FC<PageProps> = ({ selectedChildId, studentDetailsMap }) => (<div className="p-4">صفحة إعدادات الحساب</div>);
// --- نهاية المكونات ---

interface Child { id: string; name: string; }

// واجهة Props للمكونات الفرعية
interface SubPageProps {
  selectedChildId: number;
  studentDetailsMap: StudentDetailsMap;
}

// --- بيانات وهمية ---
const mockChildren: Child[] = [
  { id: 'child1', name: 'التلميذ الأول' },
  { id: 'child2', name: 'التلميذ الثاني' },
  { id: 'child3', name: 'التلميذ الثالث' }
];
const mockStudentDetails: StudentDetailsMap = {
  'child1': { name: 'التلميذ الأول', level: 'السنة الأولى', age: 6, uniqueId: '123456789123' },
  'child2': { name: 'التلميذ الثاني', level: 'السنة الثالثة', age: 8, uniqueId: '987654321987' },
  'child3': { name: 'التلميذ الثالث', level: 'السنة الخامسة', age: 10, uniqueId: '112233445566' },
  '': { name: 'لم يختر', level: '-', age: 0, uniqueId: 'N/A' }
};


export default function DashboardUserPage() {
  const [isOpen, setIsOpen] = useState(false); // الشريط مغلق افتراضياً
  const [currentPage, setCurrentPage] = useState('dashboard'); // لوحة التحكم هي الافتراضية
  const sidebarRef = useRef<HTMLDivElement>(null); // المرجع للشريط الجانبي

  const [childrenList, setChildrenList] = useState<Child[]>(mockChildren);
  const [selectedChildId, setSelectedChildId] = useState<number>();

  function handleChangeelectStudent(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = event.target.value;
    setSelectedChildId(parseInt(selectedId)); // تعيين معرف الطفل المحدد
    selectStudent(parseInt(selectedId)); // استدعاء الدالة لاختيار الطالب
  }

  async function selectStudent(studentId: number) {
    try {
      setIsFullLoading(true);
      const token = Cookies.get('token');

      const response = await fetch(`http://127.0.0.1:8000/parent/select-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ student_id: studentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch students.");
      }
    } catch (error: any) {
      console.error("Error fetching students:", error.message);
      throw error;
    } finally {
      setIsFullLoading(false);
    }
  }

  // حالات مؤقتة لـ Header
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [isFullLoading, setIsFullLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);


  // استخدام Hook السياق للحصول على حالة الهيدر
  const { isHeaderVisible } = useHeaderVisibility();

  // استخدام useSearchParams للحصول على معلمات البحث من URL
  const searchParams = useSearchParams();

  // دالة معالجة النقر على عناصر القائمة الجانبية
  const handleItemClick = (page: string) => (e: React.MouseEvent) => {
    e.stopPropagation(); // منع إغلاق الشريط عند النقر على عنصر داخله
    setCurrentPage(page);

    // إضافة هذا السطر لإعادة تعيين موضع التمرير إلى الأعلى
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // دالة عرض المحتوى بناءً على الصفحة الحالية
  const renderPage = () => {
    // تجميع الـ props لتمريرها للمكونات الفرعية
    const propsToPass: SubPageProps = {
      selectedChildId: selectedChildId,
      studentDetailsMap: mockStudentDetails // تمرير الكائن كاملاً
    };

    switch (currentPage) {
      case 'dashboard': return <DashboardOverview {...propsToPass} />;
      case 'home': return <ExercisesListPage {...propsToPass} />;
      case 'exams': return <ExamsPage {...propsToPass} />;
      case 'results': return <StudentResults {...propsToPass} />;
      case 'profile': return <ProfilePage {...propsToPass} />;
      case 'offers': return <OffersPage {...propsToPass} />;
      case 'settings': return <SettingsPage {...propsToPass} />;
      default: return <DashboardOverview {...propsToPass} />; // الافتراضي
    }
  };


  async function getStudentsByParent() {
    try {
      const token = Cookies.get('token');

      const response = await fetch(`http://127.0.0.1:8000/student/get-students-by-parent`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch students.");
      }

      const data = await response.json();
      setStudents(data.students); // تعيين البيانات المسترجعة
    } catch (error: any) {
      console.error("Error fetching students:", error.message);
      throw error;
    }
  }
  ///////////////////////////////////////////////////////////////////////////
  async function getStudentsById() {
    try {
      const token = Cookies.get('token');

      const response = await fetch(`http://127.0.0.1:8000/parent/get-selected-student`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch students.");
      }

      const data = await response.json();
      setSelectedChildId(data.student.id) // تعيين البيانات المسترجعة
    } catch (error: any) {
      console.error("Error fetching students:", error.message);
      throw error;
    }
  }
  ///////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    getStudentsByParent()
    getStudentsById()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // الاعتمادية الصحيحة هي [isOpen]


  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        setIsFullLoading(true);
        const authStatus = await checkAuth();
        if (authStatus.status) {
          setIsFullLoading(false);
        } else {
          setIsFullLoading(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    }
    checkUserAuth();
  }, []);

  useEffect(() => {
    // قراءة معلمة القسم من عنوان URL
    const section = searchParams.get('section');

    // إذا كانت المعلمة هي "home"، اعرض قسم قوائم التمارين
    if (section === 'home' || section === 'exercises') {
      // تعيين الصفحة الحالية إلى قوائم التمارين
      setCurrentPage('home'); // استخدام اسم الصفحة الفعلي في تطبيقك
    }
  }, [searchParams]);

  if (isFullLoading) {
    return <LoadingPage />;
  }
  return (
    <div className={styles.pageContainer}>
      {/* تمرير props المطلوبة للهيدر */}
      <Header />

      <main className={styles.dashboardContainer}>
        <div className={styles.contentWrapper}>
          {/* الشريط الجانبي مع تطبيق الكلاس الشرطي */}
          <div
            ref={sidebarRef} // ربط المرجع
            className={`
                ${styles.settingsColumn}
                ${!isOpen ? styles.collapsed : ''}
                ${!isHeaderVisible ? styles.settingsColumnHeaderHidden : ''}
             `}
            onClick={() => !isOpen && setIsOpen(true)} // النقر للفتح فقط
            title={!isOpen ? "فتح القائمة" : ""}
            role="navigation"
          >
            <div className={styles.settingsCard}>
              {/* قسم معلومات المستخدم */}
              <div className={styles.userSection}>
                <div className={styles.avatarContainer}>
                  <img src="/boy-avatar.png" alt="صورة التلميذ" className={styles.avatar} />
                </div>
                <select
                  value={selectedChildId}
                  onChange={(e) => handleChangeelectStudent(e)}
                  className={`${styles.userName} ${styles.menuText} ${!isOpen ? styles.hideText : ''}`} // استخدام hideText هنا للإخفاء
                  aria-label="اختر التلميذ"
                  disabled={childrenList.length === 0}
                  onClick={(e) => e.stopPropagation()} // منع إغلاق الشريط
                >
                  {students.length === 0 && <option value="">لا يوجد تلاميذ</option>}
                  {students.map(child => (<option key={child?.id} value={child?.id}> {child?.name} {child?.surname} </option>))}
                </select>
              </div>
              <div className={styles.divider}></div>

              {/* قسم القائمة الرئيسية */}
              <div className={styles.settingsSection}>
                <div className={`${styles.settingsItem} ${currentPage === 'dashboard' ? styles.active : ''}`} onClick={handleItemClick('dashboard')} title="لوحة التحكم" > <RxDashboard className={styles.icon} /> <span className={styles.menuText}>لوحة التحكم</span> </div>
                <div className={`${styles.settingsItem} ${currentPage === 'home' ? styles.active : ''}`} onClick={handleItemClick('home')} title="قوائم التمارين" > <RiFileListLine className={styles.icon} /> <span className={styles.menuText}>قوائم التمارين</span> </div>
                <div className={`${styles.settingsItem} ${currentPage === 'exams' ? styles.active : ''}`} onClick={handleItemClick('exams')} title="الامتحانات" > <LiaClipboardListSolid className={styles.icon} /> <span className={styles.menuText}>الامتحانات</span> </div>
                <div className={`${styles.settingsItem} ${currentPage === 'results' ? styles.active : ''}`} onClick={handleItemClick('results')} title="النتائج والاحصائيات" > <LuChartLine className={styles.icon} /> <span className={styles.menuText}>النتائج والاحصائيات</span> </div>
                <div className={`${styles.settingsItem} ${currentPage === 'profile' ? styles.active : ''}`} onClick={handleItemClick('profile')} title="الملف الشخصي" > <IoPersonOutline className={styles.icon} /> <span className={styles.menuText}>الملف الشخصي</span> </div>
                <div className={`${styles.settingsItem} ${currentPage === 'offers' ? styles.active : ''}`} onClick={handleItemClick('offers')} title="عروضنا" > <MdOutlineLocalOffer className={styles.icon} /> <span className={styles.menuText}>عروضنا</span> </div>
              </div>

              {/* قسم تسجيل الخروج والإعدادات */}
              <div className={styles.logoutWrapper}>
                <div className={styles.divider}></div>
                <div className={`${styles.settingsItem} ${currentPage === 'settings' ? styles.active : ''}`} onClick={handleItemClick('settings')} title="إعدادات الحساب" > <IoSettingsOutline className={styles.icon} /> <span className={styles.menuText}>إعدادات الحساب</span> </div>
                <div className={styles.settingsItem} onClick={() => alert('تسجيل الخروج!')} title="تسجيل الخروج" > <LuLogOut className={styles.icon} /> <span className={styles.menuText}>تسجيل الخروج</span> </div>
              </div>
            </div>
          </div>

          {/* منطقة عرض المحتوى الرئيسي للصفحة */}
          <div className={styles.mainContent}>
            {renderPage()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}