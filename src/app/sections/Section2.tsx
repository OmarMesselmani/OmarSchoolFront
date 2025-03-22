"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './section2.module.css'; // استيراد ملف CSS الخاص بهذا القسم

const Section2: React.FC = () => {
  return (
    <section className={styles.aboutUsSection}>
      <h2 className={styles.sectionTitle}>ماهي عمر سكول ؟</h2>
      <div className={styles.imageContainer}>
        {/* سيتم وضع الصورة هنا لاحقًا في مجلد public/images/sections */}
        <Image
          src="/images/sections/omarSchool.png" // اسم الصورة الافتراضي - يمكنك تغييره لاحقًا
          alt="تعريف بمنصة عمر سكول"
          width={300} // يمكنك تعديل العرض حسب الحاجة
          height={300} // يمكنك تعديل الارتفاع حسب الحاجة
          className={styles.aboutUsImage}
        />
      </div>
      <p className={styles.sectionDescription}>
      عمر سكول هي منصة تعليمية إلكترونية متخصصة في دعم تلاميذ المرحلة الابتدائية. تُقدم المنصة موارد تعليمية متنوعة، تشمل ملخصات الدروس، والبحوث المدرسية، والاختبارات التفاعلية، بهدف تعزيز فهم التلاميذ وتطوير مهاراتهم الأساسية. من خلال توفير محتوى متوافق مع المناهج الرسمية، تسعى عمر سكول إلى خلق تجربة تعليمية ممتعة ومفيدة، تسهِّل على التلاميذ استيعاب المعلومات وتطبيقها بفعالية.       </p>
        <Link href="/auth/register" className={styles.startButton}>
        إبدأ الآن
        </Link>
    </section>
  );
};

export default Section2;