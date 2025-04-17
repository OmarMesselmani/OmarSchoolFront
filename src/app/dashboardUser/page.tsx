// المسار: src/app/dashboardUser/page.tsx (أو المسار الصحيح لهذا الملف)

'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css'; // تأكد من وجود ملف CSS المرافق
import Header from '../components/Header'; // تأكد من صحة المسار
import Footer from '../components/Footer'; // تأكد من صحة المسار
import { RiFileListLine } from 'react-icons/ri';
import { IoSettingsOutline, IoPersonOutline } from 'react-icons/io5';
import { LuChartLine, LuLogOut } from 'react-icons/lu';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';

// --- استيراد مكونات الصفحات الفرعية ---
import DashboardOverview from './pages/DashboardOverview/page'; // تأكد من صحة المسار
// --- يمكنك استيراد بقية المكونات هنا إذا كانت في ملفات منفصلة ---
// import HomePage from './pages/HomePage/page'; // كمثال
// import StudentResults from './pages/StudentResults/page'; // كمثال
// ------------------------------------

interface Child {
    id: string;
    name: string;
}

interface PageProps {
    selectedChildId: string;
}

// --- تعريف المكونات المؤقتة (أو استوردها من ملفاتها) ---
const HomePage: React.FC<PageProps> = ({ selectedChildId }) => (
    <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">الصفحة الرئيسية / قائمة التمارين</h2>
        <p>عرض التمارين المتاحة للطفل المحدد: {selectedChildId || 'لم يتم تحديد طفل'}</p>
        {/* محتوى صفحة التمارين */}
    </div>
);
const StudentResults: React.FC<PageProps> = ({ selectedChildId }) => (
     <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">النتائج والاحصائيات</h2>
        <p>عرض نتائج الطفل المحدد: {selectedChildId || 'لم يتم تحديد طفل'}</p>
        {/* محتوى صفحة النتائج */}
     </div>
);
// --- يمكنك تعريف أو استيراد ProfilePage, OffersPage, SettingsPage بنفس الطريقة ---
const ProfilePage: React.FC<PageProps> = ({ selectedChildId }) => ( <div className="p-4">الملف الشخصي للطالب: {selectedChildId || 'N/A'}</div> );
const OffersPage: React.FC<PageProps> = ({ selectedChildId }) => ( <div className="p-4">صفحة العروض</div> );
const SettingsPage: React.FC<PageProps> = ({ selectedChildId }) => ( <div className="p-4">صفحة إعدادات الحساب</div> );
// --- نهاية تعريف المكونات ---


