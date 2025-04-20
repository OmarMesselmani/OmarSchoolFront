// المسار: src/app/components/mini-calendar/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from '@/app/dashboard-user/pages/dashboard-overview/page.module.css';
import holidayData from '@/app/data/holidays.json'; // تأكد من صحة المسار

const tunisianMonthNames = [
  'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
  'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];
const arabicWeekDays = ['أحد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة', 'سبت'];

// --- هياكل البيانات للبيانات المعالجة ---
interface ProcessedSingleHoliday { type: 'single'; date: Date; day: number; month: number; year: number; name: string; }
interface ProcessedHolidayRange { type: 'range'; startDate: Date; endDate: Date; name: string; }

// --- معالجة بيانات JSON وتحويل التواريخ النصية إلى كائنات Date ---
const processedSingleHolidays: ProcessedSingleHoliday[] = holidayData.singleHolidays.map(h => {
  const dateObj = new Date(h.date + 'T00:00:00Z');
  // === تصحيح: إضافة return هنا ===
  return {
    type: 'single',
    date: dateObj,
    day: dateObj.getUTCDate(),
    month: dateObj.getUTCMonth(),
    year: dateObj.getUTCFullYear(),
    name: h.name
  };
  // === نهاية التصحيح ===
});

const processedHolidayRanges: ProcessedHolidayRange[] = holidayData.holidayRanges.map(r => {
  // === تصحيح: إضافة return صريحة (احتياطي) ===
  return {
    type: 'range',
    startDate: new Date(r.startDate + 'T00:00:00Z'),
    endDate: new Date(r.endDate + 'T00:00:00Z'),
    name: r.name
  };
  // === نهاية التصحيح ===
});

// --- دالة مساعدة للتحقق (تستخدم البيانات المعالجة) ---
const isDateInHolidayRange = (date: Date): boolean => {
  const checkTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  for (const range of processedHolidayRanges) { // الآن يتم استخدام processedHolidayRanges
    const startTime = Date.UTC(range.startDate.getUTCFullYear(), range.startDate.getUTCMonth(), range.startDate.getUTCDate());
    const endTime = Date.UTC(range.endDate.getUTCFullYear(), range.endDate.getUTCMonth(), range.endDate.getUTCDate());
    if (checkTime >= startTime && checkTime <= endTime) {
      return true;
    }
  }
  // === تصحيح: إضافة return false إذا لم يتم العثور على تطابق ===
  return false;
  // === نهاية التصحيح ===
};
// --- نهاية المعالجة والدوال المساعدة ---

const getStartOfUTCDate = (date: Date): Date => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

const MiniCalendar: React.FC = () => {
  const todayUTC = useMemo(() => getStartOfUTCDate(new Date()), []);
  const [viewDate, setViewDate] = useState(new Date(todayUTC.getFullYear(), todayUTC.getMonth(), 1));

  const { currentYear, currentMonthIndex, currentMonthName } = useMemo(() => {
    const year = viewDate.getFullYear();
    const monthIndex = viewDate.getMonth();
    return {
      currentYear: year,
      currentMonthIndex: monthIndex,
      currentMonthName: tunisianMonthNames[monthIndex],
    };
  }, [viewDate]);

  const holidaysForList = useMemo(() => {
    // هذا الكود يجب أن يعمل الآن بشكل صحيح بعد إصلاح معالجة البيانات أعلاه
    const listItems: { key: string, dateText: string, nameText: string }[] = [];
    const currentMonth = currentMonthIndex;
    const currentYr = currentYear;

    processedSingleHolidays.forEach(h => {
      if (h.month === currentMonth && h.year === currentYr) {
        listItems.push({
          key: `single-${h.day}`,
          dateText: `${h.day} ${tunisianMonthNames[h.month]}`,
          nameText: h.name
        });
      }
    });

    const currentMonthStartDate = new Date(Date.UTC(currentYr, currentMonth, 1));
    const currentMonthEndDate = new Date(Date.UTC(currentYr, currentMonth + 1, 0, 23, 59, 59, 999));
    const currentMonthStart = currentMonthStartDate.getTime();
    const currentMonthEnd = currentMonthEndDate.getTime();

    processedHolidayRanges.forEach(range => {
      const rangeStart = range.startDate.getTime();
      const rangeEnd = range.endDate.getTime();

      if (rangeStart <= currentMonthEnd && rangeEnd >= currentMonthStart) {
        const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', timeZone: 'UTC' };
        const startDateStr = range.startDate.toLocaleDateString('ar-TN-u-ca-gregory', formatOptions);
        const endDateStr = range.endDate.toLocaleDateString('ar-TN-u-ca-gregory', formatOptions);
        listItems.push({
          key: range.name,
          dateText: `${startDateStr} إلى ${endDateStr}`,
          nameText: range.name
        });
      }
    });
    return listItems;
  }, [currentMonthIndex, currentYear]);


  const calendarDays = useMemo(() => {
    // هذا الكود يجب أن يعمل الآن بشكل صحيح
    const TOTAL_CELLS = 42;
    const year = viewDate.getFullYear(); // استخدام المحلي للعرض
    const monthIndex = viewDate.getMonth(); // استخدام المحلي للعرض
    const daysArray = [];

    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, monthIndex, 0);
    const prevMonthDaysCount = prevMonthLastDate.getDate();
    const daysFromPrevMonth = startDayOfWeek;

    // 1. أيام الشهر السابق
    for (let i = daysFromPrevMonth; i > 0; i--) {
        const day = prevMonthDaysCount - i + 1;
        const date = new Date(year, monthIndex - 1, day); // تاريخ محلي
        const isHoliday = isDateInHolidayRange(date); // الدالة تتوقع تاريخاً
        daysArray.push({
            key: `prev-${monthIndex}-${day}`, day: day, isCurrentMonth: false, isToday: false,
            isSunday: date.getDay() === 0, isHoliday: isHoliday, date: date,
        });
    }

    // 2. أيام الشهر الحالي
    const todayUTCTime = todayUTC.getTime();

    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const date = new Date(year, monthIndex, day); // تاريخ محلي
        const dateUTC = getStartOfUTCDate(date); // تحويل لبداية اليوم UTC للمقارنة
        const isToday = dateUTC.getTime() === todayUTCTime;

        const isHolidaySingle = !!processedSingleHolidays.find(h =>
            h.day === day && h.month === monthIndex && h.year === year
        );
        const isHolidayRange = isDateInHolidayRange(date);
        const isHoliday = isHolidaySingle || isHolidayRange;
        daysArray.push({
            key: `current-${monthIndex}-${day}`, day: day, isCurrentMonth: true, isToday: isToday,
            isSunday: date.getDay() === 0, isHoliday: isHoliday, date: date,
        });
    }

    // 3. أيام الشهر التالي
    const daysFilled = daysArray.length;
    const daysFromNextMonth = TOTAL_CELLS - daysFilled;

    for (let i = 1; i <= daysFromNextMonth; i++) {
        const day = i;
        const date = new Date(year, monthIndex + 1, day); // تاريخ محلي
        const isHoliday = isDateInHolidayRange(date);
        daysArray.push({
            key: `next-${monthIndex}-${day}`, day: day, isCurrentMonth: false, isToday: false,
            isSunday: date.getDay() === 0, isHoliday: isHoliday, date: date,
        });
    }

    // 4. تحويل إلى JSX
    return daysArray.map(d => {
        let dayClasses = styles.dayCell;
        if (!d.isCurrentMonth) { dayClasses += ` ${styles.outsideDay}`; }
        if (d.date.getDay() === 0) { dayClasses += ` ${styles.sunday}`; } // استخدام المحلي ليوم الأحد
        if (d.isHoliday) { dayClasses += ` ${styles.holiday}`; }
        if (d.isToday && d.isCurrentMonth) { dayClasses += ` ${styles.today}`; }
        return <div key={d.key} className={dayClasses}>{d.day}</div>;
    });

  }, [viewDate, todayUTC, currentMonthIndex, currentYear]); // استخدام todayUTC


  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  return (
     // JSX لـ return يبقى كما هو
     <div className={styles.calendarLayoutGrid}>
       <div className={styles.holidaysListContainer}>
         <div className={styles.holidaysListTitle}>العطل والأعياد:</div>
         <ul>
           {holidaysForList.length > 0 ? (
             holidaysForList.map(item => ( <li key={item.key}> <span className={styles.holidayDate}>{item.dateText}:</span> {item.nameText} </li> ))
           ) : ( <li>لا توجد عطل لهذا الشهر.</li> )}
         </ul>
       </div>
       <div className={styles.calendarWrapper}>
          <div className={styles.fullCalendarContainer}>
              <div className={styles.calendarHeader}>
                 <button onClick={handlePrevMonth} className={styles.calendarNavButton} aria-label="الشهر السابق"> <FiChevronRight /> </button>
                 <span className={styles.monthYearDisplay}> {currentMonthName} {currentYear} </span>
                 <button onClick={handleNextMonth} className={styles.calendarNavButton} aria-label="الشهر التالي"> <FiChevronLeft /> </button>
             </div>
             <div className={styles.weekdaysGrid}>
                 {arabicWeekDays.map(dayName => ( <div key={dayName} className={`${styles.weekdayName} ${dayName === 'أحد' ? styles.sundayHeader : ''}`}> {dayName} </div> ))}
             </div>
             <div className={styles.daysGrid}> {calendarDays} </div>
         </div>
       </div>
     </div>
   );
};

export default MiniCalendar;