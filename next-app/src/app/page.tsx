'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading session

    // If no session, redirect to the login page
    if (!session) {
      router.push('/login');
    } else if (session?.username) {
      // If session exists and has a username, redirect to the user's personalized page
      router.push(`/${session.username}`);
    }
  }, [session, status, router]);

  return <div>Loading...</div>; // Placeholder while redirecting
}
