import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html dir="rtl">
      <body>{children}</body>
    </html>
  )
}