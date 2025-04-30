// الملف: components/ai-talker/AiTalker.tsx

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import robotAnimation from './robot-static.json';
import styles from './page.module.css';
import TypingEffectText from '../typing-effect-text/page';
import { IoClose } from "react-icons/io5";

// واجهة للزر
interface DialogButton {
  text: string;
  action: string;
  primary: boolean;
}

// واجهة للمكون
interface AiTalkerProps {
  exerciseType?: string;
  onHelpRequest?: () => void;
  onExplainRequest?: () => void;
}

// واجهة للرسالة
interface Message {
  text: string;
  sender: 'bot' | 'user';
  time: string;
  showActions?: boolean;
  hasBeenSeen?: boolean;
}

const AiTalker: React.FC<AiTalkerProps> = ({
  exerciseType = "reading",
  onHelpRequest,
  onExplainRequest
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  
  // حالات للبيانات من JSON
  const [dialogData, setDialogData] = useState<any>(null);
  const [currentButtons, setCurrentButtons] = useState<DialogButton[]>([]);
  
  // تحميل بيانات الحوار
  useEffect(() => {
    console.log("جاري تحميل بيانات الحوار...");
    
    const loadDialogData = async () => {
      try {
        // محاولة تحميل ملف common.json
        const response = await fetch('/data/robo-dialogs/common.json');
        
        if (response.ok) {
          const data = await response.json();
          console.log("تم تحميل البيانات بنجاح:", data);
          setDialogData(data);
          
          // تعيين الأزرار الافتراضية من البيانات المحملة
          if (data.buttons && data.buttons.welcome) {
            setCurrentButtons(data.buttons.welcome);
          }
        } else {
          console.error("خطأ في تحميل الملف:", response.status);
        }
      } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
      }
    };
    
    loadDialogData();
  }, []);
  
  // تحريك التمرير للأسفل عند إضافة رسائل جديدة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // تحريك الروبوت عند النقر عليه
  const animateRobot = () => {
    if (lottieRef.current) { 
      lottieRef.current.goToAndPlay(0); 
      lottieRef.current.setSpeed(1.2); 
      setTimeout(() => { 
        if (lottieRef.current) lottieRef.current.setSpeed(0.7); 
      }, 1000); 
    }
  };
  
  // إضافة رسالة من الروبوت
  const addBotMessage = (text: string, showActions = false) => {
    setIsTyping(true);
    setShowActionButtons(false);
    
    setTimeout(() => {
      const now = new Date();
      setMessages(prev => [...prev, {
        text,
        sender: 'bot',
        time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
        showActions,
        hasBeenSeen: false
      }]);
      setIsTyping(false);
    }, 700);
  };
  
  // إضافة رسالة من المستخدم
  const addUserMessage = (text: string) => {
    const now = new Date();
    setMessages(prev => [...prev, {
      text,
      sender: 'user',
      time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
    }]);
  };
  
  // فتح نافذة الدردشة
  const openChat = () => {
    animateRobot();
    setShowChatWindow(true);
    
    // إذا كانت المحادثة فارغة، ابدأ بالسؤال الافتراضي
    if (messages.length === 0) {
      // استخدام الرسالة من الملف المحمل إن وجدت
      const welcomeMessage = dialogData?.welcome || "مرحباً! أنا روبو. كيف يمكنني مساعدتك؟";
      addBotMessage(welcomeMessage, true);
    }
  };
  
  // إغلاق نافذة الدردشة
  const closeChat = () => {
    setMessages(prev => prev.map(msg => ({
      ...msg,
      hasBeenSeen: true
    })));
    setShowActionButtons(false);
    setShowChatWindow(false);
  };
  
  // معالجة نقرات الأزرار
  const handleButtonClick = (action: string) => {
    // البحث عن معلومات الزر المضغوط
    const buttonClicked = currentButtons.find(btn => btn.action === action);
    if (!buttonClicked) return;
    
    // إضافة رسالة المستخدم
    addUserMessage(buttonClicked.text);
    
    // إضافة رد الروبوت بناءً على الإجراء
    if (dialogData?.responses && dialogData.responses[action]) {
      addBotMessage(dialogData.responses[action], false);
    } else {
      switch (action) {
        case 'explain_exercise':
          addBotMessage("هذا التمرين يهدف إلى مساعدتك على فهم المفاهيم الأساسية.", false);
          if (onExplainRequest) onExplainRequest();
          break;
          
        case 'farewell':
          addBotMessage("حسنا! حظا موفقا في إجرائك للتمارين", false);
          break;
          
        default:
          addBotMessage("هل يمكنني مساعدتك في شيء آخر؟", false);
      }
    }
    
    // تحديث الأزرار القادمة إن وجدت
    if (dialogData?.buttons && dialogData.buttons[action]) {
      setCurrentButtons(dialogData.buttons[action]);
    } else {
      setCurrentButtons([]);
    }
  };
  
  // إغلاق النافذة عند النقر خارجها
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dialogRef.current && 
        !dialogRef.current.contains(event.target as Node) && 
        showChatWindow && 
        event.target instanceof Element && 
        !event.target.closest(`.${styles.robotWrapper}`)
      ) {
        closeChat();
      }
    };
    
    if (showChatWindow) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showChatWindow]);

  return (
    <>
      {/* نافذة الدردشة */}
      {showChatWindow && (
        <div className={styles.dialogContainer} ref={dialogRef}>
          {/* رأس النافذة */}
          <div className={styles.dialogHeader}>
            <div className={styles.headerInfo}>
              <img
                src="/roboIcon.jpg"
                alt="روبو"
                className={styles.headerAvatar}
              />
              <div className={styles.headerText}>
                <span className={styles.headerName}>روبو</span>
                <span className={styles.headerSubtitle}>مساعدك الذكي</span>
              </div>
            </div>
            <button
              onClick={closeChat}
              className={styles.headerCloseButton}
              aria-label="إغلاق الدردشة"
            >
              <IoClose size={20} />
            </button>
          </div>
          
          {/* منطقة المحادثة */}
          <div className={styles.dialogContentWrapper}>
            {/* عرض الرسائل */}
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`${styles.messageContainer} ${
                  msg.sender === 'bot' ? styles.botMessage : styles.userMessage
                }`}
              >
                {/* صورة المرسل */}
                <img
                  src={msg.sender === 'bot' ? "/roboIcon.jpg" : "/boy-avatar.png"}
                  alt={msg.sender === 'bot' ? "روبو" : "أنت"}
                  className={styles.messageSenderAvatar}
                />
                
                {/* فقاعة الرسالة */}
                <div className={`${styles.messageBubble} ${
                  msg.sender === 'bot' ? styles.botBubble : styles.userBubble
                }`}>
                  {msg.sender === 'bot' && !msg.hasBeenSeen ? (
                    <TypingEffectText 
                      paragraphs={[msg.text]} 
                      speed={25} 
                      initialDelay={0}
                      cursorDisappearDelay={1000}
                      onTypingComplete={() => {
                        setMessages(prev => prev.map((m, i) => 
                          i === index ? { ...m, hasBeenSeen: true } : m
                        ));
                        
                        // إظهار الأزرار إذا كانت آخر رسالة وتحتوي على خاصية showActions
                        if (
                          index === messages.length - 1 && 
                          msg.showActions
                        ) {
                          setShowActionButtons(true);
                        }
                      }}
                    />
                  ) : (
                    msg.text
                  )}
                  <div className={styles.messageTime}>{msg.time}</div>
                </div>
              </div>
            ))}
            
            {/* أزرار التفاعل الديناميكية */}
            {messages.length > 0 && 
             messages[messages.length - 1].sender === 'bot' && 
             messages[messages.length - 1].showActions && 
             showActionButtons && 
             currentButtons.length > 0 && (
              <div className={styles.actionButtonsWrapper}>
                <div className={styles.messageBubbleActions}>
                  {currentButtons.map((button, index) => (
                    <button 
                      key={index}
                      onClick={() => handleButtonClick(button.action)} 
                      className={`${styles.bubbleButton} ${button.primary ? styles.primary : ''}`}
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* مؤشر الكتابة */}
            {isTyping && (
              <div className={`${styles.messageContainer} ${styles.botMessage}`}>
                <img
                  src="/roboIcon.jpg"
                  alt="روبو"
                  className={styles.messageSenderAvatar}
                />
                <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typingBubble}`}>
                  <span className={styles.typingDot}></span>
                  <span className={styles.typingDot}></span>
                  <span className={styles.typingDot}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      
      {/* أيقونة الروبوت المثبتة */}
      <div 
        className={styles.robotWrapper} 
        onClick={openChat}
        aria-label="روبو المساعد الذكي"
      >
        <Lottie 
          animationData={robotAnimation} 
          lottieRef={lottieRef}
          className={styles.robotAnimation}
          autoplay={false}
          loop={true}
        />
      </div>
    </>
  );
};

export default AiTalker;