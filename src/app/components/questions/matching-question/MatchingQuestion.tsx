'use client';

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
}

export default function MatchingQuestion({ items, images }: MatchingQuestionProps) {
  // --- الحالة الداخلية للمكون ---
  const [connections, setConnections] = useState<Connection[]>([]);
  const [startPoint, setStartPoint] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Position | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- الدوال المساعدة ومعالجات الأحداث ---
  const getTextPointId = (itemId: string) => `point-text-${itemId}`;
  const getImagePointId = (imageId: string) => `point-image-${imageId}`;

  const cancelConnection = useCallback(() => {
    setStartPoint(null);
    setMousePos(null);
    console.log("تم إلغاء التوصيل.");
  }, []);

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
      
      // تحديد النقطة الصحيحة للبداية والنهاية
      const finalStart = isStartText ? startPoint : pointId;
      const finalEnd = isCurrentImage ? pointId : startPoint;
      
      setConnections(prevConnections => [...prevConnections, { start: finalStart, end: finalEnd }]);
      setStartPoint(null);
      setMousePos(null);
    }
  };

  const handleContainerClick = () => {
    if (startPoint) {
      cancelConnection();
    }
  };

  // --- التأثيرات الجانبية ---
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

  // تنظيف عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      setConnections([]);
      setStartPoint(null);
      setMousePos(null);
    };
  }, []);

  const getImageAltText = (imageId: string): string => {
    if (imageId === 'img1') return 'صورة تلميذ';
    if (imageId === 'img2') return 'صورة تلميذة';
    if (imageId === 'img3') return 'صورة تلاميذ';
    return 'صورة توضيحية';
  };

  // --- بنية الـ JSX للعرض ---
  return (
    <Xwrapper>
      <div className={styles.questionContainer}>
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleContainerClick}
          className={styles.mainContent}
        >
          <div className={styles.exerciseArea}>
            <div className={styles.questionTitle}>
              <span className={styles.questionNumber}>
                1
              </span>
              <span className={styles.questionText}>
                أَرْبُطُ كُلَّ جُمْلَةٍ بِٱلصُّورَةِ ٱلْمُنَاسِبَةِ
              </span>
            </div>

            <div className={styles.matchingArea}>
              {/* عرض النصوص */}
              <div className={styles.textsList}>
                {items.map((item) => {
                  const pointId = getTextPointId(item.id);
                  const isSelected = startPoint === pointId;
                  const isConnected = connections.some(conn => conn.start === pointId || conn.end === pointId);
                  return (
                    <div
                      key={item.id}
                      className={`${styles.textItem} ${!isConnected ? styles.clickable : ''}`}
                      onClick={(e) => !isConnected && handlePointClick(e, pointId)}
                    >
                      <span className={styles.textContent}>
                        {item.text}
                      </span>
                      <div
                        id={pointId}
                        className={`${styles.connectionPoint} ${
                          isConnected 
                            ? styles.connected
                            : isSelected 
                              ? styles.selected
                              : styles.default
                        }`}
                        title={isConnected ? `"${item.text}" متصلة بالفعل` : `اربط من: ${item.text}`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* عرض الصور */}
              <div className={styles.imagesList}>
                {images.map((image) => {
                  const pointId = getImagePointId(image.id);
                  const isSelected = startPoint === pointId;
                  const isConnected = connections.some(conn => conn.start === pointId || conn.end === pointId);
                  return (
                    <div
                      key={image.id}
                      className={`${styles.imageItem} ${!isConnected ? styles.clickable : ''}`}
                      onClick={(e) => !isConnected && handlePointClick(e, pointId)}
                    >
                      <div
                        id={pointId}
                        className={`${styles.connectionPoint} ${
                          isConnected 
                            ? styles.connected
                            : isSelected 
                              ? styles.selected
                              : styles.default
                        }`}
                        title={isConnected ? `الصورة متصلة بالفعل` : `اربط إلى الصورة`}
                      ></div>
                      <div className={styles.imageFrame}>
                        <img
                          src={image.url}
                          alt={getImageAltText(image.id)}
                          onError={(e) => { 
                            // استخدام صور بديلة مناسبة عند فشل تحميل الصور الأصلية
                            if (image.id === 'img1') {
                              e.currentTarget.src = 'https://placehold.co/120x120/E3F2FD/1565C0?text=تلميذ';
                            } else if (image.id === 'img2') {
                              e.currentTarget.src = 'https://placehold.co/120x120/FCE4EC/C2185B?text=تلميذة';
                            } else if (image.id === 'img3') {
                              e.currentTarget.src = 'https://placehold.co/120x120/E8F5E8/388E3C?text=تلاميذ';
                            } else {
                              e.currentTarget.src = 'https://placehold.co/120x120/EEE/31343C?text=Error';
                            }
                          }}
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
              className={styles.tempMouseTarget}
              style={{ 
                top: `${mousePos.y}px`, 
                left: `${mousePos.x}px`
              }}
            />
          )}
        </div>
      </div>

      {/* رسم خطوط التوصيل النهائية */}
      {connections.map((conn, index) => (
        <Xarrow
          key={`conn-${conn.start}-${conn.end}-${index}`}
          start={conn.start} 
          end={conn.end}
          color="#171717" 
          strokeWidth={2} 
          headSize={6}
          path="straight" 
          showHead={true}
        />
      ))}

      {/* رسم الخط المؤقت أثناء السحب */}
      {startPoint && mousePos && (
        <Xarrow
          key="temp-arrow"
          start={startPoint} 
          end="temp-mouse-target"
          color="#171717" 
          strokeWidth={2} 
          headSize={0}
          path="straight" 
          showHead={false} 
          dashness={true}
          passProps={{ pointerEvents: "none" }}
        />
      )}
    </Xwrapper>
  );
}