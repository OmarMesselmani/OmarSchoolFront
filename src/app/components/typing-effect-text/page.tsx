// الملف: ../typing-effect-text/page.tsx (أو TypingEffectText.tsx)

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TypingEffectTextProps {
  paragraphs: string[];
  speed?: number;
  initialDelay?: number;
  interParagraphDelay?: number;
  onTypingComplete?: () => void;
  cursorDisappearDelay?: number; // إضافة خاصية جديدة للتحكم في مدة بقاء المؤشر بعد الكتابة
}

const TypingEffectText: React.FC<TypingEffectTextProps> = ({
  paragraphs = [],
  speed = 50,
  initialDelay = 0,
  interParagraphDelay = 500,
  onTypingComplete,
  cursorDisappearDelay = 3000, // القيمة الافتراضية: 3 ثواني
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const paragraphIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null); // مرجع جديد لمؤقت اختفاء المؤشر

  // useEffect للكتابة
  useEffect(() => {
    let startTimeoutId: NodeJS.Timeout | undefined;

    // إعادة الضبط
    paragraphIndexRef.current = 0;
    charIndexRef.current = 0;
    setDisplayedText('');
    setShowCursor(false);
    if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; }
    if (cursorTimeoutRef.current) { clearTimeout(cursorTimeoutRef.current); cursorTimeoutRef.current = null; }

    // دالة الكتابة الداخلية
    const typeCharacter = () => {
      const currentPIndex = paragraphIndexRef.current;
      const currentCharIndex = charIndexRef.current;
      let isTypingFinished = false;

      if (!paragraphs || paragraphs.length === 0 || currentPIndex >= paragraphs.length) {
        isTypingFinished = true;
      } else {
        const currentParagraph = paragraphs[currentPIndex];
        if (typeof currentParagraph !== 'string') {
          isTypingFinished = true;
        } else if (currentCharIndex < currentParagraph.length) {
          setDisplayedText(prev => prev + currentParagraph[currentCharIndex]);
          charIndexRef.current++;
          timeoutIdRef.current = setTimeout(typeCharacter, speed);
        } else {
          // نهاية الفقرة
          if (currentPIndex >= paragraphs.length - 1) {
            isTypingFinished = true;
          } else {
            timeoutIdRef.current = setTimeout(() => {
              paragraphIndexRef.current++;
              charIndexRef.current = 0;
              setDisplayedText(prev => prev + '\n');
              timeoutIdRef.current = null;
              setShowCursor(true); // إظهار المؤشر للفقرة الجديدة
              typeCharacter();
            }, interParagraphDelay);
          }
        }
      }

      // التعامل مع إظهار/إخفاء المؤشر والإشعار بانتهاء الكتابة
      if (isTypingFinished) {
        // المؤشر يبقى ظاهراً لمدة محددة بعد انتهاء الكتابة
        setShowCursor(true); 
        
        // تأخير استدعاء onTypingComplete واختفاء المؤشر
        cursorTimeoutRef.current = setTimeout(() => {
          setShowCursor(false); // إخفاء المؤشر بعد التأخير
          if (onTypingComplete) {
            onTypingComplete();
          }
        }, cursorDisappearDelay);
      }
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
      if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); }
      if (cursorTimeoutRef.current) { clearTimeout(cursorTimeoutRef.current); }
    };
  }, [paragraphs, speed, initialDelay, interParagraphDelay, onTypingComplete, cursorDisappearDelay]);

  return (
    <div style={{ whiteSpace: 'pre-line', width: '100%' }}>
      {displayedText}
      {showCursor && (
        <span
          className={`
            inline-block
            w-[2px]
            h-[1em]
            bg-[#DD2946]
            mr-[2px]
            align-middle
            typing-cursor-blink
          `}
        ></span>
      )}
    </div>
  );
};

export default TypingEffectText;