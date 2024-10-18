'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

function Header() {
  const { data: session, status } = useSession();
  // const router = useRouter();

  const handleLogout = () => {
    signOut();
  };

  if (status === 'loading') {
    return null; // Don't show the header while session is loading
  }
  console.log('session', session);
  return (
    <header>
      <nav>
        {session?.username && (
          <Link href={`/${session.username}`}>
            Home
          </Link>
        )}
        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;
