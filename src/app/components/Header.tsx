// المسار: src/app/components/Header.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // أو 'next/router'
import styles from '../styles/Header.module.css'; // تأكد من المسار
import { IoSettingsOutline, IoNotificationsOutline, IoSearchOutline } from "react-icons/io5";
import Cookies from 'js-cookie';
import { useHeaderVisibility } from '../contexts/header-context'; // استيراد Hook السياق (عدّل المسار)
import checkAuth from '../services/check-auth';
// import checkAuth from '../services/check-auth';

interface NavLink {
  href: string;
  label: string;
  dropdownItems?: { href: string; label: string }[];
}

const navLinks: NavLink[] = [
  { href: "/", label: "الرئيسية" },
  {
    href: "#years", label: "السنوات",
    dropdownItems: [
      { href: "#year1", label: "السنة الأولى" }, { href: "#year2", label: "السنة الثانية" },
      { href: "#year3", label: "السنة الثالثة" }, { href: "#year4", label: "السنة الرابعة" },
      { href: "#year5", label: "السنة الخامسة" }, { href: "#year6", label: "السنة السادسة" }
    ]
  },
  { href: "#offers", label: "عروضنا" },
  { href: "#about", label: "من نحن؟" }
];

export default function Header() {
  // الحصول على حالة الهيدر من السياق
  const { isHeaderVisible } = useHeaderVisibility();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // حالة تسجيل الدخول

  // بقية الحالات والمراجع الخاصة بالهيدر
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  // const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true); // <- تم حذفه
  const [hasNotifications, setHasNotifications] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const lastScrollYRef = useRef<number>(0); // <- تم حذفه
  const router = useRouter();


  // useEffects (بدون useEffect الخاص بالتمرير لحساب isHeaderVisible)
  useEffect(() => { // للتحجيم
    const handleResize = () => { if (window.innerWidth > 768) { setIsSidebarOpen(false); setIsMobileDropdownOpen(false); } };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { // لمنع تمرير body
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'unset';
  }, [isSidebarOpen]);

  useEffect(() => { // للنقر خارج البحث
    const handleClickOutside = (event: MouseEvent) => { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node) && isSearchOpen) { setIsSearchOpen(false); } };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isSearchOpen]);

  useEffect(() => { // للنقر خارج الإشعارات
    const handleClickOutside = (event: MouseEvent) => { const target = event.target as Node; if (isNotificationOpen && notificationDropdownRef.current && !notificationDropdownRef.current.contains(target) && !document.querySelector(`.${styles.notificationIcon}`)?.contains(target)) { setIsNotificationOpen(false); } };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isNotificationOpen]);

  useEffect(() => { // للنقر خارج الإعدادات
    const handleClickOutside = (event: MouseEvent) => { const target = event.target as Node; if (isSettingsOpen && settingsDropdownRef.current && !settingsDropdownRef.current.contains(target) && !document.querySelector(`.${styles.settingsIcon}`)?.contains(target)) { setIsSettingsOpen(false); } };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isSettingsOpen]);


  // الدوال المساعدة
  const handleLinkClick = () => { setIsSidebarOpen(false); setIsMobileDropdownOpen(false); };
  const handleDropdownMouseEnter = (index: number) => { if (dropdownTimeoutRef.current) { clearTimeout(dropdownTimeoutRef.current); dropdownTimeoutRef.current = null; } setActiveDropdown(index); };
  const handleDropdownMouseLeave = () => { dropdownTimeoutRef.current = setTimeout(() => { setActiveDropdown(null); }, 300); };
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); console.log('Searching for:', searchQuery); };
  const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); if (!isSearchOpen) { setTimeout(() => { searchInputRef.current?.focus(); }, 100); } };
  const toggleNotificationDropdown = (e: React.MouseEvent) => { e.stopPropagation(); setIsNotificationOpen(!isNotificationOpen); };
  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = Cookies.get('token');
      const response = await fetch('http://127.0.0.1:8000/parent/sign-out', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } });
      const data = await response.json();
      if (response.ok) { Cookies.remove('token'); window.location.href = "/auth/login"; }
      else { /* Handle error */ }
    } catch (error) { console.error('Error during logout:', error); }
    // finally { setIsFullLoading(false); } // إعادة التحميل قد تكون أسرع
  };
  const handleSettingsClick = (action: string) => { if (action === 'dashboard') { router.push('/dashboard-user'); } }; // استخدام router


  // دالة عرض روابط التنقل
  const renderNavLinks = (isSidebar: boolean = false) => {
    return navLinks.map((link, index) => {
      if (link.dropdownItems) {
        return (<li key={index} className={`${styles.dropdownContainer} ${isSidebar ? styles.sidebarLinks : ''}`} onMouseEnter={() => !isSidebar && handleDropdownMouseEnter(index)} onMouseLeave={() => !isSidebar && handleDropdownMouseLeave()} > <a href={link.href} onClick={isSidebar ? (e: React.MouseEvent) => { e.preventDefault(); setIsMobileDropdownOpen(!isMobileDropdownOpen); } : undefined} > {link.label} {isSidebar && (<span className={`${styles.dropdownArrow} ${isMobileDropdownOpen ? styles.dropdownArrowOpen : ''}`}> ▼ </span>)} </a> <ul className={`${styles.dropdown} ${(isSidebar && isMobileDropdownOpen) || (!isSidebar && activeDropdown === index) ? styles.dropdownOpen : ''}`} onMouseEnter={() => !isSidebar && handleDropdownMouseEnter(index)} onMouseLeave={() => !isSidebar && handleDropdownMouseLeave()} > {link.dropdownItems.map((item, i) => (<li key={i}> <Link href={item.href} onClick={handleLinkClick}> {item.label} </Link> </li>))} </ul> </li>);
      }
      return (<li key={index} className={isSidebar ? styles.sidebarLinks : ''}> <Link href={link.href} onClick={handleLinkClick}> {link.label} </Link> </li>);
    });
  };

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const authStatus = await checkAuth();
        if (authStatus.status) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    }
    checkUserAuth();
  }, []);


  // دالة عرض أزرار المستخدم/الدخول
  const renderButtons = (isSidebar: boolean = false) => {
    if (isLoggedIn) {
      return (
        <div className={`${styles.loggedInContainer} ${isSidebar ? styles.sidebarButtons : ''}`}>
          <img src="/male-avatar.png" alt="User Avatar" className={styles.userAvatar} />
          <div className={styles.userInfo}> <span className={styles.welcomeText}>مرحبا بك</span> <span className={styles.usernamePlaceholder}>اسم المستخدم</span> </div>
          <div className={styles.userActions}>
            <div className={styles.settingsIcon}>
              <div onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(!isSettingsOpen); }}> <IoSettingsOutline size={28} /> </div>
              {isSettingsOpen && (<div className={styles.settingsDropdown} ref={settingsDropdownRef} onClick={(e) => e.stopPropagation()} > <div className={styles.settingsLink} onClick={(e) => { e.stopPropagation(); handleSettingsClick('dashboard'); setIsSettingsOpen(false); }} > لوحة التحكم </div> <hr /> <div className={styles.settingsLink} onClick={(e) => { e.stopPropagation(); handleLogout(e); setIsSettingsOpen(false); }} > تسجيل الخروج </div> </div>)}
            </div>
            <div className={styles.notificationIcon} onClick={toggleNotificationDropdown} >
              <IoNotificationsOutline size={28} /> {hasNotifications && <span className={styles.notificationDot}></span>} {isNotificationOpen && (<div className={styles.notificationDropdown} ref={notificationDropdownRef} onClick={(e) => e.stopPropagation()} > <p>الإشعار الأول...</p> <hr /> <p>الإشعار الثاني...</p> </div>)}
            </div>
          </div>
        </div>
      );
    }
    return (<div className={`${styles.buttons} ${isSidebar ? '' : styles.desktopButtons}`}> <Link href="/auth/register" className={styles.createAccountLink}> <button className={`${styles.createAccountButton} ${isSidebar ? styles.sidebarButton : ''}`}> إنشاء حساب </button> </Link> <Link href="/auth/login" className={styles.loginLink}> <button className={`${styles.loginButton} ${isSidebar ? styles.sidebarButton : ''}`}> تسجيل الدخول </button> </Link> </div>);
  };


  // JSX الرئيسي للمكون
  return (
    <>
      {isSidebarOpen && (<div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />)}
      {/* تطبيق الكلاس الشرطي هنا */}
      <nav className={`${styles.navbar} ${!isHeaderVisible ? styles.headerHidden : ''}`}>
        <div className={`${styles.headerContainer}`} data-search-open={isSearchOpen}>
          <div className={styles.toggleButton} onClick={() => setIsSidebarOpen(!isSidebarOpen)}> <div className={styles.bar}></div><div className={styles.bar}></div><div className={styles.bar}></div> </div>
          <div className={styles.logo}> <img src="/logo.png" alt="Logo" width={150} height={45} /> </div>
          <div className={styles.navContainer}> <ul className={styles.navLinks}> {renderNavLinks()} </ul> </div>
          <div className={styles.searchSection} ref={searchContainerRef}> <form onSubmit={handleSearch} className={styles.searchForm}> <button type="button" onClick={toggleSearch} className={styles.searchToggle} > <IoSearchOutline size={26} /> </button> <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث ..." className={`${styles.searchInput} ${isSearchOpen ? styles.searchInputVisible : ''}`} /> </form> </div>
          {renderButtons()}
        </div>
        <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`} ref={sidebarRef}> <ul className={styles.navLinks}> {renderNavLinks(true)} {renderButtons(true)} </ul> </div>
      </nav>
    </>
  );
}