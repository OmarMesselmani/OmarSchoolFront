import Head from 'next/head'
import Header from './components/Header'
import Section1 from './sections/Section1'
import Section3 from './sections/Section3'
import Section2 from './sections/Section2'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div>
      <Head>
        <title>عمر سكول</title>
        <meta name="description" content="منصة تعليمية" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Section1 />
      <Section2 />
      <Section3 />

      <Footer />
    </div>
  )
}