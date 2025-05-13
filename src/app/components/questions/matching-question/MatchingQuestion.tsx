// ./app/components/questions/matching-question/MatchingQuestion.tsx
'use client';

// استيراد المكتبات والمكونات اللازمة
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
import styles from './matching-question.module.css'; 

// تعريف واجهات البيانات الداخلية للمكون
interface Connection {
  start: string;
  end: string;
}

interface Position {
  x: number;
  y: number;
}

// تعريف واجهة الخصائص (Props) التي سيستقبلها المكون
interface ItemData {
    id: string;
    text: string;
}

interface ImageData {
    id: string;
    url: string;
}

interface MatchingQuestionProps {
  items: ItemData[];
  images: ImageData[];
  // يمكنك إضافة props أخرى هنا إذا احتجت، مثل دالة لإرسال الإجابة النهائية
  // أو دوال للتحكم في Undo/Reset من الخارج إذا أردت
}

// تعريف مكون السؤال من نوع الربط
export default function MatchingQuestion({ items, images }: MatchingQuestionProps) {
  // --- الحالة الداخلية للمكون ---
  const [connections, setConnections] = useState<Connection[]>([]);
  const [startPoint, setStartPoint] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Position | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- الدوال المساعدة ومعالجات الأحداث (تم نقلها من الصفحة الأصلية) ---
  const getTextPointId = (itemId: string) => `point-text-${itemId}`;
  const getImagePointId = (imageId: string) => `point-image-${imageId}`;

  // دالة إلغاء عملية التوصيل الحالية
  const cancelConnection = useCallback(() => {
    setStartPoint(null);
    setMousePos(null);
    console.log("تم إلغاء التوصيل.");
  }, []);

  // --- الدوال الخاصة بـ Undo/Reset ---
  // ملاحظة: هذه الدوال حاليًا تعمل محليًا. إذا أردت التحكم بها
  // من الأزرار الموجودة في ExerciseLayout، ستحتاج لتمرير دوال تحكم كـ props
  // أو استخدام ref للوصول لهذه الدوال من المكون الأب.
  const handleUndo = useCallback(() => {
    setConnections(prevConnections => {
      if (prevConnections.length > 0) {
        return prevConnections.slice(0, -1);
      }
      return prevConnections;
    });
    if (startPoint) {
      cancelConnection();
    }
  }, [startPoint, cancelConnection]);

  const handleReset = useCallback(() => {
    setConnections([]);
    if (startPoint) {
      cancelConnection();
    }
  }, [startPoint, cancelConnection]);

  // --- معالجات أحداث الفأرة للتوصيل ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startPoint || !containerRef.current) {
      if (mousePos !== null) setMousePos(null);
      return;
    };
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const handlePointClick = (e: React.MouseEvent, pointId: string) => {
    e.stopPropagation();

    if (!startPoint) {
      if (connections.some(conn => conn.start === pointId || conn.end === pointId)) {
        console.log("النقطة متصلة بالفعل.");
        return;
      }
      setStartPoint(pointId);
    } else {
      if (startPoint === pointId) {
        cancelConnection();
        return;
      }

      const isStartText = startPoint.startsWith('point-text-');
      const isCurrentText = pointId.startsWith('point-text-');
      const isStartImage = startPoint.startsWith('point-image-');
      const isCurrentImage = pointId.startsWith('point-image-');

      if ((isStartText && isCurrentText) || (isStartImage && isCurrentImage)) {
        console.log("لا يمكن توصيل نقاط من نفس النوع.");
        cancelConnection();
        return;
      }

      if (connections.some(conn => conn.start === pointId || conn.end === pointId)) {
        console.log("النقطة الهدف متصلة بالفعل.");
        cancelConnection();
        return;
      }

      let textPointId = '';
      let imagePointId = '';
      if (isStartText && isCurrentImage) {
        textPointId = startPoint;
        imagePointId = pointId;
      } else if (isStartImage && isCurrentText) {
        textPointId = pointId;
        imagePointId = startPoint;
      } else {
        console.error("خطأ في تحديد نوع نقاط التوصيل");
        cancelConnection();
        return;
      }

      setConnections(prevConnections => [...prevConnections, { start: textPointId, end: imagePointId }]);
      setStartPoint(null);
      setMousePos(null);
    }
  };

  const handleContainerClick = () => {
    if (startPoint) {
      cancelConnection();
    }
  };

  // --- التأثيرات الجانبية (Side Effects) ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && startPoint) {
        cancelConnection();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [startPoint, cancelConnection]);

  // --- دوال مساعدة أخرى ---
  const getImageAltText = (imageId: string): string => {
      const matchedImage = images.find(img => img.id === imageId);
      if (matchedImage) return `صورة توضيحية مرتبطة بـ ${matchedImage.id}`; // يمكنك تحسين النص البديل
      return 'صورة توضيحية';
  };

  // --- بنية الـ JSX للعرض ---
  return (
    <Xwrapper>
      {/* === هذا هو الـ div الذي تم تعديل الـ className فيه === */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleContainerClick}
        className={`${styles.xarrowContainer} relative`} // <-- تم التعديل هنا
      >
        {/* حاوية التنسيق الداخلي للنصوص والصور */}
        {/* يمكنك استخدام كلاسات Tailwind هنا أو استخدام styles.questionContentWrapper من ملف CSS */}
        <div className="flex h-full items-start justify-between">
          {/* عرض النصوص */}
          <div className="space-y-6 flex flex-col justify-around h-full min-h-[300px]">
            {items.map((item) => {
              const pointId = getTextPointId(item.id);
              const isSelected = startPoint === pointId;
              const isConnected = connections.some(conn => conn.start === pointId);
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 ${!isConnected ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={(e) => !isConnected && handlePointClick(e, pointId)}
                >
                  <span
                    className="text-2xl" // يمكنك تخصيص هذه الكلاسات
                    style={{ fontFamily: "'Scheherazade New', serif" }}
                  >
                    {item.text}
                  </span>
                  <div
                    id={pointId}
                    className={`w-3 h-3 rounded-full transition-colors ${isConnected ? 'bg-gray-400' : isSelected ? 'bg-blue-500 ring-2 ring-offset-2 ring-blue-500' : 'bg-[#DD2946]'}`}
                    title={isConnected ? `"${item.text}" متصلة بالفعل` : `اربط من: ${item.text}`}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* عرض الصور */}
          <div className="space-y-6 flex flex-col justify-around h-full min-h-[300px]">
            {images.map((image) => {
              const pointId = getImagePointId(image.id);
              const isSelected = startPoint === pointId;
              const isConnected = connections.some(conn => conn.end === pointId);
              return (
                <div
                  key={image.id}
                  className={`flex items-center gap-4 ${!isConnected ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={(e) => !isConnected && handlePointClick(e, pointId)}
                >
                  <div
                    id={pointId}
                    className={`w-3 h-3 rounded-full transition-colors ${isConnected ? 'bg-gray-400' : isSelected ? 'bg-blue-500 ring-2 ring-offset-2 ring-blue-500' : 'bg-[#DD2946]'}`}
                    title={isConnected ? `الصورة متصلة بالفعل` : `اربط إلى الصورة`}
                  ></div>
                  <div
                    className="rounded-lg flex items-center justify-center w-[120px] h-[120px] overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={getImageAltText(image.id)}
                      className="object-cover w-full h-full"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/120x120/EEE/31343C?text=Error'; }}
                      width={120}
                      height={120}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* عنصر وهمي لتتبع الفأرة ورسم الخط المؤقت */}
      {mousePos && startPoint && (
        <div
          id="temp-mouse-target"
          style={{ position: 'absolute', top: `${mousePos.y}px`, left: `${mousePos.x}px`, width: '1px', height: '1px', pointerEvents: 'none' }}
        />
      )}

      {/* رسم خطوط التوصيل النهائية */}
      {connections.map((conn, index) => (
        <Xarrow
          key={`conn-${conn.start}-${conn.end}-${index}`}
          start={conn.start} end={conn.end}
          color="#171717" strokeWidth={2} headSize={6}
          path="straight" showHead={true}
          SVGcanvasProps={{ style: { zIndex: 1 } }} // مثال لمحاولة رفع السهم فوق العناصر الأخرى
        />
      ))}

      {/* رسم الخط المؤقت أثناء السحب */}
      {startPoint && mousePos && (
        <Xarrow
          key="temp-arrow"
          start={startPoint} end="temp-mouse-target"
          color="#171717" strokeWidth={2} headSize={0}
          path="straight" showHead={false} dashness={true}
          passProps={{ pointerEvents: "none" }}
          SVGcanvasProps={{ style: { zIndex: 1 } }} // مثال لمحاولة رفع السهم فوق العناصر الأخرى
        />
      )}
    </Xwrapper>
  );
}