export default function DashboardUserPage() {
  // === تعديل: جعل الشريط مغلقاً افتراضياً ===
  const [isOpen, setIsOpen] = useState(false); // <-- تغيير إلى false
  // === تعديل: جعل لوحة التحكم هي الصفحة الافتراضية ===
  const [currentPage, setCurrentPage] = useState('dashboard'); // <-- تغيير إلى 'dashboard'
  // === نهاية التعديلات ===

  const sidebarRef = useRef<HTMLDivElement>(null);

  const mockChildren: Child[] = [
      { id: 'child1', name: 'التلميذ الأول' },
      { id: 'child2', name: 'التلميذ الثاني' },
      { id: 'child3', name: 'التلميذ الثالث' }
  ];
  const [childrenList, setChildrenList] = useState<Child[]>(mockChildren);
  const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0]?.id || '');

  const handleItemClick = (page: string) => (e: React.MouseEvent) => {
    e.stopPropagation(); // لمنع إغلاق الشريط عند النقر على عنصر داخله
    setCurrentPage(page);
    // اختياري: إغلاق الشريط عند اختيار صفحة على الشاشات الصغيرة
    // if (window.innerWidth < 768) { setIsOpen(false); }
  };

  // دالة لعرض المحتوى بناءً على الصفحة الحالية
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview selectedChildId={selectedChildId} />;
      case 'home': // تمارين
        return <HomePage selectedChildId={selectedChildId} />;
      case 'results':
        return <StudentResults selectedChildId={selectedChildId} />;
      case 'profile':
         return <ProfilePage selectedChildId={selectedChildId} />; // استبدل بالمكون الفعلي
      case 'offers':
          return <OffersPage selectedChildId={selectedChildId} />; // استبدل بالمكون الفعلي
      case 'settings':
          return <SettingsPage selectedChildId={selectedChildId} />; // استبدل بالمكون الفعلي
      default:
        // العودة للوحة التحكم كافتراضي إذا كانت الصفحة غير معروفة
        return <DashboardOverview selectedChildId={selectedChildId} />;
    }
  };

  // تأثير لإغلاق الشريط الجانبي عند النقر خارجه (يبقى كما هو)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // تحديث الطالب المختار (يبقى كما هو)
  useEffect(() => {
      if (childrenList.length > 0 && !childrenList.find(s => s.id === selectedChildId)) {
          setSelectedChildId(childrenList[0].id);
      } else if (childrenList.length === 0 && selectedChildId !== '') {
          setSelectedChildId('');
      }
  }, [childrenList, selectedChildId]);


  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.dashboardContainer}>
        <div className={styles.contentWrapper}>
          {/* الشريط الجانبي القابل للطي */}
          <div
            ref={sidebarRef}
            className={`${styles.settingsColumn} ${!isOpen ? styles.collapsed : ''}`}
            // تعديل: النقر على الشريط المغلق يفتحه
            onClick={() => !isOpen && setIsOpen(true)}
            title={!isOpen ? "فتح القائمة" : ""} // تعديل النص التلميحي
            role="navigation"
          >
            <div className={styles.settingsCard}>
              {/* قسم معلومات المستخدم */}
              <div className={styles.userSection}>
                <div className={styles.avatarContainer}>
                  <img src="/male-avatar.png" alt="صورة المستخدم" className={styles.avatar} />
                </div>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  // تعديل: استخدام كلاس menuText أيضاً للإخفاء المتناسق
                  className={`${styles.userName} ${styles.menuText} ${!isOpen ? styles.hideText : ''}`}
                  aria-label="اختر التلميذ"
                  disabled={childrenList.length === 0}
                  // منع إغلاق الشريط عند النقر على القائمة المنسدلة
                  onClick={(e) => e.stopPropagation()}
                >
                  {childrenList.length === 0 && <option value="">لا يوجد تلاميذ</option>}
                  {childrenList.map(child => ( <option key={child.id} value={child.id}> {child.name} </option> ))}
                </select>
              </div>

              <div className={styles.divider}></div>

              {/* قسم القائمة الرئيسية */}
              <div className={styles.settingsSection}>
                 {/* لوحة التحكم */}
                 <div className={`${styles.settingsItem} ${currentPage === 'dashboard' ? styles.active : ''}`} onClick={handleItemClick('dashboard')} title="لوحة التحكم" > <RxDashboard className={styles.icon} /> <span className={styles.menuText}>لوحة التحكم</span> </div>
                 {/* قوائم التمارين */}
                 <div className={`${styles.settingsItem} ${currentPage === 'home' ? styles.active : ''}`} onClick={handleItemClick('home')} title="قوائم التمارين" > <RiFileListLine className={styles.icon} /> <span className={styles.menuText}>قوائم التمارين</span> </div>
                 {/* النتائج والاحصائيات */}
                 <div className={`${styles.settingsItem} ${currentPage === 'results' ? styles.active : ''}`} onClick={handleItemClick('results')} title="النتائج والاحصائيات" > <LuChartLine className={styles.icon} /> <span className={styles.menuText}>النتائج والاحصائيات</span> </div>
                 {/* الملف الشخصي */}
                 <div className={`${styles.settingsItem} ${currentPage === 'profile' ? styles.active : ''}`} onClick={handleItemClick('profile')} title="الملف الشخصي" > <IoPersonOutline className={styles.icon} /> <span className={styles.menuText}>الملف الشخصي</span> </div>
                 {/* عروضنا */}
                 <div className={`${styles.settingsItem} ${currentPage === 'offers' ? styles.active : ''}`} onClick={handleItemClick('offers')} title="عروضنا" > <MdOutlineLocalOffer className={styles.icon} /> <span className={styles.menuText}>عروضنا</span> </div>
              </div>

              {/* قسم تسجيل الخروج والإعدادات */}
              <div className={styles.logoutWrapper}>
                <div className={styles.divider}></div>
                 {/* إعدادات الحساب */}
                 <div className={`${styles.settingsItem} ${currentPage === 'settings' ? styles.active : ''}`} onClick={handleItemClick('settings')} title="إعدادات الحساب" > <IoSettingsOutline className={styles.icon} /> <span className={styles.menuText}>إعدادات الحساب</span> </div>
                 {/* تسجيل الخروج */}
                 <div className={styles.settingsItem} onClick={() => alert('تسجيل الخروج!')} title="تسجيل الخروج" > <LuLogOut className={styles.icon} /> <span className={styles.menuText}>تسجيل الخروج</span> </div>
              </div>
            </div>
          </div>

          {/* منطقة عرض المحتوى الرئيسي للصفحة */}
          <div className={styles.mainContent}>
              {renderPage()} {/* عرض المكون المناسب */}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}