// المسار: src/app/components/typing-effect-text/page.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/app/dashboardUser/pages/DashboardOverview/page.module.css'; // أو ملف الستايل الخاص به

interface TypingEffectTextProps {
  paragraphs: string[];
  speed?: number;
  initialDelay?: number;
  interParagraphDelay?: number; // تأخير بين الفقرات
}

const TypingEffectText: React.FC<TypingEffectTextProps> = ({
  paragraphs = [],
  speed = 45, // يمكن تعديل السرعة حسب الرغبة
  initialDelay = 500,
  interParagraphDelay = 5000, // <-- تأخير 5 ثواني
}) => {
  // حالة لتخزين نص الفقرة الظاهرة حالياً
  const [currentVisibleText, setCurrentVisibleText] = useState('');
  // حالة لتتبع مؤشر الفقرة التي يجب عرضها
  const [visibleParagraphIndex, setVisibleParagraphIndex] = useState(0);
  // حالة لإظهار/إخفاء المؤشر
  const [showCursor, setShowCursor] = useState(false);

  // Refs لتخزين القيم الحالية وتجنب مشاكل الإغلاق (closures) في setTimeout
  const paragraphIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // إعادة الضبط عند تغيير المدخلات
    setVisibleParagraphIndex(0);
    setCurrentVisibleText('');
    setShowCursor(false);
    paragraphIndexRef.current = 0;
    charIndexRef.current = 0;
    // إلغاء أي مؤقت سابق
    if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
    }

    const typeCharacter = () => {
      const currentPIndex = paragraphIndexRef.current;

      // التوقف إذا تجاوزنا عدد الفقرات
      if (currentPIndex >= paragraphs.length) {
        setShowCursor(false);
        return;
      }

      // التأكد من أننا نعرض الفقرة الصحيحة
      if (visibleParagraphIndex !== currentPIndex) {
         setVisibleParagraphIndex(currentPIndex);
      }

      const currentFullParagraph = paragraphs[currentPIndex];
      const currentCharIndex = charIndexRef.current;

      // التحقق إذا كنا لا نزال نكتب في الفقرة الحالية
      if (currentCharIndex < currentFullParagraph.length) {
        // تحديث النص الظاهر بإضافة الحرف التالي
        setCurrentVisibleText(currentFullParagraph.substring(0, currentCharIndex + 1));
        charIndexRef.current++;
        // جدولة الحرف التالي
        timeoutIdRef.current = setTimeout(typeCharacter, speed);
      } else {
        // انتهت كتابة الفقرة الحالية
        // التحقق إذا كانت هذه آخر فقرة
        if (currentPIndex < paragraphs.length - 1) {
          // ليست الأخيرة، انتظر التأخير المحدد ثم انتقل للتالية
          timeoutIdRef.current = setTimeout(() => {
            paragraphIndexRef.current++; // الانتقال للفقرة التالية
            charIndexRef.current = 0;     // إعادة مؤشر الحرف للصفر
            setCurrentVisibleText('');    // مسح النص استعداداً للفقرة الجديدة
            setShowCursor(true);          // إظهار المؤشر للفقرة الجديدة
            typeCharacter();              // بدء كتابة الفقرة الجديدة
          }, interParagraphDelay);
          // إخفاء المؤشر أثناء فترة الانتظار الطويلة
          setShowCursor(false);
        } else {
          // هذه كانت آخر فقرة، أبقِ النص ظاهراً وأخفِ المؤشر
          setShowCursor(false);
        }
      }
    };

    // بدء العملية بعد التأخير الأولي
    const startTimeoutId = setTimeout(() => {
      setShowCursor(true); // إظهار المؤشر للفقرة الأولى
      setVisibleParagraphIndex(0); // التأكد من البدء بالمؤشر 0
      typeCharacter();
    }, initialDelay);

    // دالة التنظيف
    return () => {
      clearTimeout(startTimeoutId);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [paragraphs, speed, initialDelay, interParagraphDelay]); // الاعتماديات

  return (
    // عرض فقرة واحدة فقط في كل مرة
    // الحاوية الأم (.welcomeCardContent) يجب أن يكون لها ارتفاع محدد أو min-height
    // لمنع قفز التخطيط عند تغيير طول الفقرة
    <div>
      {/* عرض الفقرة الحالية فقط */}
      {paragraphs.map((_, index) => (
         <p key={index} style={{ display: index === visibleParagraphIndex ? 'block' : 'none' }}>
            {index === visibleParagraphIndex ? currentVisibleText : ''}
            {showCursor && index === visibleParagraphIndex && <span className={styles.typingCursor}></span>}
         </p>
      ))}
      {/* قد تحتاج لإضافة عناصر p فارغة بنفس عدد الفقرات مع visibility: hidden
          إذا أردت الحفاظ على الارتفاع ثابتاً بشكل مضمون، لكن overflow-y: auto
          في الحاوية الأم هو الحل الأبسط غالباً. */}
    </div>
  );
};

export default TypingEffectText;