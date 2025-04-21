// app/callback.js
"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Callback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Lưu token vào localStorage
            localStorage.setItem('token', token);
            // Chuyển hướng đến trang dashboard
            router.push('/dashboard');
        }
    }, [searchParams]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Processing...</h2>
        </div>
    );
}