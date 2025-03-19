"use client";

import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Header.module.css';
import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
  dropdownItems?: { href: string; label: string }[];
}

const navLinks: NavLink[] = [
  { href: "/", label: "الرئيسية" },
  {
    href: "#years",
    label: "السنوات",
    dropdownItems: [
      { href: "#year1", label: "السنة الأولى" },
      { href: "#year2", label: "السنة الثانية" },
      { href: "#year3", label: "السنة الثالثة" },
      { href: "#year4", label: "السنة الرابعة" },
      { href: "#year5", label: "السنة الخامسة" },
      { href: "#year6", label: "السنة السادسة" }
    ]
  },
  { href: "#offers", label: "عروضنا" },
  { href: "#about", label: "من نحن؟" }
];

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null); // إضافة useRef للتأخير

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
        setIsMobileDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'unset';
  }, [isSidebarOpen]);

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setIsMobileDropdownOpen(false);
    }, 500); // تأخير 200 مللي ثانية
  };

  const renderNavLinks = (isSidebar: boolean = false) => {
    return navLinks.map((link, index) => {
      if (link.dropdownItems) {
        return (
          <li
            key={index}
            className={`${styles.dropdownContainer} ${isSidebar ? styles.sidebarLinks : ''}`}
            onMouseEnter={handleMouseEnter} // إضافة حدث mouseenter
            onMouseLeave={handleMouseLeave} // إضافة حدث mouseleave
          >
            <a
              href={link.href}
              onClick={isSidebar ? (e) => {
                e.preventDefault();
                setIsMobileDropdownOpen(!isMobileDropdownOpen);
              } : undefined}
            >
              {link.label}
              {isSidebar && (
                <span className={`${styles.dropdownArrow} ${isMobileDropdownOpen ? styles.dropdownArrowOpen : ''}`}>
                  ▼
                </span>
              )}
            </a>
            <ul className={`${styles.dropdown} ${isSidebar && isMobileDropdownOpen ? styles.dropdownOpen : ''}`}>
              {link.dropdownItems.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} onClick={handleLinkClick}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      }
      return (
        <li key={index} className={isSidebar ? styles.sidebarLinks : ''}>
          <Link href={link.href} onClick={handleLinkClick}>
            {link.label}
          </Link>
        </li>
      );
    });
  };

  const renderButtons = (isSidebar: boolean = false) => (
    <div className={`${styles.buttons} ${isSidebar ? '' : styles.desktopButtons}`}>
      <Link href="/auth/register" className={styles.createAccountLink}>
        <button className={`${styles.createAccountButton} ${isSidebar ? styles.sidebarButton : ''}`}>
          إنشاء حساب
        </button>
      </Link>
      <Link href="/auth/login" className={styles.loginLink}>
        <button className={`${styles.loginButton} ${isSidebar ? styles.sidebarButton : ''}`}>
          تسجيل الدخول
        </button>
      </Link>
    </div>
  );

  return (
    <>
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      <nav className={styles.navbar}>
        <div className={styles.headerContainer}>
          <div className={styles.toggleButton} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>

          <div className={styles.logo}>
            <img
              src="/logo.png"
              alt="Logo"
              width={150}
              height={45}
            />
          </div>

          <div className={styles.navContainer}>
            <ul className={styles.navLinks}>
              {renderNavLinks()}
            </ul>
          </div>

          {renderButtons()}
        </div>

        <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`} ref={sidebarRef}>
          <ul className={styles.navLinks}>
            {renderNavLinks(true)}
            {renderButtons(true)}
          </ul>
        </div>
      </nav>
    </>
  );
}