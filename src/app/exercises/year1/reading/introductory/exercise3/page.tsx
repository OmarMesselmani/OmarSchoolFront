// المسار المقترح: app/exercises/year1/reading/introductory/exercise3/page.tsx

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
// استيراد الأنماط - تأكد من أن المسار صحيح لملف CSS الجديد
import styles from './page.module.css';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
// استيراد الشريط الجانبي - تأكد من أن المسار صحيح
import ExerciseSidebar from '@/app/dashboardUser/dashboard-modules/ExerciseSidebar/page';

// واجهة لوصف بيانات كل عنصر
interface ItemInfo {
  id: string;
  name: string;
  isCorrect: boolean;
  imageUrl: string;
}

// واجهة لنقطة في المسار
interface Point {
    x: number;
    y: number;
}

// اسم المكون الجديد
export default function Exercise3Page() {

    // --- بيانات العناصر للتمرين ---
    const exerciseBasePath = '/exercices/year1/reading/introductory/exercise3';
    const itemsData: ItemInfo[] = [
      { id: 'scissors', name: 'مِقَصٌّ', isCorrect: true, imageUrl: `${exerciseBasePath}/scissors.png` },
      { id: 'book', name: 'كِتَابٌ', isCorrect: true, imageUrl: `${exerciseBasePath}/book.png` },
      { id: 'eraser', name: 'مِمْحَاةٌ', isCorrect: true, imageUrl: `${exerciseBasePath}/eraser.png` },
      { id: 'bread', name: 'خُبْزٌ', isCorrect: false, imageUrl: `${exerciseBasePath}/bread.png` },
      { id: 'ball', name: 'كُرَةٌ', isCorrect: false, imageUrl: `${exerciseBasePath}/ball.png` },
      { id: 'ruler', name: 'مِسْطَرَةٌ', isCorrect: true, imageUrl: `${exerciseBasePath}/ruler.png` },
      { id: 'board', name: 'لَوْحَةٌ', isCorrect: true, imageUrl: `${exerciseBasePath}/blackboard.png` },
      { id: 'spoon', name: 'مِلْعَقَةٌ', isCorrect: false, imageUrl: `${exerciseBasePath}/spoon.png` },
    ];
    // تحديد ترتيب العرض المطلوب ليطابق الصورة (الصفوف مبدلة)
    const displayOrderIds = ['scissors', 'book', 'eraser', 'bread', 'ball', 'ruler', 'board', 'spoon'];
    const displayItems = displayOrderIds.map(id => itemsData.find(item => item.id === id)!);


    // --- حالة التمرين ---
    const [isDrawing, setIsDrawing] = useState(false);
    const [pathPoints, setPathPoints] = useState<Point[]>([]); // المسار أثناء الرسم
    const [finalPolygon, setFinalPolygon] = useState<Point[] | null>(null); // المضلع النهائي (المنعّم)
    const [isNearStart, setIsNearStart] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);


    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const drawingAreaRef = useRef<HTMLDivElement>(null); // Ref للغطاء الشفاف

    // ثوابت لتحديد الاقتراب
    const PROXIMITY_THRESHOLD = 15;
    const MIN_POINTS_FOR_SNAP = 10;

    // --- إعداد Canvas ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const exerciseAreaElement = document.getElementById('exercise-area-div');
        let ctx: CanvasRenderingContext2D | null = null;

        const setupCanvas = () => {
            if (canvas && exerciseAreaElement) {
                canvas.width = exerciseAreaElement.offsetWidth;
                canvas.height = exerciseAreaElement.offsetHeight;
                ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.strokeStyle = '#0055AA';
                    ctx.lineWidth = 3;
                    ctxRef.current = ctx;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        };

        const timeoutId = setTimeout(setupCanvas, 100);
        window.addEventListener('resize', setupCanvas);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', setupCanvas);
            ctxRef.current = null;
        }

    }, []);

    // --- دالة لرسم المسار الحالي أثناء السحب ---
    const drawCurrentPath = useCallback(() => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas || pathPoints.length < 1 || finalPolygon) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < pathPoints.length; i++) {
            ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        ctx.stroke();
    }, [pathPoints, finalPolygon]);

    // --- useEffect لرسم المضلع النهائي (المنعّم الآن) ---
    useEffect(() => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (finalPolygon && finalPolygon.length >= 3) {
            // console.log("Drawing final smoothed polygon:", finalPolygon);
            ctx.beginPath();
            ctx.moveTo(finalPolygon[0].x, finalPolygon[0].y);
            for (let i = 1; i < finalPolygon.length; i++) {
                ctx.lineTo(finalPolygon[i].x, finalPolygon[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }, [finalPolygon]);

    // --- تحديث الرسم المؤقت عند تغير نقاط المسار ---
    useEffect(() => {
        if (isDrawing) {
            drawCurrentPath();
        }
    }, [pathPoints, isDrawing, drawCurrentPath]);

    // --- دالة للحصول على إحداثيات الفأرة النسبية للغطاء الشفاف ---
    const getRelativeCoords = (event: React.MouseEvent): Point | null => {
        const container = drawingAreaRef.current;
        if (!container) return null;
        const rect = container.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    // --- معالجات أحداث الفأرة ---
    const handleMouseDown = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        const coords = getRelativeCoords(event);
        if (!coords) return;
        setFinalPolygon(null);
        setIsNearStart(false);
        setSelectedItems([]);
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if(ctx && canvas) {
             ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setIsDrawing(true);
        setPathPoints([coords]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        if (!isDrawing) return;
        const coords = getRelativeCoords(event);
        if (!coords) return;

        if (pathPoints.length > MIN_POINTS_FOR_SNAP) {
            const startPoint = pathPoints[0];
            const dx = coords.x - startPoint.x;
            const dy = coords.y - startPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            setIsNearStart(distance < PROXIMITY_THRESHOLD);
        } else {
            setIsNearStart(false);
        }

        setPathPoints(prevPoints => [...prevPoints, coords]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDrawing, pathPoints]);

    // تعديل: handleMouseUp لتنعيم المسار قبل التخزين والفحص
    const handleMouseUp = useCallback(() => {
        if (!isDrawing) return;
        setIsDrawing(false);
        setIsNearStart(false);

        if (pathPoints.length < 3) {
            setPathPoints([]);
            const ctx = ctxRef.current;
            const canvas = canvasRef.current;
             if(ctx && canvas) {
                 ctx.clearRect(0, 0, canvas.width, canvas.height);
             }
            return;
        }

        const currentFinalPath = [...pathPoints];
        // *** تعديل: زيادة عدد تكرارات التنعيم إلى 10 ***
        const smoothedPolygon = smoothPathChaikin(currentFinalPath, 10); // <-- زيادة التكرارات هنا

        setFinalPolygon(smoothedPolygon); // تخزين المضلع المنعّم
        setPathPoints([]); // مسح المسار المؤقت

        console.log("Drawing finished. Smoothed Polygon (10 iterations):", smoothedPolygon); // <-- تحديث الرسالة

        // تحديد العناصر داخل المضلع (باستخدام المضلع المنعّم)
        const itemsInside: string[] = [];
        const drawingAreaRect = drawingAreaRef.current?.getBoundingClientRect();

        if (drawingAreaRect && smoothedPolygon.length >= 3) {
            itemsData.forEach((item) => {
                const element = document.getElementById(`item-${item.id}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const itemCenterX = (rect.left - drawingAreaRect.left) + rect.width / 2;
                    const itemCenterY = (rect.top - drawingAreaRect.top) + rect.height / 2;
                    const itemPoint = { x: itemCenterX, y: itemCenterY };

                    if (isPointInPolygon(itemPoint, smoothedPolygon)) {
                        itemsInside.push(item.id);
                    }
                }
            });
        }

        setSelectedItems(itemsInside);
        console.log("Selected items:", itemsInside);

    }, [isDrawing, pathPoints, itemsData]); // تم إضافة itemsData

    const handleMouseLeaveDrawingArea = useCallback(() => {
        if (isDrawing) {
            handleMouseUp();
        }
    }, [isDrawing, handleMouseUp]);

    // --- دوال التحكم في الشريط الجانبي ---
    const handleUndo = useCallback(() => {
        console.log("Undo action for Exercise 3 (Not Implemented Yet)");
    }, []);

    const handleReset = useCallback(() => {
        console.log("Reset action for Exercise 3");
        setIsDrawing(false);
        setPathPoints([]);
        setFinalPolygon(null);
        setIsNearStart(false);
        setSelectedItems([]);
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if(ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, []);

    // --- بناء واجهة المستخدم ---
    return (
        <div className={styles.pageContainer}>
            <Head>
                 <link rel="preconnect" href="https://fonts.googleapis.com" />
                 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                 <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@600;700&display=swap" rel="stylesheet" />
                 <title>التمرين التمهيدي عدد 03</title>
            </Head>

            <Header />
            <main className={styles.exerciseContainer}>
                <div className={styles.exerciseContent}>
                    <h1 className={styles.exerciseTitle}>التمرين التمهيدي عدد 03</h1>
                    <div className={styles.exerciseBody}>
                        {/* المحتوى الرئيسي للتمرين */}
                        <div dir="rtl" className={`${styles.mainContent} relative`} >
                            <h2 className="flex items-center justify-start gap-3 font-bold mb-8">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DD2946] text-white text-base font-bold"> 3 </span>
                                <span className="text-2xl font-bold" style={{ color: '#DD2946', fontFamily: "'Scheherazade New', serif" }} > أُحِيطُ مَا يُوجَدُ فِي مِحْفَظَتِي: </span>
                            </h2>

                            {/* صورة المحفظة خارج منطقة الرسم */}
                            <div className="flex flex-col items-center mb-10">
                                <img src={`${exerciseBasePath}/backpack.png`} alt="صورة محفظة مدرسية توضيحية" height={150} className="h-[150px] w-auto object-contain" />
                                <p className="mt-2 text-2xl font-bold" style={{ color: '#DD2946', fontFamily: "'Scheherazade New', serif" }} > مِحْفَظَتِي </p>
                            </div>

                            {/* --- منطقة التمرين --- */}
                            <div id="exercise-area-div" className="exercise-area relative flex flex-col justify-center items-center p-16 min-h-[550px]">

                                {/* شبكة لعرض العناصر */}
                                <div className="relative z-0 grid grid-cols-4 gap-x-20 gap-y-16">
                                    {displayItems.map((item) => (
                                        <div
                                          key={item.id}
                                          className={`flex flex-col items-center text-center p-2 rounded-lg transition-all duration-200 ease-in-out ${
                                              selectedItems.includes(item.id)
                                              ? 'border-4 border-green-500' // نمط التحديد
                                              : 'border-4 border-transparent' // إطار شفاف للحفاظ على التخطيط
                                          }`}
                                        >
                                            <div id={`item-${item.id}`} className="w-24 h-24 mb-2 flex items-center justify-center" aria-label={item.name} >
                                                <img src={item.imageUrl} alt={item.name} width={96} height={96} className="object-contain max-w-full max-h-full" />
                                            </div>
                                            <span className="text-xl font-semibold" style={{ fontFamily: "'Scheherazade New', serif" }} > {item.name} </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Canvas للرسم */}
                                <canvas
                                    ref={canvasRef}
                                    className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                                ></canvas>

                                {/* الغطاء الشفاف لالتقاط أحداث الفأرة مع إطار */}
                                <div
                                    ref={drawingAreaRef}
                                    className="absolute top-0 left-0 w-full h-full z-20 cursor-crosshair border-2 border-dashed border-gray-400 rounded-lg"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeaveDrawingArea}
                                ></div>

                                {/* مؤشر الاقتراب من نقطة البداية */}
                                {isNearStart && pathPoints.length > 0 && (
                                    <div
                                        className="absolute w-3 h-3 bg-blue-500 rounded-full pointer-events-none ring-2 ring-blue-300 shadow-lg"
                                        style={{
                                            left: `${pathPoints[0].x - 6}px`,
                                            top: `${pathPoints[0].y - 6}px`,
                                            zIndex: 30
                                        }}
                                        title="أغلق الشكل هنا"
                                    ></div>
                                )}
                            </div>
                            {/* --- نهاية منطقة التمرين --- */}
                        </div>

                         {/* الشريط الجانبي */}
                         <div>
                            <ExerciseSidebar onUndoClick={handleUndo} onResetClick={handleReset} />
                         </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// --- الدوال المساعدة خارج المكون ---

// دالة تنعيم المسار باستخدام خوارزمية تشايكين
function smoothPathChaikin(points: Point[], iterations: number = 1): Point[] {
    if (points.length < 3) return points;
    let smoothedPoints = [...points];
    for (let iter = 0; iter < iterations; iter++) {
        const currentPoints = [...smoothedPoints];
         if (currentPoints.length > 1) {
             currentPoints.push(currentPoints[0]);
         } else { continue; }
        const newPath: Point[] = [];
        if (currentPoints.length < 2) continue;
        for (let i = 0; i < currentPoints.length - 1; i++) {
            const p0 = currentPoints[i];
            const p1 = currentPoints[i + 1];
            const qX = 0.75 * p0.x + 0.25 * p1.x;
            const qY = 0.75 * p0.y + 0.25 * p1.y;
            newPath.push({ x: qX, y: qY });
            const rX = 0.25 * p0.x + 0.75 * p1.x;
            const rY = 0.25 * p0.y + 0.75 * p1.y;
            newPath.push({ x: rX, y: rY });
        }
        smoothedPoints = newPath;
    }
    return smoothedPoints;
}


// دالة التحقق من نقطة داخل مضلع (Ray Casting)
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
    let x = point.x, y = point.y;
    let isInside = false;
    if (!polygon || polygon.length < 3) { return false; }
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;
        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}
