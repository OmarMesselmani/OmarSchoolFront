'use client';

// استيراد المكتبات والمكونات اللازمة
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // إضافة استيراد Router للتنقل عند الإغلاق
import Xarrow, { Xwrapper } from 'react-xarrows';
import styles from './page.module.css';
import ExerciseSidebar from '@/app/components/exercise-sidebar/page';
import ExerciseHeader from '@/app/components/exercise-header/page';
// حذف استيرادات Header و Footer
import AiTalker from '@/app/components/ai-talker/page';

// تعريف واجهات البيانات
interface Connection {
    start: string;
    end: string;
}

interface Position {
    x: number;
    y: number;
}

// تعريف المكون الرئيسي للصفحة
export default function Exercise1Page() {
    const router = useRouter(); // إضافة Router للتنقل
    // تعريف متغيرات الحالة
    const [connections, setConnections] = useState<Connection[]>([]);
    const [startPoint, setStartPoint] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState<Position | null>(null);
    const [isFullLoading, setIsFullLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // بيانات الهيدر
    const headerData = {
        trimester: "الثلاثي الأول",
        unit: "الوحدة التمهيدية",
        title: "تمرين عدد 01",
        grade: "السنة الأولى",
        studentName: "أحمد بن علي"
    };

    // دالة إغلاق التمرين والتوجيه مباشرة إلى قسم قوائم التمارين في لوحة التحكم
    const handleClose = () => {
        // توجيه المستخدم إلى لوحة التحكم مع تحديد قسم "قوائم التمارين"
        router.push('/dashboard-user?section=home');
    };

    // بيانات التمرين (النصوص والصور)
    const items = [
        { id: 'text1', text: 'تِلْمِيذٌ' },
        { id: 'text2', text: 'تِلْمِيذَةٌ' },
        { id: 'text3', text: 'تَلَامِيذٌ' },
    ];
    const images = [
        { id: 'img2', url: '/exercices/year1/reading/introductory/exercice1/studentGirl.png' },
        { id: 'img3', url: '/exercices/year1/reading/introductory/exercice1/students.png' },
        { id: 'img1', url: '/exercices/year1/reading/introductory/exercice1/studentBoy.png' },
    ];

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

    // --- بنية الـ JSX للمكون ---
    return (
        <div className={styles.pageContainer} style={{ paddingTop: 0, marginTop: 0 }}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet" />
            </Head>

            {/* تمت إزالة الهيدر */}

            {/* أيقونة الإغلاق - رمادية أفتح مع X أبيض وأبعد عن الزاوية */}
            <div 
                className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-600 transition-colors"
                onClick={handleClose}
                title="إغلاق التمرين"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>

            <main className={styles.exerciseContainer} style={{ paddingTop: '1rem' }}>
                <div className={styles.exerciseContent}>
                    <ExerciseHeader
                        trimester={headerData.trimester}
                        unit={headerData.unit}
                        title={headerData.title}
                        grade={headerData.grade}
                        studentName={headerData.studentName}
                    />

                    <Xwrapper>
                        <div className={styles.exerciseBody}>
                            <div
                                ref={containerRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                onClick={handleContainerClick}
                                className={`${styles.mainContent} relative`}
                            >
                                <div dir="rtl" className="relative h-full p-5">
                                    <h2 className="flex items-center justify-start gap-3 font-bold mb-8">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DD2946] text-white text-base font-bold">
                                            1
                                        </span>
                                        <span
                                            className="text-2xl"
                                            style={{ color: '#DD2946', fontFamily: "'Scheherazade New', serif" }}
                                        >
                                            أَرْبُطُ كُلَّ جُمْلَةٍ بِٱلصُّورَةِ ٱلْمُنَاسِبَةِ
                                        </span>
                                    </h2>

                                    <div className="flex h-full items-start justify-between">
                                        <div className="space-y-6 flex flex-col justify-around h-full min-h-[300px]">
                                            {items.map((item) => {
                                                const pointId = getTextPointId(item.id);
                                                const isSelected = startPoint === pointId;
                                                const isConnected = connections.some(conn => conn.start === pointId || conn.end === pointId);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`flex items-center gap-4 ${!isConnected ? 'cursor-pointer' : ''}`}
                                                        onClick={(e) => !isConnected && handlePointClick(e, pointId)}
                                                    >
                                                        <span
                                                            className="text-2xl"
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

                                        <div className="space-y-6 flex flex-col justify-around h-full min-h-[300px]">
                                            {images.map((image) => {
                                                const pointId = getImagePointId(image.id);
                                                const isSelected = startPoint === pointId;
                                                const isConnected = connections.some(conn => conn.start === pointId || conn.end === pointId);
                                                return (
                                                    <div
                                                        key={image.id}
                                                        className={`flex items-center gap-4 ${!isConnected ? 'cursor-pointer' : ''}`}
                                                        onClick={(e) => !isConnected && handlePointClick(e, pointId)}
                                                    >
                                                        <div
                                                            id={pointId}
                                                            className={`w-3 h-3 rounded-full transition-colors ${isConnected ? 'bg-gray-400' : isSelected ? 'bg-blue-500 ring-2 ring-offset-2 ring-blue-500' : 'bg-[#DD2946]'}`}
                                                            title={isConnected ? `الصورة متصلة بالفعل` : `اربط إلى الصورة`}
                                                        ></div>
                                                        <div
                                                            id={image.id}
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

                                {mousePos && startPoint && (
                                    <div
                                        id="temp-mouse-target"
                                        style={{ position: 'absolute', top: `${mousePos.y}px`, left: `${mousePos.x}px`, width: '1px', height: '1px', pointerEvents: 'none' }}
                                    />
                                )}
                            </div>

                            <ExerciseSidebar
                                onUndoClick={handleUndo}
                                onResetClick={handleReset}
                            />
                        </div>

                        {connections.map((conn, index) => (
                            <Xarrow
                                key={`conn-${conn.start}-${conn.end}-${index}`}
                                start={conn.start} end={conn.end}
                                color="#171717" strokeWidth={2} headSize={6}
                                path="straight" showHead={true}
                            />
                        ))}

                        {startPoint && mousePos && (
                            <Xarrow
                                key="temp-arrow"
                                start={startPoint} end="temp-mouse-target"
                                color="#171717" strokeWidth={2} headSize={0}
                                path="straight" showHead={false} dashness={true}
                                passProps={{ pointerEvents: "none" }}
                            />
                        )}
                    </Xwrapper>
                </div>
            </main>

            {/* إضافة المكون الجديد AI Talker */}
            <AiTalker 
                exerciseType="قراءة"
                onHelpRequest={() => console.log("طلب مساعدة")}
                onExplainRequest={() => console.log("طلب شرح")}
            />
            {/* تمت إزالة الفوتر */}
        </div>
    );
}