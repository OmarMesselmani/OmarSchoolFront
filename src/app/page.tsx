'use client'

import Head from 'next/head'
import Header from './components/Header'
import Section1 from './sections/Section1'
import Section2 from './sections/Section2'
import Section3 from './sections/Section3'
import Footer from './components/Footer'
import checkAuth from './services/check-auth'
import { useState, useEffect } from 'react'
import LoadingPage from './components/loading-page/LoadingPage'
export default function Home() {
  const [isFullLoading, setIsFullLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const authStatus = await checkAuth();
        if (authStatus.status) {
          setIsLoggedIn(true);
          setIsFullLoading(false);
        } else {
          setIsLoggedIn(false);
          setIsFullLoading(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    }
    checkUserAuth();
  }, []);
  if (isFullLoading) {
    return <LoadingPage />;
  } else {
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
}