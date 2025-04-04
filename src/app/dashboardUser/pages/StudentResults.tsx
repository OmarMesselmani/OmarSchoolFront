'use client';
import React from 'react';
import styles from '../page.module.css';
import Chart from '../dashboard-modules/Chart';
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";

export default function StudentResults() {
  return (
    <div className={styles.mainContent}>
      <div className={styles.infoHeader}>
        <div className={styles.infoContainer}>
          <div className={styles.infoSection}>
            <span className={styles.infoLabel}>اسم التلميذ:</span>
            <span className={styles.infoValue}>محمد بن صالح</span>
          </div>
          <div className={styles.dividerVertical}></div>
          <div className={styles.infoSection}>
            <span className={styles.infoLabel}>القسم الدراسي:</span>
            <span className={styles.infoValue}>السنة الأولى</span>
          </div>
          <div className={styles.dividerVertical}></div>
          <div className={styles.infoSection}>
            <span className={styles.infoLabel}>عمره:</span>
            <span className={styles.infoValue}>8 سنوات</span>
          </div>
          <div className={styles.dividerVertical}></div>
          <div className={styles.infoSection}>
            <span className={styles.infoLabel}>المعرف الوحيد:</span>
            <span className={styles.infoValue}>884654130017</span>
          </div>
        </div>
      </div>

      <div className={styles.newCardsContainer}>
        <div className={styles.rightSection}>
          {/* بطاقة نتائج التلميذ */}
          <div className={styles.resultsCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>نتائج التلميذ</h3>
            </div>
            <div className={styles.cardContent}>
              <Chart />
            </div>
          </div>

          {/* المواد الدراسية */}
          <div className={styles.subjectsSection}>
            {/* بطاقة اللغة العربية */}
            <div id="arabicCard" className={styles.subjectCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>اللغة العربية</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.scoreValue}>16.75</div>
                <div className={styles.percentageContainer}>
                  <span className={styles.percentage}>8%</span>
                  <FaArrowUpLong className={styles.arrowIcon} />
                </div>
              </div>
            </div>

            {/* بطاقة الرياضيات */}
            <div id="mathCard" className={styles.subjectCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>الرياضيات</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.scoreValue}>17.50</div>
                <div className={styles.percentageContainer}>
                  <span className={styles.percentage}>12%</span>
                  <FaArrowUpLong className={styles.arrowIcon} />
                </div>
              </div>
            </div>

            {/* بطاقة المواد العلمية */}
            <div id="scienceCard" className={styles.subjectCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>المواد العلمية</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.scoreValue}>14.25</div>
                <div className={`${styles.percentageContainer} ${styles.negative}`}>
                  <span className={styles.percentage}>-5%</span>
                  <FaArrowDownLong className={styles.arrowIcon} />
                </div>
              </div>
            </div>

            {/* بطاقة اللغات الأجنبية */}
            <div id="languagesCard" className={styles.subjectCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>اللغات الأجنبية</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.scoreValue}>15.00</div>
                <div className={styles.percentageContainer}>
                  <span className={styles.percentage}>15%</span>
                  <FaArrowUpLong className={styles.arrowIcon} />
                </div>
              </div>
            </div>

            {/* بطاقة المواد الاجتماعية */}
            <div id="socialCard" className={styles.subjectCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>المواد الاجتماعية</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.scoreValue}>18.25</div>
                <div className={styles.percentageContainer}>
                  <span className={styles.percentage}>20%</span>
                  <FaArrowUpLong className={styles.arrowIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.leftSection}>
          {/* بطاقة النصائح والتوجيهات */}
          <div className={styles.adviceCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>نصائح وتوجيهات عامة للولي</h3>
            </div>
            <div className={styles.cardContent}>
              {/* محتوى النصائح والتوجيهات */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}