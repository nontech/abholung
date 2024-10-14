'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main page after a short delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000); // 3 seconds delay, adjust as needed

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Redirecting you back to the main page...</p>
    </div>
  );
}