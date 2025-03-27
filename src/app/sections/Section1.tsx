"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './section1.module.css';

// تحديد نوع الشريحة
interface Slide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
}

const Slider01: React.FC = () => {
  const slides: Slide[] = [
    {
      id: 1,
      title: "امتحانات وتقاييم",
      description: "تُوفر منصتنا مجموعة شاملة من الاختبارات والتقاييم المتنوعة المطابقة للبرامج الرسمية، مما يمكّن التلميذ من الاستعداد الأمثل للامتحانات.",
      buttonText: "عرض المزيد",
      buttonLink: "/education",
      imageUrl: "/images/sections/slider01.jpg"
    },
    {
      id: 2,
      title: "بحوث مدرسيّة",
      description: "اكتشف مجموعتنا المتميزة من البحوث المدرسية التي تُسهم في تنمية معلومات الطفل وإثراء مداركه.",
      buttonText: "اكتشف المزيد",
      buttonLink: "/primary",
      imageUrl: "/images/sections/slider02.jpg"
    },
    {
      id: 3,
      title: "ملخصات الدروس",
      description: "اكتشف ملخصات الدروس المصممة خصيصًا لتبسيط النقاط الأساسية وتقديم مراجعة شاملة للمادة، مما يُسهم في تعزيز الفهم وتثبيت المعلومات بأسلوب مبتكر وميسر.",
      buttonText: "استكشاف",
      buttonLink: "/online",
      imageUrl: "/images/sections/slider03.jpg"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // وظيفة للانتقال إلى الشريحة التالية
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

      // إعادة تعيين حالة الانتقال بعد اكتمال الحركة
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  };

  // وظيفة للانتقال إلى الشريحة السابقة
  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

      // إعادة تعيين حالة الانتقال بعد اكتمال الحركة
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  };

  // وظيفة التشغيل التلقائي
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.mainSlider}>
      <div className={styles.sliderContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          >
            <div className={styles.slideContent}>
              <h1 className={styles.slideTitle}>{slide.title}</h1>
              <p className={styles.slideDescription}>{slide.description}</p>
              <Link href={slide.buttonLink} className={styles.slideButton}>
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button className={`${styles.sliderNav} ${styles.prevButton}`} onClick={prevSlide} aria-label="الشريحة السابقة">
        &lt;
      </button>

      <button className={`${styles.sliderNav} ${styles.nextButton}`} onClick={nextSlide} aria-label="الشريحة التالية">
        &gt;
      </button>
    </section>
  );
};

export default Slider01;