// المسار: src/app/dashboardUser/pages/DashboardOverview/page.tsx

'use client';

import React, { CSSProperties } from 'react';
import { HiChevronLeft } from "react-icons/hi";
import overviewStyles from './page.module.css'; // استيراد CSS
import DashboardCard from '@/app/components/dashboard-card/page';
import SubjectProgressCardContent from '@/app/components/subject-progress-card-content/page';
import StudentInfoHeader from '@/app/components/student-info-header/page';
import SubjectStatsChart from '@/app/components/subject-stats-chart/page';
import MiniCalendar from '@/app/components/mini-calendar/page';
// --- استيراد المكون الجديد لتأثير الكتابة ---
import TypingEffectText from '@/app/components/typing-effect-text/page'; // تأكد من المسار الصحيح

// --- واجهة Props (تستقبل selectedChildId فقط) ---
interface DashboardOverviewProps {
  selectedChildId: string;
}

// --- Interfaces and Mock Data (معرفة داخل المكون كما قدمتها) ---
// ملاحظة: يفضل استيراد هذه البيانات من ملف مشترك
interface StudentData { name: string; level: string; age: number; uniqueId: string; }
interface StudentDetailsMap { [key: string]: StudentData; }

const mockProgressData = [ { subject: 'الرياضيات', unit: 'أتعرف مجموعات حسب التقابل', progress: 65, id: 'math' }, { subject: 'الإيقاظ العلمي', unit: 'تعيين موقع جسم بالنسبة إلى جسم آخر أو معلم في المكان', progress: 30, id: 'science' }, { subject: 'القراءة', unit: 'يحدد أحداث النص وشخصياته، والأزمنة والأمكنة الواردة فيه', progress: 85, id: 'reading' }, { subject: 'الانتاج الكتابي', unit: 'تنظيم عناصر جملة', progress: 45, id: 'writing' }, ];
const mockStudentDetails: StudentDetailsMap = { 'child1': { name: 'التلميذ الأول', level: 'السنة الأولى', age: 6, uniqueId: '123456789123' }, 'child2': { name: 'التلميذ الثاني', level: 'السنة الثالثة', age: 8, uniqueId: '987654321987' }, 'child3': { name: 'التلميذ الثالث', level: 'السنة الخامسة', age: 10, uniqueId: '112233445566' }, '': { name: 'لم يختر', level: '-', age: 0, uniqueId: 'N/A' } };
const subjectCardBgColors: { [key: string]: string } = { math: '#D1FAE5', science: '#EDE9FE', reading: '#DBEAFE', writing: '#FFEDD5', };
const subjectTitleBgColors: { [key: string]: string } = { math: '#059669', science: '#6D28D9', reading: '#2563EB', writing: '#F97316', };
const defaultCardBgColor = '#ffffff';
const mockSubjectChartData: { [key: string]: number[] } = { math: [15, 12, 18, 16, 19, 17], science: [14, 11, 16, 15, 17, 18], reading: [17, 18, 15, 19, 20, 16], writing: [10, 12, 15, 14, 16, 13], };
const welcomeParagraphs = [
  "مرحباً بيك في عمر سكول! عمر سكول هي أول منصة تعليمية تونسية تفاعلية، مدعومة بالذكاء الاصطناعي وبطريقة مبتكرة. منصتنا تقوم بالتقييم الآلي والشامل لتقدم تلميذك وتساعدك باش تعرف بالضبط النقائص إلي لازم يركز عليها.",
  "أحنا نؤمنوا بالجيل الجديد وبالتعليم الذكي، ونسعاو إن صغيرك يستفيد بالحق من الأجهزة الحديثة في مراجعة دروسه، وما تكونش مجرد أداة للعب وتضييع الوقت.",
  "كيف يخدم صغيرك التمارين والامتحانات على المنصة، نقوم بجمع البيانات وتحليل أجوبته بدقة. بناءً على هذا التحليل، نقدمولك تقرير واضح حول المسائل إلي تستحق تركيز أكبر، مما يضمن تحسن مردوديته ونتائجه الدراسية."
];
// --- نهاية البيانات ---


