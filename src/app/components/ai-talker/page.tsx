// الملف: components/ai-talker/AiTalker.tsx

'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback
} from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import robotAnimation from './robot-static.json';
import styles from './page.module.css'; // استخدام اسم الملف الموجود لديك
import TypingEffectText from '../typing-effect-text/page'; // تأكد من المسار

const INITIAL_QUESTION = "مرحباً! هل تحتاج مساعدة في حل هذا التمرين؟"; // يمكنك إضافة إيموجي هنا إذا أردت

interface AiTalkerProps {
  exerciseType?: string;
  onHelpRequest?: () => void;
  onExplainRequest?: () => void;
}

const AiTalker: React.FC<AiTalkerProps> = ({
  exerciseType,
  onHelpRequest,
  onExplainRequest
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<string[]>([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
     if (lottieRef.current) { lottieRef.current.setSpeed(0.7); }
  }, []);

  useEffect(() => {
    setIsTypingComplete(false);
  }, [dialogContent]);

  const handleClick = () => {
    if (lottieRef.current) { lottieRef.current.goToAndPlay(0); lottieRef.current.setSpeed(1.2); setTimeout(() => { if (lottieRef.current) lottieRef.current.setSpeed(0.7); }, 1000); }
    const nextShowDialogState = !showDialog;
    setShowDialog(nextShowDialogState);
    if (nextShowDialogState) {
      setDialogContent([INITIAL_QUESTION]);
    } else {
      setDialogContent([]);
    }
  };

  const handleTypingComplete = useCallback(() => {
    if (dialogContent.length === 1 && dialogContent[0] === INITIAL_QUESTION) {
      setIsTypingComplete(true);
    }
  }, [dialogContent]);

  const handleYesClick = () => {
    if (onHelpRequest) {
      onHelpRequest();
    }
    // يمكنك إضافة إيموجي هنا
    setDialogContent([
      "حسنًا!:",
      "هذا التمرين يهدف لمطابقة الكلمات مع الصور المناسبة، اقرأ كل كلمة بعناية واختر الصورة التي تمثلها."
    ]);
  };

  const handleNoClick = () => {
    // يمكنك إضافة إيموجي هنا
    setDialogContent(["حسنا! حظا موفقا 😊"]);
    setTimeout(() => {
      setShowDialog(false);
      setDialogContent([]);
    }, 20000); // التأخير 20 ثانية كما في الكود الذي قدمته
  };

  const handleExplain = () => {
    if (onExplainRequest) {
      onExplainRequest();
    }
     // يمكنك إضافة إيموجي هنا
    setDialogContent([
      "هذا التمرين يهدف لمطابقة الكلمات مع الصور المناسبة.",
      "تأكد من قراءة كل كلمة بعناية قبل اختيار الصورة المطابقة لها."
    ]);
    setShowDialog(true);
  };

  return (
    <div className={styles.robotContainer}>
      {showDialog && (
        <div className={styles.dialogContainer}>
          <div className={styles.dialogContentWrapper}>
            {/* منطقة النص */}
            <div className={styles.dialogTextContent}>
              <TypingEffectText
                key={dialogContent.join('-')}
                paragraphs={dialogContent}
                speed={40}
                initialDelay={300}
                interParagraphDelay={1000}
                onTypingComplete={handleTypingComplete}
                // لا نمرر onContentHeightChange
              />
            </div>

            {/* الأزرار (مشروطة) */}
            {isTypingComplete && (
              <div className={styles.dialogActions}>
                 <button onClick={handleYesClick} className={`${styles.actionButton} ${styles.yesButton}`}>نعم</button>
                 <button onClick={handleNoClick} className={`${styles.actionButton} ${styles.noButton}`}>لا</button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* الروبوت */}
      <div className={styles.robotWrapper} onClick={handleClick} title={`مساعد ذكي لتمارين ${exerciseType || 'المدرسة'}`}>
        <Lottie lottieRef={lottieRef} animationData={robotAnimation} loop={true} autoplay={true} className={styles.robotAnimation} />
      </div>
    </div>
  );
};

export default AiTalker;