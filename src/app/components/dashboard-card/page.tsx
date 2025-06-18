// المسار: src/app/components/dashboard-card/page.tsx

import React, { ReactNode, CSSProperties } from 'react';
import cardStyles from './page.module.css';
// لا نزال نحتاج overviewStyles هنا بسبب الهاشتاق في البطاقات الأخرى
import overviewStyles from '@/app/dashboard-user/pages/dashboard-overview/page.module.css';

interface DashboardCardProps {
  title?: string; // <<< التعديل: جعل العنوان اختياريًا
  children: ReactNode;
  style?: CSSProperties;
  hashtag?: string;
  className?: string;
}

export default function DashboardCard({ title, children, style, hashtag, className }: DashboardCardProps) {
  // الحصول على الألوان
  const titleBgColor = style?.['--title-bg-color'] as string | undefined;
  const cardBgColor = style?.['--card-bg-color'] as string | undefined;

  // دمج الكلاسات
  const combinedClassName = `${cardStyles.cardContainer || ''} ${className || ''}`.trim();

  // نمط الحاوية
  const containerStyle: CSSProperties = {
    ...(cardBgColor ? { backgroundColor: cardBgColor } : {}),
  };

  return (
    <div className={combinedClassName} style={containerStyle}>
      {/* عرض قسم الرأس فقط إذا تم تمرير عنوان */}
      {title && (
        <div className={cardStyles.cardHeader}>
          <h2
            className={cardStyles.cardTitle}
            style={titleBgColor ? { backgroundColor: titleBgColor } : {}}
          >
            {title}
          </h2>
          {/* عرض الهاشتاق إذا كان موجودًا */}
          {hashtag && (
            <div className={cardStyles.hashtagContainer}>
              <span className={overviewStyles.hashtag}>{hashtag}</span>
            </div>
          )}
        </div>
      )}
      {/* عرض المحتوى دائمًا */}
      <div className={cardStyles.cardContent}>
        {children}
      </div>
    </div>
  );
}