'use client';
import { useState, useEffect, useRef } from 'react';
import styles from '../dashboardUser/page.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AiOutlineHome } from 'react-icons/ai';
import { IoSettingsOutline, IoPersonOutline } from 'react-icons/io5';
import { LuChartLine, LuBookText, LuLogOut } from 'react-icons/lu';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { FaArrowUpLong, FaArrowDownLong, FaChartLine } from "react-icons/fa6";
import Chart from './dashboard-modules/Chart';
import HomePage from './pages/HomePage';
import StudentResults from './pages/StudentResults';

export default function DashboardUserPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (page: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'results':
        return <StudentResults />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.dashboardContainer}>
        <div className={styles.contentWrapper}>
          <div 
            ref={sidebarRef}
            className={`${styles.settingsColumn} ${!isOpen ? styles.collapsed : ''}`}
            onClick={() => !isOpen && setIsOpen(true)}
          >
            <div className={styles.settingsCard}>
              {/* قسم معلومات المستخدم */}
              <div className={styles.userSection}>
                <div className={styles.avatarContainer}>
                  <img 
                    src="/male-avatar.png" 
                    alt="صورة المستخدم" 
                    className={styles.avatar}
                  />
                </div>
                <h3 className={`${styles.userName} ${!isOpen ? styles.hideText : ''}`}>
                  اسم التلميذ
                </h3>
              </div>
              
              {/* خط فاصل */}
              <div className={styles.divider}></div>
              
              {/* قسم القائمة الرئيسية */}
              <div className={styles.settingsSection}>
                <div 
                  className={`${styles.settingsItem} ${currentPage === 'home' ? styles.active : ''}`}
                  onClick={handleItemClick('home')}
                >
                  <AiOutlineHome className={styles.icon} />
                  <span>{isOpen && 'الاستقبال'}</span>
                </div>
                
                {/* إضافة خانة نتائج التلميذ */}
                <div 
                  className={`${styles.settingsItem} ${currentPage === 'results' ? styles.active : ''}`}
                  onClick={handleItemClick('results')}
                >
                  <LuChartLine className={styles.icon} />
                  <span>{isOpen && 'نتائج التلميذ'}</span>
                </div>

                <div 
                  className={styles.settingsItem}
                  onClick={handleItemClick('profile')}
                >
                  <IoPersonOutline className={styles.icon} />
                  <span>{isOpen && 'الملف الشخصي'}</span>
                </div>
                <div className={styles.settingsItem} onClick={handleItemClick('lessons')}>
                  <LuBookText className={styles.icon} />
                  <span>{isOpen && 'جميع الدروس'}</span>
                </div>
                <div className={styles.settingsItem} onClick={handleItemClick('offers')}>
                  <MdOutlineLocalOffer className={styles.icon} />
                  <span>{isOpen && 'عروضنا'}</span>
                </div>
              </div>

              {/* قسم تسجيل الخروج والإعدادات */}
              <div className={styles.logoutWrapper}>
                <div className={styles.divider}></div>
                <div 
                  className={styles.settingsItem}
                  onClick={handleItemClick('settings')}
                >
                  <IoSettingsOutline className={styles.icon} />
                  <span>{isOpen && 'إعدادات الحساب'}</span>
                </div>
                <div 
                  className={styles.settingsItem}
                  onClick={handleItemClick('logout')}
                >
                  <LuLogOut className={styles.icon} />
                  <span>{isOpen && 'تسجيل الخروج'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
}