export default function DashboardOverview({ selectedChildId }: DashboardOverviewProps) { // استقبال selectedChildId

  // --- البحث عن بيانات الطالب داخل المكون ---
  const selectedStudentData = mockStudentDetails[selectedChildId] || mockStudentDetails[''];
  // --- نهاية البحث ---

  const handleContinueClick = (subjectId: string) => { console.log(`Continue ${subjectId}`); };
  const statsSubjectsOrder = ['math', 'reading', 'writing', 'science'];
  const orderedSubjectsData = statsSubjectsOrder
    .map(id => mockProgressData.find(item => item.id === id))
    .filter((item): item is typeof mockProgressData[0] => item !== undefined);

  return (
    <div className={overviewStyles.overviewContainer}>
      {/* === قسم معلومات التلميذ === */}
      <div className={overviewStyles.fullWidthSpan}>
         {/* التأكد من وجود بيانات قبل العرض */}
         {selectedStudentData && (
             <StudentInfoHeader
                 studentName={selectedStudentData.name}
                 schoolLevel={selectedStudentData.level}
                 age={selectedStudentData.age}
                 uniqueId={selectedStudentData.uniqueId}
             />
         )}
      </div>

      {/* === قسم بطاقات التقدم === */}
      <div className={`${overviewStyles.cardsGrid} ${overviewStyles.fullWidthSpan}`}>
        {mockProgressData.map((data) => {
          const cardBgColor = subjectCardBgColors[data.id] || '#ffffff';
          const titleBgColor = subjectTitleBgColors[data.id] || '#cccccc';
          const hashtag = data.id === 'reading' ? '#الثلاثي_الثاني' : '#الثلاثي_الأول';
          return (
            <DashboardCard
              key={data.id}
              title={data.subject}
              style={{'--card-bg-color': cardBgColor, '--title-bg-color': titleBgColor} as React.CSSProperties}
              hashtag={hashtag}
            >
              <SubjectProgressCardContent
                unit={data.unit}
                progress={data.progress}
                onContinueClick={() => handleContinueClick(data.id)}
                subjectId={data.id}
              />
            </DashboardCard>
          );
        })}
      </div>

      {/* === قسم الامتحانات === */}
      <div className={overviewStyles.examsSection}>
        <DashboardCard
          title="الامتحانات والتقاييم"
          style={{'--card-bg-color': '#ffffff', '--title-bg-color': '#151313'} as React.CSSProperties}
        >
          <div className={overviewStyles.examsList}>
            {(() => {
              const desiredOrder = ['science', 'math', 'reading', 'writing'];
              const orderedExamsData = desiredOrder.map(id => mockProgressData.find(item => item.id === id)).filter(item => item !== undefined);
              return orderedExamsData.map((data) => {
                if (!data) return null;
                let examUnitText = '';
                switch (data.id) {
                  case 'math': examUnitText = 'امتحان الثلاثي الأول - نموذج عدد 01'; break;
                  case 'science': examUnitText = 'تقييم الفترة الثانية - نموذج عدد 02'; break;
                  case 'reading': examUnitText = 'امتحان الثلاثي الأول - نموذج عدد 01'; break;
                  case 'writing': examUnitText = 'تقييم الفترة الأولى - نموذج عدد 01'; break;
                  default: examUnitText = data.unit;
                }
                const hashtag = data.id === 'reading' ? '#الثلاثي_الثاني' : '#الثلاثي_الأول';
                return (
                  <div key={data.id} className={overviewStyles.examItem} style={{backgroundColor: subjectCardBgColors[data.id] || '#ffffff'}}>
                    <div className={overviewStyles.examHeader}>
                      <h3 className={overviewStyles.examSubject} style={{ backgroundColor: subjectTitleBgColors[data.id] }}>{data.subject}</h3>
                      <div className={overviewStyles.examHashtagContainer}><span className={overviewStyles.hashtag}>{hashtag}</span></div>
                    </div>
                    <div className={overviewStyles.examContent}><p className={overviewStyles.examUnit}>{examUnitText}</p><HiChevronLeft className={overviewStyles.examLinkIcon} /></div>
                  </div>);
              });
            })()}
          </div>
        </DashboardCard>
      </div>


      {/* ========== المنطقة الجديدة ========== */}
      <div className={overviewStyles.newCardsSection}>
        {/* === بطاقة الإحصائيات === */}
        <DashboardCard
            className={overviewStyles.statsCard}
            style={{ '--card-bg-color': defaultCardBgColor } as React.CSSProperties}
        >
            <div className={overviewStyles.statsGridContainer}>
                {orderedSubjectsData.map((data) => (
                    <div key={data.id} className={overviewStyles.statsSubjectBlock} style={{ backgroundColor: subjectCardBgColors[data.id] || '#f3f4f6' }}>
                        <div className={overviewStyles.statsContentArea}>
                            <SubjectStatsChart subjectColor={subjectTitleBgColors[data.id] || '#4B5563'} chartData={mockSubjectChartData[data.id] || []} />
                        </div>
                        <span className={overviewStyles.statsSubjectName} style={{ color: subjectTitleBgColors[data.id] || '#1f2937' }}>
                            {data.subject}
                        </span>
                    </div>
                ))}
            </div>
        </DashboardCard>

        {/* === حاوية البطاقتين السفليتين === */}
        <div className={overviewStyles.bottomCardsContainer}>

          {/* === البطاقة اليسرى (النص التفاعلي) === */}
           <DashboardCard
                style={{ '--card-bg-color': defaultCardBgColor } as React.CSSProperties}
           >
                <div className={overviewStyles.welcomeCardContent}>
                  <TypingEffectText paragraphs={welcomeParagraphs} />
                </div>
           </DashboardCard>
          {/* === نهاية البطاقة اليسرى === */}


          {/* === البطاقة اليمنى (التقويم) === */}
          <DashboardCard
            className={overviewStyles.calendarCard}
            style={{ '--card-bg-color': defaultCardBgColor } as React.CSSProperties}
          >
             <MiniCalendar />
          </DashboardCard>
          {/* === نهاية البطاقة اليمنى === */}

        </div>
        {/* === نهاية حاوية البطاقتين السفليتين === */}

      </div>
      {/* ========== نهاية المنطقة الجديدة ========== */}

    </div> // نهاية overviewContainer
  );
}