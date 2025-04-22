// المسار المقترح: app/exercises/year1/reading/introductory/exercise4/page.tsx

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
// استيراد الأنماط - تأكد من أن المسار صحيح لملف CSS الجديد
import styles from './page.module.css';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
// استيراد الشريط الجانبي - تأكد من أن المسار صحيح
import ExerciseSidebar from '@/app/dashboard-user/dashboard-modules/ExerciseSidebar/page';
// استيراد أنواع JSXGraph (بعد تثبيت @types/jsxgraph)
import JXG from 'jsxgraph';

// اسم المكون الجديد
export default function Exercise4Page() {

    // --- حالة التمرين ---
    const [isFullLoading, setIsFullLoading] = useState(false);

    const [points, setPoints] = useState<JXG.Point[]>([]); // لتخزين النقاط المستخدمة للرسم الحالي
    const [drawingMode, setDrawingMode] = useState<'triangle' | 'circle' | null>(null); // وضع الرسم الحالي
    // *** جديد: حالة لتخزين الشكل الهندسي المرسوم ***
    const [drawnShape, setDrawnShape] = useState<JXG.GeometryElement | null>(null);

    // Ref لتخزين كائن لوحة JSXGraph
    const boardRef = useRef<JXG.Board | null>(null);
    // Ref لتتبع النقاط الحالية داخل معالج الحدث
    const pointsRef = useRef<JXG.Point[]>(points);
    // Ref لتتبع وضع الرسم الحالي داخل معالج الحدث
    const drawingModeRef = useRef(drawingMode);

    // تحديث الـ refs عند تغير الحالة
    useEffect(() => { pointsRef.current = points; }, [points]);
    useEffect(() => { drawingModeRef.current = drawingMode; }, [drawingMode]);


    // --- إعداد لوحة JSXGraph ---
    useEffect(() => {
        // منع إعادة التهيئة إذا كانت اللوحة موجودة
        if (boardRef.current) {
            return;
        }

        // تهيئة اللوحة فقط إذا كان الـ div موجودًا
        const boardContainer = document.getElementById('jxgbox');
        if (boardContainer) {
            console.log("Initializing JSXGraph board...");
            const board = JXG.JSXGraph.initBoard('jxgbox', {
                boundingbox: [-5, 5, 5, -5], // حدود اللوحة
                axis: true,                 // إظهار المحاور
                showCopyright: false,
                showNavigation: true,       // إظهار أزرار التنقل
                grid: true,                 // إظهار الشبكة
                pan: { enabled: false },    // تعطيل التحريك
                zoom: { wheel: false, pinchHorizontal: false, pinchVertical: false, pinchSensitivity: 0 } // تعطيل التكبير
            });
            boardRef.current = board; // تخزين مرجع اللوحة

            // --- معالج النقر على اللوحة ---
            const handleBoardClick = (event: MouseEvent | TouchEvent) => {
                const currentMode = drawingModeRef.current;
                const currentPoints = pointsRef.current;
                const boardInstance = boardRef.current;
                if (!boardInstance || !currentMode || drawnShape) return; // لا ترسم إذا كان هناك شكل مرسوم بالفعل أو لم يتم اختيار وضع

                const coords = boardInstance.getUsrCoordsOfMouse(event);
                let shapeDrawn = false;
                let createdShape: JXG.GeometryElement | null = null;

                if (currentMode === 'triangle') {
                    if (currentPoints.length < 3) {
                        const pointName = String.fromCharCode(65 + currentPoints.length);
                        const newPoint = boardInstance.create('point', [coords[0], coords[1]], { name: pointName, size: 2, fixed: true, showInfobox: false });
                        const updatedPoints = [...currentPoints, newPoint];
                        setPoints(updatedPoints); // تحديث الحالة

                        if (updatedPoints.length === 3) {
                            createdShape = boardInstance.create('polygon', updatedPoints, {
                                name: 'المثلث', withLines: true, vertices: { visible: false },
                                borders: { strokeColor: 'blue', strokeWidth: 2 }, fillColor: 'rgba(0,0,255,0.1)'
                            });
                            shapeDrawn = true;
                        }
                    }
                } else if (currentMode === 'circle') {
                    if (currentPoints.length < 2) {
                        const pointName = currentPoints.length === 0 ? 'Center' : 'RadiusPt';
                        const newPoint = boardInstance.create('point', [coords[0], coords[1]], { name: pointName, size: 2, fixed: true, showInfobox: false });
                        const updatedPoints = [...currentPoints, newPoint];
                        setPoints(updatedPoints); // تحديث الحالة

                        if (updatedPoints.length === 2) {
                            createdShape = boardInstance.create('circle', updatedPoints, {
                                name: 'الدائرة', strokeColor: 'green', strokeWidth: 2, fillColor: 'rgba(0,255,0,0.1)'
                            });
                            shapeDrawn = true;
                        }
                    }
                }

                // تخزين الشكل المرسوم في الحالة
                if (shapeDrawn && createdShape) {
                    setDrawnShape(createdShape);
                    // لا تمسح النقاط هنا، سنحذفها عند إعادة التعيين أو التراجع
                }
            };

            board.on('down', handleBoardClick); // ربط الحدث 'down'

        } else {
            console.error("JSXGraph container 'jxgbox' not found.");
        }

        // دالة التنظيف
        return () => {
            if (boardRef.current) {
                console.log("Freeing JSXGraph board...");
                JXG.JSXGraph.freeBoard(boardRef.current);
                boardRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // مصفوفة اعتماديات فارغة للتشغيل مرة واحدة فقط

    // --- دوال التحكم في الشريط الجانبي ---

    // *** تعديل: handleReset يستخدم الحذف المستهدف ***
    const handleReset = useCallback(() => {
        console.log("Reset action for Exercise 4");
        const board = boardRef.current;
        if (board) {
            board.suspendUpdate();

            // حذف الشكل المرسوم إذا كان موجودًا
            if (drawnShape) {
                board.removeObject(drawnShape);
            }

            // حذف النقاط الفردية
            points.forEach(point => {
                // التأكد أن النقطة لا تزال موجودة قبل محاولة حذفها (احتياطي)
                if (board.objects[point.id]) {
                    board.removeObject(point);
                }
            });

            // مسح الحالات
            setPoints([]);
            setDrawingMode(null);
            setDrawnShape(null);

            board.unsuspendUpdate();
        }
    }, [points, drawnShape]); // يعتمد على points و drawnShape

    // *** تعديل: handleUndo يستخدم الحذف المستهدف أو Reset ***
    const handleUndo = useCallback(() => {
        console.log("Undo action for Exercise 4");
        const board = boardRef.current;
        // إذا تم رسم الشكل، فالتراجع يعيد الضبط
        if (drawnShape) {
            handleReset();
        }
        // إذا لم يتم رسم الشكل وهناك نقاط، احذف النقطة الأخيرة
        else if (board && points.length > 0) {
            const lastPoint = points[points.length - 1];
            // التأكد أن النقطة لا تزال موجودة قبل محاولة حذفها
            if (board.objects[lastPoint.id]) {
                board.removeObject(lastPoint);
            }
            setPoints(prevPoints => prevPoints.slice(0, -1));
        }
    }, [points, drawnShape, handleReset]); // يعتمد على points, drawnShape, handleReset


    // --- دالة لتغيير وضع الرسم ---
    const selectDrawingMode = (mode: 'triangle' | 'circle') => {
        // لا تقم بإعادة الضبط هنا إذا كان الوضع المحدد هو نفسه
        if (mode !== drawingMode) {
            handleReset(); // مسح اللوحة عند تغيير الوضع
            setDrawingMode(mode);
        } else {
            // إذا كان الوضع هو نفسه، يمكن مسح النقاط والشكل فقط للبدء من جديد بنفس الوضع
            const board = boardRef.current;
            if (board) {
                board.suspendUpdate();
                if (drawnShape) { board.removeObject(drawnShape); setDrawnShape(null); }
                points.forEach(point => { if (board.objects[point.id]) board.removeObject(point); });
                setPoints([]);
                board.unsuspendUpdate();
            }
        }
    };

    // --- تحديد نص التعليمات بناءً على الوضع ---
    const getInstructions = (): string => {
        if (!drawingMode) { return "اختر شكلًا لتبدأ الرسم (مثلث أو دائرة)."; }
        if (drawingMode === 'triangle') {
            if (points.length === 0) return "انقر لتحديد الرأس الأول للمثلث.";
            if (points.length === 1) return "انقر لتحديد الرأس الثاني للمثلث.";
            if (points.length === 2) return "انقر لتحديد الرأس الثالث والأخير للمثلث.";
            return "تم رسم المثلث. اضغط إعادة تعيين أو اختر وضعًا آخر.";
        }
        if (drawingMode === 'circle') {
            if (points.length === 0) return "انقر لتحديد مركز الدائرة.";
            if (points.length === 1) return "انقر لتحديد نقطة على محيط الدائرة.";
            return "تم رسم الدائرة. اضغط إعادة تعيين أو اختر وضعًا آخر.";
        }
        return "";
    }

    // --- بناء واجهة المستخدم ---
    return (
        <div className={styles.pageContainer}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@600;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/jsxgraph@latest/dist/jsxgraph.css" />
                <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jsxgraph@latest/dist/jsxgraphcore.js" defer></script>
                <title>التمرين التمهيدي عدد 04</title>
            </Head>

            <Header />
            <main className={styles.exerciseContainer}>
                <div className={styles.mainContent}>
                    <h1 className={styles.pageTitle}>التمرين التمهيدي عدد 04</h1>
                    <div className={styles.formContainer || styles.exerciseAreaContainer}>
                        <h2 className="flex items-center justify-start gap-3 font-bold mb-4 text-right w-full">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DD2946] text-white text-base font-bold">
                                4
                            </span>
                            <span
                                className="text-2xl font-bold"
                                style={{ color: '#DD2946', fontFamily: "'Scheherazade New', serif" }}
                            >
                                ارسم دائرة أو مثلث
                            </span>
                        </h2>

                        {/* أزرار اختيار وضع الرسم */}
                        <div className="flex justify-center gap-4 mb-4">
                            <button
                                onClick={() => selectDrawingMode('triangle')}
                                className={`px-4 py-2 rounded ${drawingMode === 'triangle' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                            >
                                رسم مثلث
                            </button>
                            <button
                                onClick={() => selectDrawingMode('circle')}
                                className={`px-4 py-2 rounded ${drawingMode === 'circle' ? 'bg-green-600 text-white shadow-md' : 'bg-green-100 text-green-800 hover:bg-green-300'}`}
                            >
                                رسم دائرة
                            </button>
                        </div>

                        {/* عرض التعليمات الديناميكية */}
                        <p className="text-center text-gray-600 mb-4 h-5">{getInstructions()}</p>


                        {/* --- منطقة التمرين --- */}
                        <div className="exercise-specific-content p-0 w-full flex justify-center">
                            <div
                                id="jxgbox"
                                className="jxgbox border"
                                style={{ width: '500px', height: '450px', borderColor: '#ccc' }}
                            ></div>
                        </div>
                        {/* --- نهاية منطقة التمرين --- */}

                    </div>
                </div>
                {/* الشريط الجانبي */}
                <div className="mt-4 self-center">
                    <ExerciseSidebar onUndoClick={handleUndo} onResetClick={handleReset} />
                </div>
            </main>
            <Footer />
        </div>
    );
}

