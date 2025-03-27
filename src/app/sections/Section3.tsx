"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './section3.module.css';

interface Article {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
}

const Section3: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('latest');
  const [visibleArticlesCount, setVisibleArticlesCount] = useState(8); // عرض أول 8 مقالات افتراضيًا
  const allArticles: Article= [
    { id: 1, title: "مقال جديد حول الذكاء الاصطناعي في التعليم", category: "تكنولوجيا التعليم", excerpt: "اكتشف كيف يمكن للذكاء الاصطناعي أن يُحدث ثورة في طرق التدريس والتعلم...", imageUrl: "/images/sections/latest1.jpg" },
    { id: 2, title: "دليل شامل لتحسين مهارات الكتابة الأكاديمية", category: "مهارات الدراسة", excerpt: "تعلم أفضل الاستراتيجيات والتقنيات لتطوير قدراتك في كتابة الأبحاث والمقالات...", imageUrl: "/images/sections/latest2.jpg" },
    { id: 3, title: "نصائح عملية لطلاب المرحلة الثانوية للاستعداد للامتحانات", category: "نصائح للطلاب", excerpt: "احصل على إرشادات قيمة حول كيفية تنظيم الوقت والمذاكرة بفعالية...", imageUrl: "/images/sections/latest3.jpg" },
    { id: 4, title: "مقال إضافي حول أهمية القراءة في تطوير الذات", category: "تطوير الذات", excerpt: "استكشف كيف يمكن للقراءة المنتظمة أن تُثري حياتك وتُوسع آفاقك...", imageUrl: "/images/sections/latest4.jpg" },
    { id: 5, title: "أحدث الاتجاهات في تصميم مواقع الويب التعليمية", category: "تكنولوجيا الويب", excerpt: "تعرف على أحدث التقنيات والأدوات المستخدمة في تصميم تجارب تعليمية ممتعة...", imageUrl: "/images/sections/latest5.jpg" },
    { id: 6, title: "نصائح عملية لطلاب المرحلة الثانوية للاستعداد للامتحانات", category: "نصائح للطلاب", excerpt: "احصل على إرشادات قيمة حول كيفية تنظيم الوقت والمذاكرة بفعالية...", imageUrl: "/images/sections/latest3.jpg" },
    { id: 7, title: "مقال إضافي حول أهمية القراءة في تطوير الذات", category: "تطوير الذات", excerpt: "استكشف كيف يمكن للقراءة المنتظمة أن تُثري حياتك وتُوسع آفاقك...", imageUrl: "/images/sections/latest4.jpg" },
    { id: 8, title: "أحدث الاتجاهات في تصميم مواقع الويب التعليمية", category: "تكنولوجيا الويب", excerpt: "تعرف على أحدث التقنيات والأدوات المستخدمة في تصميم تجارب تعليمية ممتعة...", imageUrl: "/images/sections/latest5.jpg" },
  ];

  const getSectionTitle = () => {
    switch (activeFilter) {
      case 'latest':
        return 'أحدث الإضافات';
      case 'mostViewed':
        return 'الأكثر مشاهدة';
      case 'topRated':
        return 'الأعلى تقييما';
      default:
        return 'أحدث الإضافات';
    }
  };

  const filteredArticles = allArticles
    .filter(article => {
      // يمكنك إضافة منطق الفلترة هنا بناءً على activeFilter
      return true;
    })
    .slice(0, visibleArticlesCount);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setVisibleArticlesCount(8); // إعادة تعيين عدد المقالات المعروضة إلى 8 عند تغيير الفلتر (في وضع الحاسوب)
    // هنا يمكنك إضافة منطق لجلب بيانات مختلفة بناءً على الفلتر المحدد
  };

  const handleViewMoreClick = () => {
    setVisibleArticlesCount(prevCount => Math.min(prevCount + 8, allArticles.length)); // عرض 8 مقالات إضافية في كل مرة (في وضع الحاسوب)
  };

  const showViewMoreButton = visibleArticlesCount < allArticles.length;

  return (
    <section className={styles.latestAdditionsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{getSectionTitle()}</h2> {/* استخدام الدالة للحصول على العنوان */}
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${activeFilter === 'latest' ? styles.active : ''}`}
            onClick={() => handleFilterClick('latest')}
          >
            أحدث الإضافات
          </button>
          <button
            className={`${styles.filterButton} ${activeFilter === 'mostViewed' ? styles.active : ''}`}
            onClick={() => handleFilterClick('mostViewed')}
          >
            الأكثر مشاهدة
          </button>
          <button
            className={`${styles.filterButton} ${activeFilter === 'topRated' ? styles.active : ''}`}
            onClick={() => handleFilterClick('topRated')}
          >
            الأعلى تقييما
          </button>
        </div>
      </div>

      <div className={styles.articlesGrid}>
        {filteredArticles.map((article) => (
          <div key={article.id} className={styles.articleCard}>
            <div className={styles.articleImage}>
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={300}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3 className={styles.articleTitle}>{article.title}</h3>
            <p className={styles.articleCategory}>{article.category}</p>
            <p className={styles.articleExcerpt}>{article.excerpt.substring(0, 100)}...</p>
          </div>
        ))}
      </div>

      {showViewMoreButton && (
        <button className={styles.viewMoreButton} onClick={handleViewMoreClick}>
          مشاهدة المزيد
        </button>
      )}
    </section>
  );
};

export default Section3;