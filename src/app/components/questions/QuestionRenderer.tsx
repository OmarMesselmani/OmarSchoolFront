// src/app/components/questions/QuestionRenderer.tsx

import React from 'react';
import { QuestionConfig } from '@/app/config/exerciseConfig';
import TextDisplay from './text-question/TextQuestion';
import MatchingQuestion from './matching-question/MatchingQuestion';
import DragDropQuestion from './drag-drop-question/DragDropQuestion';
import MultipleChoiceQuestion from './multiple-choice-question/MultipleChoiceQuestion';
import ColoringBoxes from './coloring-boxes/ColoringBoxes';

interface QuestionRendererProps {
  questionConfig: QuestionConfig;
  exerciseAssets?: any;
}

export default function QuestionRenderer({ questionConfig, exerciseAssets }: QuestionRendererProps) {
  switch (questionConfig.type) {
    case 'text-display':
      return (
        <TextDisplay
          questionNumber={questionConfig.questionNumber}
          questionTitle={questionConfig.questionTitle}
          textContent=""
          imageUrl={exerciseAssets?.textImage}
        />
      );

    case 'matching':
      return (
        <MatchingQuestion
          items={questionConfig.content.items}
          images={questionConfig.content.images}
          questionNumber={questionConfig.questionNumber}
        />
      );

    case 'drag-drop':
      return (
        <DragDropQuestion
          draggableItems={questionConfig.content.draggableItems}
          dropZones={questionConfig.content.dropZones}
          questionNumber={questionConfig.questionNumber}
          questionTitle={questionConfig.questionTitle}
        />
      );

    case 'mcq':
      return (
        <MultipleChoiceQuestion
          question={questionConfig.content.question}
          options={questionConfig.content.options}
          image={questionConfig.content.image}
          questionNumber={questionConfig.questionNumber}
          questionTitle={questionConfig.questionTitle}
        />
      );

    case 'coloring-boxes':
      return (
        <ColoringBoxes
          content={questionConfig.content}
          questionNumber={questionConfig.questionNumber}
          questionTitle={questionConfig.questionTitle}
        />
      );

    default:
      return <div>نوع السؤال غير مدعوم</div>;
  }
}