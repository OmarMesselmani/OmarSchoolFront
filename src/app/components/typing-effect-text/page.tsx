// الملف: ../typing-effect-text/page.tsx (أو TypingEffectText.tsx)

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// لا نستورد أي ملف CSS Module هنا لأننا نستخدم Tailwind و CSS عام

// واجهة الخصائص
interface TypingEffectTextProps {
  paragraphs: string[];
  speed?: number;
  initialDelay?: number;
  interParagraphDelay?: number;
  onTypingComplete?: () => void;
}

const TypingEffectText: React.FC<TypingEffectTextProps> = ({
  paragraphs = [],
  speed = 50,
  initialDelay = 0,
  interParagraphDelay = 500,
  onTypingComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const paragraphIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect للكتابة (المنطق الداخلي يبقى كما هو)
  useEffect(() => {
    let startTimeoutId: NodeJS.Timeout | undefined;

    // إعادة الضبط
    paragraphIndexRef.current = 0;
    charIndexRef.current = 0;
    setDisplayedText('');
    setShowCursor(false);
    if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; }

    // دالة الكتابة الداخلية
    const typeCharacter = () => {
      const currentPIndex = paragraphIndexRef.current;
      const currentCharIndex = charIndexRef.current;
      let isTypingFinished = false;
      let shouldShowCursorAfter = true;

      if (!paragraphs || paragraphs.length === 0 || currentPIndex >= paragraphs.length) {
        isTypingFinished = true; shouldShowCursorAfter = false;
      } else {
        const currentParagraph = paragraphs[currentPIndex];
        if (typeof currentParagraph !== 'string') {
           isTypingFinished = true; shouldShowCursorAfter = false;
        } else if (currentCharIndex < currentParagraph.length) {
            setDisplayedText(prev => prev + currentParagraph[currentCharIndex]);
            charIndexRef.current++;
            timeoutIdRef.current = setTimeout(typeCharacter, speed);
        } else {
            // نهاية الفقرة
            if (currentPIndex >= paragraphs.length - 1) {
                isTypingFinished = true; shouldShowCursorAfter = false;
            } else {
                shouldShowCursorAfter = false; // إخفاء أثناء التأخير
                timeoutIdRef.current = setTimeout(() => {
                    paragraphIndexRef.current++;
                    charIndexRef.current = 0;
                    setDisplayedText(prev => prev + '\n');
                    timeoutIdRef.current = null;
                    setShowCursor(true); // إظهار لبدء الفقرة الجديدة
                    typeCharacter();
                }, interParagraphDelay);
            }
        }
      }
      setShowCursor(shouldShowCursorAfter); // تحديث حالة المؤشر
      if (isTypingFinished && onTypingComplete) { onTypingComplete(); }
    }; // نهاية typeCharacter

    // بدء العملية
    if (paragraphs && paragraphs.length > 0) {
        startTimeoutId = setTimeout(() => {
            setShowCursor(true);
            typeCharacter();
        }, initialDelay);
    } else {
       setShowCursor(false);
       if (onTypingComplete) { onTypingComplete(); }
    }

    // دالة التنظيف
    return () => {
      clearTimeout(startTimeoutId);
      if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; }
    };
  }, [JSON.stringify(paragraphs), speed, initialDelay, interParagraphDelay, onTypingComplete]);


  // ===> التعديل في العرض هنا <===
  return (
    // تمت إزالة textAlign: 'center' من الـ style المضمن
    <div style={{ whiteSpace: 'pre-line', width: '100%' }}>
      {displayedText}
      {/* تطبيق كلاسات Tailwind وكلاس الأنيميشن العام للمؤشر */}
      {showCursor && (
         <span
            className={`
              inline-block
              w-[2px]
              h-[1em]
              bg-[#DD2946]  /* تأكد من استخدام اللون المناسب */
              mr-[2px]
              align-middle
              typing-cursor-blink /* اسم الكلاس للأنيميشن من CSS العام */
            `}
          ></span>
        )}
    </div>
  );
};

export default TypingEffectText;