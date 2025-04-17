// المسار: src/app/components/subject-stats-chart/page.tsx
'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SubjectStatsChartProps {
  subjectColor?: string;
  chartData?: number[];
}

const SubjectStatsChart: React.FC<SubjectStatsChartProps> = ({
  subjectColor = '#4B5563',
  chartData = [],
}) => {

  const data = { /* ... بياناتك الحالية ... */
    labels: ['', '', '', '', '', ''],
    datasets: [ { label: 'Dataset 1', data: chartData.length === 6 ? chartData : [0, 0, 0, 0, 0, 0], backgroundColor: subjectColor, borderColor: subjectColor, borderWidth: 0, barThickness: 15, borderRadius: 5, categoryPercentage: 0.95, barPercentage: 0.5, } ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        display: true,          // المحور ظاهر للسماح بعرض الأرقام والشبكة
        border: {
          display: false,       // إخفاء خط المحور العمودي
        },
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: false,       // إخفاء علامات التجزئة الصغيرة
          // <<< التعديل: زيادة سمك وغمق لون الخطوط >>>
          color: 'rgba(0, 0, 0, 0.3)', // زيادة الغمق (أو استخدم #cccccc أو #bbbbbb)
          lineWidth: 1,           // سمك الخط (يمكن زيادته إلى 1.5 أو 2 إذا لزم الأمر)
          // <<< نهاية التعديل >>>
        },
        beginAtZero: true,
        max: 20,
        ticks: {
           // <<< التعديل: إظهار الأرقام وتنسيقها >>>
          display: true,       // 1. إظهار الأرقام (0, 10, 20)
          stepSize: 10,
          color: '#555555',    // 2. لون الأرقام (رمادي داكن)
          padding: 5,         // 3. مسافة بين الرقم ومنطقة الرسم
          font: {
            size: 10,         // 4. حجم خط الأرقام
            family: "'Tajawal', sans-serif" // استخدام نفس الخط إذا أردت
          }
          // <<< نهاية التعديل >>>
        }
      },
    },
    layout: { padding: 3 }
  };

  return (
    <div style={{ position: 'relative', height: '100%', maxWidth: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default SubjectStatsChart;