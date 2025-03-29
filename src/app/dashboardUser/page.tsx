import styles from './page.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DashboardUserPage() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.dashboardContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.settingsColumn}>
            <div className={styles.settingsCard}>
              <p className={styles.settingsTitle}>Settings</p>
              <p className={styles.settingsOption}><span className={styles.underline}>side</span></p>
            </div>
          </div>
          
          <div className={styles.mainContent}>
            <div className={styles.infoHeader}>
              <h1 className={styles.title}>Info <span className={styles.highlight}>student</span></h1>
            </div>
            
            <div className={styles.cardsContainer}>
              <div className={styles.column}>
                <div className={styles.card}>
                  <p className={styles.cardText}>هذا الديف مخصص لمتابعة تقدم التلميذ في الدروس</p>
                </div>
                
                <div className={styles.card}>
                  <p className={styles.cardText}>هذا الديف مخصص للبحوث المدرسية</p>
                </div>
                
                <div className={styles.card}>
                  <p className={styles.cardText}>هذا الديف مخصص لملخصات الدروس</p>
                </div>
              </div>
              
              <div className={styles.column}>
                <div className={styles.card}>
                  <p className={styles.cardText}>هذا الديف مخصص لمواد اللغة العربية</p>
                </div>
                
                <div className={styles.card}>
                  <p className={styles.cardText}>هذا الديف مخصص لمادة الرياضيات</p>
                </div>
                
                <div className={styles.card}>
                  <p className={styles.cardText}>هذا الديف مخصص للمواد العلمية</p>
                </div>
                
                <div className={styles.card}>
                  <p className={styles.cardText}>هذا الديف مخصص للغات الأجنبية</p>
                </div>
                
                <div className={styles.card}>
                  <p className={styles.cardText}>هذا الديف مخصص لمواد العلوم الاجتماعية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}