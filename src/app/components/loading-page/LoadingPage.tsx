'use client';

import React from 'react';
import Image from 'next/image';

const LOGO_URL = '/miniLogo.png';
const MAIN_COLOR = '#DD2946';

interface LoadingPageProps {
    fullScreen?: boolean;
    message?: string;
}

export default function LoadingPage({
    fullScreen = true,
    message = "جاري التحميل..."
}: LoadingPageProps) {

    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 ${
                fullScreen ? 'min-h-screen w-full' : 'w-full h-full py-10'
            }`}
            aria-label={message}
        >
            <div className="relative h-14 w-14">
                <div
                    className="absolute inset-0 h-full w-full animate-spin rounded-full border-4 border-solid border-gray-300"
                    style={{ borderTopColor: MAIN_COLOR }}
                    role="status"
                    aria-live="polite"
                >
                     <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
                 <Image
                    src={LOGO_URL}
                    alt="شعار الموقع المصغر"
                    width={40}
                    height={40}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    priority
                />
            </div>

            {message && (
                 <p
                    className="mt-4 text-lg text-gray-400"
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                 >
                    {message}
                 </p>
            )}
        </div>
    );
}
