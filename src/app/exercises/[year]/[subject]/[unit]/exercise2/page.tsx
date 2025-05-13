// المسار: app/exercises/year1/reading/introductory/exercise2/page.tsx

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import styles from './page.module.css';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ExerciseSidebar from '@/app/components/exercise-sidebar/page';

// تعريف واجهة لبيانات الألوان
interface ColorInfo {
    id: string;
    name: string;
    colorClass: string;
}

// واجهة لتحديد شكل عنصر في تاريخ الحركات
interface MoveHistoryItem {
    dropzoneId: string;
    draggedItem: ColorInfo;
    previousItemInDropzone: ColorInfo | null;
}

// اسم المكون الجديد
export default function Exercise2Page() {

    // --- بيانات الألوان الأساسية ---
    const initialColorsData: ColorInfo[] = [
        { id: 'red', name: 'أَحْمَرٌ', colorClass: 'bg-red-600' },
        { id: 'green', name: 'أَخْضَرٌ', colorClass: 'bg-green-600' },
        { id: 'blue', name: 'أَزْرَقٌ', colorClass: 'bg-blue-600' },
        { id: 'pink', name: 'وَرْدِيٌّ', colorClass: 'bg-pink-500' },
        { id: 'brown', name: 'بُنِّيٌّ', colorClass: 'bg-yellow-800' },
        { id: 'purple', name: 'بَنَفْسَجِيٌّ', colorClass: 'bg-purple-600' },
    ];

    // ترتيب عرض الدوائر ومناطق الإسقاط
    const displayOrderIds = ['red', 'purple', 'pink', 'green', 'blue', 'brown'];
    const displayOrderColors = displayOrderIds.map(id =>
        initialColorsData.find(color => color.id === id)!
    ).filter(Boolean);

    // --- حالة التمرين ---
    const [draggableItems, setDraggableItems] = useState<ColorInfo[]>(initialColorsData);
    const [droppedItems, setDroppedItems] = useState<{ [dropzoneId: string]: ColorInfo | null }>({});
    const [history, setHistory] = useState<MoveHistoryItem[]>([]);
    const [isFullLoading, setIsFullLoading] = useState(false);


    // إعداد حساسات الإدخال
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // --- دالة معالجة انتهاء السحب ---
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id.toString().startsWith('dropzone-')) {
            const dropzoneId = over.id.toString();
            const draggedItemId = active.id.toString().replace('drag-', '');
            const draggedColorInfo = initialColorsData.find(c => c.id === draggedItemId);
            const itemAlreadyInDropzone = droppedItems[dropzoneId] || null;

            if (draggedColorInfo && droppedItems[dropzoneId]?.id !== draggedItemId) {
                const move: MoveHistoryItem = {
                    dropzoneId: dropzoneId,
                    draggedItem: draggedColorInfo,
                    previousItemInDropzone: itemAlreadyInDropzone,
                };
                setHistory(prevHistory => [...prevHistory, move]);
                setDroppedItems(prev => ({
                    ...prev,
                    [dropzoneId]: draggedColorInfo,
                }));
                setDraggableItems(prev => {
                    const remainingItems = prev.filter(item => item.id !== draggedItemId);
                    if (itemAlreadyInDropzone) {
                        return [...remainingItems, itemAlreadyInDropzone].sort((a, b) => initialColorsData.findIndex(c => c.id === a.id) - initialColorsData.findIndex(c => c.id === b.id));
                    }
                    return remainingItems;
                });
            }
        }
    };


    // --- دوال التحكم في الشريط الجانبي ---
    const handleUndo = useCallback(() => {
        if (history.length === 0) {
            console.log("No moves to undo.");
            return;
        }
        const lastMove = history[history.length - 1];
        console.log("Undoing move:", lastMove);
        setDroppedItems(prev => ({
            ...prev,
            [lastMove.dropzoneId]: lastMove.previousItemInDropzone,
        }));
        setDraggableItems(prev => {
            let newDraggables = [...prev, lastMove.draggedItem];
            if (lastMove.previousItemInDropzone) {
                newDraggables = newDraggables.filter(item => item.id !== lastMove.previousItemInDropzone!.id);
            }
            return newDraggables.sort((a, b) => initialColorsData.findIndex(c => c.id === a.id) - initialColorsData.findIndex(c => c.id === b.id));
        });
        setHistory(prevHistory => prevHistory.slice(0, -1));
    }, [history, initialColorsData]);

    const handleReset = useCallback(() => {
        console.log("Reset action for Drag and Drop");
        setDraggableItems(initialColorsData);
        setDroppedItems({});
        setHistory([]);
    }, [initialColorsData]);

    // --- مكونات مساعدة للسحب والإفلات ---

    // مكون العنصر القابل للسحب (اسم اللون)
    function DraggableColor({ color }: { color: ColorInfo }) {
        const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
            id: `drag-${color.id}`,
            data: { colorInfo: color },
        });

        const style: React.CSSProperties = {
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            transition: 'transform 0.1s ease-out',
            fontFamily: "'Scheherazade New', serif",
            opacity: isDragging ? 0.5 : 1,
            zIndex: isDragging ? 100 : 'auto',
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={`bg-[#F6CAD1] text-gray-800 px-8 py-3 rounded-full text-2xl font-semibold cursor-grab shadow hover:shadow-md transition-shadow`}
            >
                {color.name}
            </div>
        );
    }

    // مكون منطقة الإسقاط
    function DroppableZone({ colorId, droppedItem }: { colorId: string, droppedItem: ColorInfo | null }) {
        const { isOver, setNodeRef } = useDroppable({
            id: `dropzone-${colorId}`,
        });

        const borderStyle = droppedItem ? 'border-solid' : 'border-dashed';
        const borderColor = droppedItem ? 'border-[#171717]' : 'border-gray-400';

        return (
            <div
                ref={setNodeRef}
                className={`w-40 h-16 border-2 rounded-full flex items-center justify-center transition-colors 
                         ${borderStyle} 
                         ${isOver ? 'border-blue-500 bg-blue-100' : `${borderColor} bg-gray-50`}
                        `}
            >
                {droppedItem && (
                    <span
                        className="text-2xl font-semibold text-gray-800"
                        style={{ fontFamily: "'Scheherazade New', serif" }}
                    >
                        {droppedItem.name}
                    </span>
                )}
            </div>
        );
    }

    // --- بناء واجهة المستخدم الرئيسية ---
    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className={styles.pageContainer}>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@600;700&display=swap" rel="stylesheet" />
                    <title>التمرين التمهيدي عدد 02</title>
                </Head>

                <Header />
                <main className={styles.exerciseContainer}>
                    <div className={styles.exerciseContent}>
                        <h1 className={styles.exerciseTitle}>التمرين التمهيدي عدد 02</h1>
                        <div className={styles.exerciseBody}>
                            <div dir="rtl" className={`${styles.mainContent} relative`} >
                                {/* السؤال مع الرقم */}
                                <h2 className="flex items-center justify-start gap-3 mb-12">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DD2946] text-white text-base font-bold"> 2 </span>
                                    {/* *** تعديل: تغيير نص السؤال *** */}
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: '#DD2946', fontFamily: "'Scheherazade New', serif" }}
                                    >
                                        أَضَعُ اِسْمَ ٱللَّوْنِ ٱلْمُنَاسِبِ تَحْتَ كُلِّ دَائِرَةٍ
                                    </span>
                                </h2>
                                <div className="exercise-area flex flex-col items-center gap-12">
                                    {/* 1. حاوية أسماء الألوان القابلة للسحب */}
                                    <div className="color-names-container flex flex-wrap justify-center gap-4 p-4 min-h-[80px]">
                                        {draggableItems.map((color) => (<DraggableColor key={color.id} color={color} />))}
                                        {draggableItems.length === 0 && (<p className="text-gray-500">تم سحب كل الألوان!</p>)}
                                    </div>
                                    {/* 2. حاوية الدوائر الملونة ومناطق الإسقاط */}
                                    <div className="color-targets-container w-full max-w-2xl grid grid-cols-3 gap-x-8 gap-y-10">
                                        {displayOrderColors.map((color) => (
                                            <div key={color.id} className="flex flex-col items-center">
                                                <div className={`w-20 h-20 rounded-full ${color.colorClass} shadow-md mb-3`}></div>
                                                <DroppableZone colorId={color.id} droppedItem={droppedItems[`dropzone-${color.id}`] || null} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ExerciseSidebar onUndoClick={handleUndo} onResetClick={handleReset} />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </DndContext>
    );
}
