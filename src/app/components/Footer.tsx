import styles from '../styles/Footer.module.css';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.wave}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 100" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z" 
            className={styles.shapeFill}
          />
        </svg>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.topFooter}>
            <div className={styles.footerSection}>
              <h3 className={styles.logo}>Logo</h3>
              <p className={styles.description}>
                هنا يتم وضع تعريف مختصر بالمنصة أو وصف موجز لرسالتها وأهدافها. يمكن أن يشمل هذا نبذة عن رؤيتنا وقيمنا.
              </p>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.sectionHeading}>عنوان كبير 1</h4>
              <ul className={styles.sectionLinks}>
                <li><a href="#" className={styles.sectionLink}>عنوان صغير 1</a></li>
                <li><a href="#" className={styles.sectionLink}>عنوان صغير 2</a></li>
                <li><a href="#" className={styles.sectionLink}>عنوان صغير 3</a></li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.sectionHeading}>عنوان كبير 2</h4>
              <ul className={styles.sectionLinks}>
                <li><a href="#" className={styles.sectionLink}>عنوان صغير 1</a></li>
                <li><a href="#" className={styles.sectionLink}>عنوان صغير 2</a></li>
                <li><a href="#" className={styles.sectionLink}>عنوان صغير 3</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.copyrightSection}>
            <p className={styles.copyrightText}>جميع الحقوق محفوظة - عمر سكول © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}