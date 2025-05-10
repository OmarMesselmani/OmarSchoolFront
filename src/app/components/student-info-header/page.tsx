// المسار المقترح: src/app/dashboardUser/components/StudentInfoHeader.tsx

import React, { useEffect } from 'react';
import styles from './page.module.css';
import Cookies from 'js-cookie';
import { Student } from '@/app/data-structures/Student';

interface StudentInfoHeaderProps {
  childID: number; // معرف الطفل
  studentName: string;
  schoolLevel: string;
  age: number | string; // يمكن أن يكون رقمًا أو نصًا مثل "غير محدد"
  uniqueId: string;
}


const StudentInfoHeader: React.FC<StudentInfoHeaderProps> = ({
  childID,
  studentName,
  schoolLevel,
  age,
  uniqueId,
}) => {

  const [student, setStudent] = React.useState<Student>(); // تعريف الحالة students
  async function getStudentsById() {
    try {
      const token = Cookies.get('token');

      const response = await fetch(`http://127.0.0.1:8000/parent/get-selected-student`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch students.");
      }

      const data = await response.json();
      setStudent(data.student); // تعيين البيانات المسترجعة
    } catch (error: any) {
      console.error("Error fetching students:", error.message);
      throw error;
    }
  }
  useEffect(() => {
    getStudentsById()
  }, [])
  return (
    <div className={styles.infoHeaderContainer}>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>اسم التلميذ:</span>
        <span className={styles.infoValue}>{`${student?.name} ${student?.surname}`} </span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>المستوى التعليمي:</span>
        <span className={styles.infoValue}>{student?.current_level_name}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>عمره:</span>
        {/* إضافة كلمة سنوات */}
        <span className={styles.infoValue}>
          {student?.age} {Number(student?.age) > 10 || Number(student?.age) === 1 ? "سنة" : "سنوات"}
        </span>

      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>المعرف الوحيد:</span>
        <span className={styles.infoValue}>{student?.unique_id}</span>
      </div>
    </div>
  );
};

export default StudentInfoHeader;

