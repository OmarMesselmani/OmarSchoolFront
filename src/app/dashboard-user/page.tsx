'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RiFileListLine } from 'react-icons/ri';
import { IoSettingsOutline, IoPersonOutline } from 'react-icons/io5';
import { LuChartLine, LuLogOut } from 'react-icons/lu';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';

// --- استيراد المكونات ---
import DashboardOverview from './pages/dashboard-overview/page';
import ExercisesListPage from './pages/exercises-list/page';
import LoadingPage from '../components/loading-page/LoadingPage';
import checkAuth from '../services/check-auth';
// --- تعريف المكونات المؤقتة الأخرى أو استيرادها ---
interface StudentData { name: string; level: string; age: number; uniqueId: string; } // تعريف الواجهة هنا
interface StudentDetailsMap { [key: string]: StudentData; } // تعريف الواجهة هنا
interface PageProps { selectedChildId: string; studentDetailsMap: StudentDetailsMap; }
const StudentResults: React.FC<PageProps> = ({ selectedChildId, studentDetailsMap }) => (<div className="p-4">صفحة النتائج والاحصائيات للطالب: {selectedChildId || 'N/A'}</div>);
const ProfilePage: React.FC<PageProps> = ({ selectedChildId, studentDetailsMap }) => (<div className="p-4">الملف الشخصي للطالب: {selectedChildId || 'N/A'}</div>);
const OffersPage: React.FC<PageProps> = ({ selectedChildId, studentDetailsMap }) => (<div className="p-4">صفحة العروض</div>);
const SettingsPage: React.FC<PageProps> = ({ selectedChildId, studentDetailsMap }) => (<div className="p-4">صفحة إعدادات الحساب</div>);
// --- نهاية المكونات ---

interface Child { id: string; name: string; }

// واجهة Props للمكونات الفرعية (موحدة الآن)
interface SubPageProps {
  selectedChildId: string;
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
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const sidebarRef = useRef<HTMLDivElement>(null); // المرجع للشريط الجانبي

  const [childrenList, setChildrenList] = useState<Child[]>(mockChildren);
  const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0]?.id || '');

  // حالات مؤقتة لـ Header
  const [isFullLoading, setIsFullLoading] = useState(true);

  const handleItemClick = (page: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(page);
  };

  const renderPage = () => {
    const propsToPass: SubPageProps = {
      selectedChildId: selectedChildId,
      studentDetailsMap: mockStudentDetails
    };

    switch (currentPage) {
      case 'dashboard': return <DashboardOverview {...propsToPass} />;
      case 'home': return <ExercisesListPage {...propsToPass} />;
      case 'results': return <StudentResults {...propsToPass} />;
      case 'profile': return <ProfilePage {...propsToPass} />;
      case 'offers': return <OffersPage {...propsToPass} />;
      case 'settings': return <SettingsPage {...propsToPass} />;
      default: return <DashboardOverview {...propsToPass} />;
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false); // إغلاق الشريط
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // الاعتمادية الصحيحة هي [isOpen]

  useEffect(() => {
    if (childrenList.length > 0 && !childrenList.find(s => s.id === selectedChildId)) {
      setSelectedChildId(childrenList[0].id);
    } else if (childrenList.length === 0 && selectedChildId !== '') {
      setSelectedChildId('');
    }
  }, [childrenList, selectedChildId]);

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


  if (isFullLoading) {
    return <LoadingPage />;
  }
  return (
    <div className={styles.pageContainer}>
      <Header setIsFullLoading={setIsFullLoading} />
      <main className={styles.dashboardContainer}>
        <div className={styles.contentWrapper}>
          {/* الشريط الجانبي (تأكد من وجود ref) */}
          <div ref={sidebarRef} className={`${styles.settingsColumn} ${!isOpen ? styles.collapsed : ''}`} onClick={() => !isOpen && setIsOpen(true)} title={!isOpen ? "فتح القائمة" : ""} role="navigation" >
            <div className={styles.settingsCard}>
              {/* ... محتوى الشريط الجانبي ... */}
              <div className={styles.userSection}> <div className={styles.avatarContainer}> <img src="/male-avatar.png" alt="صورة المستخدم" className={styles.avatar} /> </div> <select value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)} className={`${styles.userName} ${styles.menuText} ${!isOpen ? styles.hideText : ''}`} aria-label="اختر التلميذ" disabled={childrenList.length === 0} onClick={(e) => e.stopPropagation()} > {childrenList.length === 0 && <option value="">لا يوجد تلاميذ</option>} {childrenList.map(child => (<option key={child.id} value={child.id}> {child.name} </option>))} </select> </div>
              <div className={styles.divider}></div>
              <div className={styles.settingsSection}> <div className={`${styles.settingsItem} ${currentPage === 'dashboard' ? styles.active : ''}`} onClick={handleItemClick('dashboard')} title="لوحة التحكم" > <RxDashboard className={styles.icon} /> <span className={styles.menuText}>لوحة التحكم</span> </div> <div className={`${styles.settingsItem} ${currentPage === 'home' ? styles.active : ''}`} onClick={handleItemClick('home')} title="قوائم التمارين" > <RiFileListLine className={styles.icon} /> <span className={styles.menuText}>قوائم التمارين</span> </div> <div className={`${styles.settingsItem} ${currentPage === 'results' ? styles.active : ''}`} onClick={handleItemClick('results')} title="النتائج والاحصائيات" > <LuChartLine className={styles.icon} /> <span className={styles.menuText}>النتائج والاحصائيات</span> </div> <div className={`${styles.settingsItem} ${currentPage === 'profile' ? styles.active : ''}`} onClick={handleItemClick('profile')} title="الملف الشخصي" > <IoPersonOutline className={styles.icon} /> <span className={styles.menuText}>الملف الشخصي</span> </div> <div className={`${styles.settingsItem} ${currentPage === 'offers' ? styles.active : ''}`} onClick={handleItemClick('offers')} title="عروضنا" > <MdOutlineLocalOffer className={styles.icon} /> <span className={styles.menuText}>عروضنا</span> </div> </div>
              <div className={styles.logoutWrapper}> <div className={styles.divider}></div> <div className={`${styles.settingsItem} ${currentPage === 'settings' ? styles.active : ''}`} onClick={handleItemClick('settings')} title="إعدادات الحساب" > <IoSettingsOutline className={styles.icon} /> <span className={styles.menuText}>إعدادات الحساب</span> </div> <div className={styles.settingsItem} onClick={() => alert('تسجيل الخروج!')} title="تسجيل الخروج" > <LuLogOut className={styles.icon} /> <span className={styles.menuText}>تسجيل الخروج</span> </div> </div>
            </div>
          </div>
          {/* منطقة عرض المحتوى */}
          <div className={styles.mainContent}>
            {renderPage()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}