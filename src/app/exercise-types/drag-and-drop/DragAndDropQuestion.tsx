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
import Cookies from 'js-cookie';
import LoadingPage from '@/app/components/loading-page/LoadingPage';
import SubmitAndNextButton from '@/app/components/submit-and-next-button/page';
import { Exercise, ExerciseStatus } from '@/app/data-structures/Exam';
import { Student } from '@/app/data-structures/Student';
import { useParams } from 'next/navigation';

// تعريف واجهة لبيانات الألوان
interface ColorInfo {
    id: string;
    Exercice_id: string;
    name: string;
    color_code: string;
}


// واجهة لتحديد شكل عنصر في تاريخ الحركات
interface MoveHistoryItem {
    dropzoneId: string;
    draggedItem: ColorInfo;
    previousItemInDropzone: ColorInfo | null;
}

// اسم المكون الجديد
export default function DragAndDrop({ exerciseId, student, handleStepChange }: { exerciseId: number, student: Student, handleStepChange?: (step: number) => void }) {
    const [exercise, setExercise] = useState(null);
    const [exerciseQuestion, setExerciseQuestion] = useState('');
    const [exerciseTitle, setExerciseTitle] = useState('');
    const [exerciseFinished, setExerciseFinished] = useState(false);
    const [draggableItems, setDraggableItems] = useState<ColorInfo[]>([]);
    const [allItems, setAllItems] = useState<ColorInfo[]>([]);
    const [status, setStatus] = useState<ExerciseStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [droppedItems, setDroppedItems] = useState<{ [dropzoneId: string]: ColorInfo | null }>({});
    const [history, setHistory] = useState<MoveHistoryItem[]>([]);
    const [isFullLoading, setIsFullLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [dropZones, setDropZones] = useState([]);
    const params = useParams();

    const stringCurrentStep = params?.questionOrder as string;
    const currentStep = parseInt(stringCurrentStep); // تحويل المعامل إلى رقم صحيح
    const examUniqueId = params?.uniqueId as string;
    const handleNextStep = () => {
        if (handleStepChange) {
            handleStepChange(currentStep + 1);
        }
    };

    useEffect(() => {
        const token = Cookies.get("token");
        setIsFullLoading(true);
        fetch(`http://127.0.0.1:8000/student/exercise/exercise-status/${student?.id}/${exerciseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Token ${token}`,
            }
        }).then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setStatus(data);
                    setExerciseFinished(data.finished);
                } else {
                    setError(data.error || "Unknown error occurred.");
                }
                setIsFullLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch exercise status.");
                setIsFullLoading(false);
            });
    }, [exerciseId, student?.id]);




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
                if (!data) return;      // aborted by 401
                setExercise(data.exercise);
                setDraggableItems(data.draggable_items);
                setAllItems(data.draggable_items);
                setDropZones(data.drop_zones);
                setExerciseTitle(data.exercise);
                setExerciseQuestion(data.question);
            })
            .catch(err => console.error(err))
            .finally(() => setIsFullLoading(false));
    }, [exerciseId]);

    const displayDropZones = Array.isArray(dropZones)
        ? dropZones
            .map(zone => {
                const color = allItems.find(item => item.id === zone.correct_item_id);
                return { ...zone, color };
            })
            .filter(zone => zone.color)
        : [];



    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id.toString().startsWith("dropzone-")) {
            const dropzoneId = over.id.toString(); // e.g., "dropzone-3"
            const draggedItemId = active.id.toString().replace("drag-", ""); // Remove the "drag-" prefix
            // Ensure types match: convert IDs to numbers (if needed) when comparing
            const draggedColorInfo = draggableItems.find(
                (c) => parseInt(c.id.toString()) === parseInt(draggedItemId)
            );
            const itemAlreadyInDropzone = droppedItems[dropzoneId] || null;

            // ✅ Prevent dropping if already filled
            if (itemAlreadyInDropzone) {
                console.warn(`Dropzone ${dropzoneId} already has an item`);
                return; // 🚫 Skip if already filled
            }

            // Only record this move if the dragged item is different than any existing one for this dropzone
            if (
                draggedColorInfo &&
                (!droppedItems[dropzoneId] ||
                    droppedItems[dropzoneId].id.toString() !== draggedItemId)
            ) {
                // Instead of sending an API request per move, we simply accumulate the move in a history array.
                setHistory((prevHistory) => [
                    ...prevHistory,
                    {
                        dropzoneId: dropzoneId,
                        draggedItem: draggedColorInfo,
                        previousItemInDropzone: itemAlreadyInDropzone,
                    },
                ]);

                // Update the local state for drop zones (so the dropped item "sticks")
                setDroppedItems((prev) => ({
                    ...prev,
                    [dropzoneId]: draggedColorInfo,
                }));

                // Remove the dragged item from the draggables list.
                setDraggableItems((prev) =>
                    prev.filter(
                        (item) => parseInt(item.id.toString()) !== parseInt(draggedItemId)
                    )
                );
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        // For example, use the droppedItems object to build your payload
        const moves = Object.keys(droppedItems).map((dropzoneKey) => ({
            dropzone_id: dropzoneKey.replace("dropzone-", ""),
            item_id: droppedItems[dropzoneKey].id,
        }));

        try {
            const token = Cookies.get("token");
            const response = await fetch("http://127.0.0.1:8000/student/drag-and-drop/submit-exercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify({
                    student_id: student?.id, // Your logic for student ID
                    exercise_id: exerciseId, // Your logic for exercise ID
                    moves: moves, // The complete array of moves
                    exam_unique_id: examUniqueId, // Pass the exam unique ID if needed
                    current_step: currentStep, // Pass the current step
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setExerciseFinished(true);
                setLoading(false);
                handleNextStep(); // Navigate to the next step if needed
            } else {
                console.error("Submission error:", result.error);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setLoading(false);
        }
    };


    const handleUndo = useCallback(() => {
        if (history.length === 0) {
            return;
        }
        const lastMove = history[history.length - 1];
        setDroppedItems(prev => ({
            ...prev,
            [lastMove.dropzoneId]: lastMove.previousItemInDropzone,
        }));
        setDraggableItems(prev => {
            let newDraggables = [...prev, lastMove.draggedItem];
            if (lastMove.previousItemInDropzone) {
                newDraggables = newDraggables.filter(item => item.id !== lastMove.previousItemInDropzone!.id);
            }
            return newDraggables.sort((a, b) => draggableItems.findIndex(c => c.id === a.id) - draggableItems.findIndex(c => c.id === b.id));
        });
        setHistory(prevHistory => prevHistory.slice(0, -1));
    }, [history, draggableItems]);

    const handleReset = useCallback(() => {
        setDraggableItems(allItems);
        setDroppedItems({});
        setHistory([]);
    }, [draggableItems]);

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

    if (isFullLoading) {
        return <LoadingPage />;
    } else if ((allItems?.length ?? 0) === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Header />
                <main className="flex-grow flex items-center justify-center text-2xl text-gray-600">
                    لا توجد بيانات هنا
                </main>
            </div>
        );
    }
    else {
        return (
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>

                <ExerciseSidebar onUndoClick={handleUndo} onResetClick={handleReset} />

                <div dir="rtl" className={`${styles.mainContent} relative`} >
                    {/* السؤال مع الرقم */}
                    <h2 className="flex items-center justify-start gap-3 mb-12">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DD2946] text-white text-base font-bold"> {currentStep + 1} </span>
                        {/* *** تعديل: تغيير نص السؤال *** */}
                        <span
                            className="text-2xl font-bold"
                            style={{ color: '#DD2946', fontFamily: "'Scheherazade New', serif" }}
                        >
                            {exerciseQuestion}
                        </span>
                    </h2>
                    <div className="exercise-area flex flex-col items-center gap-12">
                        {/* 1. حاوية أسماء الألوان القابلة للسحب */}
                        <div className="color-names-container flex flex-wrap justify-center gap-4 p-4 min-h-[80px]">
                            {(draggableItems || []).map((color) => (
                                <DraggableColor key={color.id} color={color} />
                            ))}

                            {draggableItems?.length === 0 && (
                                <p className="text-gray-500">تم سحب كل الألوان!</p>
                            )}

                        </div>
                        {/* 2. حاوية الدوائر الملونة ومناطق الإسقاط */}
                        <div className="color-targets-container w-full max-w-2xl grid grid-cols-3 gap-x-8 gap-y-10">
                            {displayDropZones.map((zone) => (
                                console.log("Rendering dropzone:", zone),
                                <div key={zone.id} className="flex flex-col items-center">
                                    <p>{zone.color.color_code}</p>
                                    <div className={`w-20 h-20 rounded-full ${zone.color.color_code} shadow-md mb-3`}></div>
                                    <DroppableZone colorId={zone.color.id.toString()} droppedItem={droppedItems[`dropzone-${zone.color.id}`] || null} />
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
                <SubmitAndNextButton
                    isFinished={exerciseFinished}
                    isLoading={loading}
                    onClick={handleSubmit}
                    isLastQuestion={false}
                />
            </DndContext>
        );
    }
}
