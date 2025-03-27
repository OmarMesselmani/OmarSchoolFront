import styles from './page.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DashboardUserPage() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.dashboardContainer}>
        <h1 className={styles.title}>لوحة التحكم الخاصة بالمستخدم</h1>
        <p className={styles.description}>مرحبًا بك في لوحة التحكم الخاصة بك.</p>
      </main>
      <Footer />
    </div>
  );
}