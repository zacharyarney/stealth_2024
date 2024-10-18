import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: number;
    username: string;
  }

  interface Session extends DefaultSession {
    id: number;
    username: string;
  }

  interface JWT {
    id: number;
    username: string;
  }
}
