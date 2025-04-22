// المسار: src/app/contexts/header-context.tsx

'use client'; // ضروري لاستخدام Hooks

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

// واجهة لنوع بيانات السياق
interface HeaderContextType {
  isHeaderVisible: boolean;
}

// إنشاء السياق بقيمة افتراضية أولية
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// إنشاء المكون Provider الذي سيغلف التطبيق أو جزء منه
export function HeaderProvider({ children }: { children: ReactNode }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // يبدأ ظاهراً
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 50; // مسافة التمرير لتشغيل الإخفاء/الإظهار
      const hideThreshold = 100; // مسافة التمرير للأسفل قبل البدء بالإخفاء

      if (Math.abs(currentScrollY - lastScrollYRef.current) > threshold || currentScrollY <= hideThreshold) {
        if (currentScrollY > lastScrollYRef.current && currentScrollY > hideThreshold) {
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollYRef.current || currentScrollY <= hideThreshold ) {
           setIsHeaderVisible(true);
        }
        lastScrollYRef.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // لا توجد اعتماديات لأننا نستخدم ref

  // تمرير الحالة عبر Provider
  return (
    <HeaderContext.Provider value={{ isHeaderVisible }}>
      {children}
    </HeaderContext.Provider>
  );
}

// إنشاء Hook مخصص ليسهل استخدام السياق في المكونات الأخرى
export function useHeaderVisibility() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeaderVisibility must be used within a HeaderProvider');
  }
  return context;
}