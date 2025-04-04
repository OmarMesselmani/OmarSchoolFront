import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const subjects = [
    { name: 'القراءة والفهم', color: '#EF4444', values: [15, 17, 11] },
    { name: 'الرياضيات', color: '#8B5CF6', values: [15, 16, 18] },
    { name: 'الإيقاظ العلمي', color: '#3B82F6', values: [16, 20, 18.5] },
    { name: 'التربية الإسلامية', color: '#10B981', values: [14, 12.5, 17] },
    { name: 'الإنتاج الكتابي', color: '#F59E0B', values: [12, 15, 20] },
];

const terms = ['الثلاثي الأول', 'الثلاثي الثاني', 'الثلاثي الثالث'];

const Chart = () => {
    const data = {
        labels: terms,
        datasets: subjects.map(subject => ({
            label: subject.name,
            data: subject.values,
            borderColor: subject.color,
            backgroundColor: subject.color,
            tension: 0.4,
            pointRadius: 3,        // حجم النقطة العادي
            pointHoverRadius: 5,   // حجم النقطة عند المرور عليها
            borderWidth: 3,
            fill: false
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            y: {
                min: 0,
                max: 21, // زيادة القيمة القصوى لإتاحة مساحة للنقاط
                ticks: {
                    stepSize: 1,
                    font: {
                        family: "'Tajawal', sans-serif", // تصحيح اسم الخط
                        size: 12
                    },
                    padding: 10, // إضافة padding للأرقام
                    // عرض فقط الأرقام حتى 20
                    callback: function(value: number) {
                        return value <= 20 ? value : '';
                    },
                },
                grid: {
                    color: function(context: any) {
                        return context.tick.value <= 20 ? 'rgba(0, 0, 0, 0.1)' : 'transparent';
                    },
                    drawBorder: false
                },
                border: {
                    display: false
                },
                padding: {
                    top: 15,    // زيادة المساحة من الأعلى
                    bottom: 10  // padding من الأسفل
                }
            },
            x: {
                ticks: {
                    font: {
                        family: "'Tajawal', sans-serif", // تصحيح اسم الخط
                        size: 12
                    },
                    padding: 10 // إضافة padding للكلمات
                },
                grid: {
                    display: false
                },
                padding: {
                    left: 10,   // padding من اليسار
                    right: 10   // padding من اليمين
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
                align: 'center' as const,
                labels: {
                    padding: 25,
                    usePointStyle: true,
                    boxWidth: 6, // تحديد عرض مربع النقطة
                    boxHeight: 6, // تحديد ارتفاع مربع النقطة
                    font: {
                        family: "'Tajawal', sans-serif",
                        size: 14
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#000',
                bodyColor: '#000',
                borderColor: '#ddd',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                callbacks: {
                    label: function(context: any) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                }
            }
        }
    };

    return (
        <div style={{ 
            width: '90%', 
            height: '500px', // تقليل الارتفاع
            margin: '0 auto',
            marginBottom: '20px',
            padding: '10px'
        }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default Chart;