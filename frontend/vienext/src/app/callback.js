"use client"

   import { useRouter, useSearchParams } from 'next/navigation';
   import { useEffect } from 'react';

   export default function Callback() {
       const router = useRouter();
       const searchParams = useSearchParams();

       useEffect(() => {
           const token = searchParams.get('token');
           if (token) {
               localStorage.setItem('token', token);
               router.push('/dashboard');
           }
       }, [searchParams]);

       return (
           <div style={{ textAlign: 'center', marginTop: '50px' }}>
               <h2>Processing...</h2>
           </div>
       );
   }