
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        const { token } = router.query;
        if (token) {
            // Lưu token vào localStorage
            localStorage.setItem('token', token);
            // Chuyển hướng đến trang dashboard
            router.push('/dashboard');
        }
    }, [router.query]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Processing...</h2>
        </div>
    );
}