'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
import styles from './matching-question.module.css';
import { CONNECTION_EVENTS } from '@/app/exam/[packUniqueCode]/[uniqueId]/[questionOrder]/page';
import Cookies from 'js-cookie';
import { TwoColumnsMatchingResponse } from '@/app/data-structures/Exam';
import { Student } from '@/app/data-structures/Student';
import { useParams } from 'next/navigation';

// تعريف واجهات البيانات الداخلية للمكون
interface Connection {
  right: string;
  left: string;
}

interface Position {
  x: number;
  y: number;
}




interface MatchingQuestionProps {
  exerciseId: number;
  student?: Student; // إضافة خاصية الطالب
  handleStepChange?: (step: number) => void; // إضافة هذا
  questionNumber: string;
  questionTitle: string;
  correctMatches?: Array<{
    textId?: string;
    imageId?: string;
  }>;
}

export default function MatchingQuestion({
  exerciseId,
  handleStepChange,
  student,
  questionNumber,
  questionTitle
}: MatchingQuestionProps) {

  const params = useParams();

  const stringCurrentStep = params?.questionOrder as string;
  const currentStep = parseInt(stringCurrentStep); // تحويل المعامل إلى رقم صحيح
  const [connections, setConnections] = useState<Connection[]>([]);
  const [startPoint, setStartPoint] = useState<string | null>(null);
  const [matchingData, setMatchingData] = useState<TwoColumnsMatchingResponse | null>(null);
  const [mousePos, setMousePos] = useState<Position | null>(null);
  const [isFullLoading, setIsFullLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFullLoading(true);

    fetch(`http://127.0.0.1:8000/student/get-exercise-data/${exerciseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${Cookies.get("token")}`,
      }
    })
      .then(res => {
        if (res.status === 401) {
          // Redirect to login
          window.location.href = "/auth/login";
          return null; // short‐circuit the chain
        }
        return res.json();
      })
      .then(data => {
        setMatchingData(data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setIsFullLoading(false));
  }, [exerciseId]);

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
    console.log('startPoint : ' + startPoint)
    e.stopPropagation();
    if (!startPoint) {
      if (connections.some(conn => conn.right === pointId || conn.left === pointId)) {
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
      if (connections.some(conn => conn.right === pointId || conn.left === pointId)) {
        console.log("النقطة الهدف متصلة بالفعل.");
        cancelConnection();
        return;
      }

      // تحديد النقطة الصحيحة للبداية والنهاية
      const finalStart = isStartText ? startPoint : pointId;
      const finalEnd = isCurrentImage ? pointId : startPoint;
      console.log('finalEnd : ' + finalEnd)

      setConnections(prevConnections => [...prevConnections, { right: finalStart, left: finalEnd }]);
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

  // إضافة useEffect للاستماع للأحداث
  useEffect(() => {
    const handleUndoEvent = () => {
      setConnections(prevConnections => {
        if (prevConnections.length > 0) {
          console.log("تراجع عن آخر اتصال");
          return prevConnections.slice(0, -1);
        }
        return prevConnections;
      });

      if (startPoint) {
        setStartPoint(null);
        setMousePos(null);
      }
    };

    const handleResetEvent = () => {
      console.log("إعادة تعيين جميع الاتصالات");
      setConnections([]);
      if (startPoint) {
        setStartPoint(null);
        setMousePos(null);
      }
    };

    document.addEventListener(CONNECTION_EVENTS.UNDO, handleUndoEvent);
    document.addEventListener(CONNECTION_EVENTS.RESET, handleResetEvent);

    return () => {
      document.removeEventListener(CONNECTION_EVENTS.UNDO, handleUndoEvent);
      document.removeEventListener(CONNECTION_EVENTS.RESET, handleResetEvent);
    };
  }, [startPoint]);

  useEffect(() => {
    return () => {
      setConnections([]);
      setStartPoint(null);
      setMousePos(null);
    };
  }, []);

  // دالة لعرض محتوى العنصر (نص أو صورة)
  const renderItemContent = (item: { id: string; text?: string; url?: string; }) => {
    if (item.url) {
      return (
        <img
          src={item.url}
          alt={`صورة ${item.id}`}
          className={styles.matchingImage}
        />
      );
    } else if (item.text) {
      return (
        <div className={styles.textContent}>
          {item.text}
        </div>
      );
    }
    return <div>محتوى غير محدد</div>;
  };

  // دالة لعرض محتوى العمود الأيمن (images) - تم حذف النقاط المزدوجة
  const renderImageContent = (image: { id: string; text?: string; image?: string; order: number }) => {
    if (image.image) {
      return (
        <img
          src={image.image}
          alt={`صورة ${image.id}`}
          className={styles.matchingImage}
        />
      );
    } else if (image.text) {
      return (
        <div className={styles.textContent}>
          {image.text}
        </div>
      );
    }
    return <div>محتوى غير محدد</div>;
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
            {/* عنوان السؤال */}
            <div className={styles.questionTitle}>
              <span className={styles.questionNumber}>
                {currentStep + 1}
              </span>
              <span className={styles.questionText}>
                {questionTitle}
              </span>
            </div>
            {JSON.stringify(connections)}

            <div className={styles.matchingArea}>
              {/* العمود الأيسر - النصوص/الصور */}
              <div className={styles.textsList}>
                {matchingData?.right_items.map((item) => {
                  const pointId = getTextPointId(item.id);
                  const isSelected = startPoint === pointId;
                  const isConnected = connections.some(conn => conn.right === pointId || conn.left === pointId);
                  return (
                    <div
                      key={item.id}
                      className={`${styles.textItem} ${!isConnected ? styles.clickable : ''}`}
                      onClick={(e) => !isConnected && handlePointClick(e, pointId)}
                    >
                      <div
                        id={pointId}
                        className={`${styles.connectionPoint} ${isConnected
                          ? styles.connected
                          : isSelected
                            ? styles.selected
                            : styles.default
                          }`}
                        title={isConnected ? `"${item.text || item.id}" متصلة بالفعل` : `اربط من: ${item.text || item.id}`}
                      ></div>
                      {renderItemContent(item)}
                    </div>
                  );
                })}
              </div>

              {/* العمود الأيمن - الصور/النصوص */}
              <div className={styles.imagesColumn}>
                {matchingData?.left_items.map((image) => {
                  const pointId = getImagePointId(image.id);
                  const isSelected = startPoint === pointId;
                  const isConnected = connections.some(conn => conn.right === pointId || conn.left === pointId);
                  return (
                    <div
                      key={image.id}
                      className={`${styles.imageContainer} ${isConnected ? styles.connected : ''
                        } ${!isConnected ? styles.clickable : ''}`}
                      onClick={(e) => !isConnected && handlePointClick(e, pointId)}
                    >
                      {renderImageContent(image)}
                      <div
                        id={pointId}
                        className={`${styles.connectionPoint} ${isConnected
                          ? styles.connected
                          : isSelected
                            ? styles.selected
                            : styles.default
                          }`}
                      ></div>
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
          key={`conn-${conn.right}-${conn.left}-${index}`}
          start={conn.right}
          end={conn.left}
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