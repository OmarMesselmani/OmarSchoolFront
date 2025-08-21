// src/app/components/questions/QuestionRenderer.tsx

import React from 'react';
import { questionConfig } from '@/app/config/exerciseConfig';
import TextDisplay from './text-question/TextQuestion';
import MatchingQuestion from './matching-question/MatchingQuestion';
import DragDropQuestion from './drag-drop-question/DragDropQuestion';
import MultipleChoiceQuestion from './multiple-choice-question/MultipleChoiceQuestion';
import ColoringBoxes from './coloring-boxes/ColoringBoxes';
import CrossOutQuestion from './cross-out-question/CrossOutQuestion';
import CollapsedText from './collapsed-text/CollapsedText';
import DragAndDrop from '@/app/exercise-types/drag-and-drop/DragAndDropQuestion';
import { Exercise } from '@/app/data-structures/Exam';
import { Student } from '@/app/data-structures/Student';

interface QuestionRendererProps {
  exerciseData: Exercise;
  handleStepChange?: (step: number) => void; // إضافة هذا
  student: Student; // إضافة خاصية الطالب
  // questionConfig?: QuestionConfig;
  // exerciseAssets?: any;
  onAnswerChange?: (questionId: string, answer: any) => void; // إضافة هذا
}



export default function QuestionRenderer({
  exerciseData,
  handleStepChange,
  student,
}: QuestionRendererProps) {
  switch (exerciseData?.exercise_type?.name) {
    case 'image-reading-segment':
      return (
        <TextDisplay
          handleStepChange={handleStepChange}
          exerciseId={exerciseData?.id}
          student={student}
        />
      );

    case 'two-columns-matching':
      return (
        <MatchingQuestion
          exerciseId={exerciseData?.id}
          student={student}
          handleStepChange={handleStepChange}
          questionNumber={questionConfig.questionNumber}
          questionTitle={questionConfig.questionTitle}
        />
      );

    case 'drag-and-drop':
      return (
        <DragAndDrop
          handleStepChange={handleStepChange}
          exerciseId={exerciseData?.id}
          student={student}
        />
      );

    // case 'mcq':
    //   return (
    //     <MultipleChoiceQuestion
    //       question={questionConfig.content.question}
    //       options={questionConfig.content.options}
    //       image={questionConfig.content.image}
    //       questionNumber={questionConfig.questionNumber}
    //       questionTitle={questionConfig.questionTitle}
    //     />
    //   );

    case 'coloring-boxes':
      return (
        <div>
          {/* {questionConfig.assets?.textImage && (
            <CollapsedText
              textImage={questionConfig.assets.textImage}
              title="عرض السند"
            />
          )}

          <ColoringBoxes
            content={{
              vocabulary: questionConfig.content.vocabulary,
              targetSentence: questionConfig.content.targetSentence
            }}
            questionNumber={questionConfig.questionNumber}
            questionTitle={questionConfig.questionTitle}
            onComplete={onAnswerChange ? (selectedWords) => {
              onAnswerChange(questionConfig.questionId, selectedWords);
            } : undefined}
          /> */}
        </div>
      );

    // case 'cross-out':
    //   return (
    //     <div>
    //       {(questionConfig.assets?.textImage || exerciseAssets?.textImage) && (
    //         <CollapsedText
    //           textImage={questionConfig.assets?.textImage || exerciseAssets?.textImage}
    //           title="عرض السند"
    //         />
    //       )}

    //       <CrossOutQuestion
    //         content={questionConfig.content}
    //         questionNumber={questionConfig.questionNumber}
    //         questionTitle={questionConfig.questionTitle}
    //       />
    //     </div>
    //   );

    // case 'word-matching':
    //   return (
    //     <MatchingQuestion
    //       items={questionConfig.content.leftWords}
    //       images={questionConfig.content.rightWords.map(word => ({
    //         id: word.id,
    //         text: word.text
    //       }))}
    //       questionNumber={questionConfig.questionNumber}
    //       questionTitle={questionConfig.questionTitle}
    //       correctMatches={questionConfig.content.correctMatches}
    //     />
    //   );

    default:
      return <div>نوع السؤال غير مدعوم</div>;
  }
}