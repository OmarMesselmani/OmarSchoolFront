// المسار: src/app/layout.tsx (أو ملف التخطيط الرئيسي لديك)

// تأكد من استيراد Provider من المسار الصحيح
import { HeaderProvider } from './contexts/header-context';
import './globals.css'; // افتراض وجود ملف التنسيقات العام

// يمكنك إضافة بيانات metadata هنا
export const metadata = {
  title: 'Omar School Dashboard',
  description: 'لوحة تحكم منصة عمر سكول',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {/* تغليف التطبيق أو الجزء الرئيسي منه بالـ Provider */}
        <HeaderProvider>
          {children}
        </HeaderProvider>
      </body>
    </html>
  )
}