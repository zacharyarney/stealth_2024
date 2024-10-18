import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { AuthOptions } from 'next-auth';
import { createUser, getUserByUsername } from '@/db/dao';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
        console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing username or password');
        }

        // Log incoming credentials for debugging
        console.log('Attempting to log in with:', credentials.username);

        // Find user by username
        let user = await getUserByUsername(credentials.username);
        console.log('User: ', user);
        if (!user) {
          console.log(
            `User ${credentials.username} not found. Creating new user...`);

          // If no user exists, register them
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          user = await createUser(credentials.username, hashedPassword);

          console.log(`User ${user.username} created successfully.`);
        } else {
          // If user exists, validate password
          const isPasswordValid = await bcrypt.compare(
            credentials.password, user.password);

          console.log(
            `Password validation for ${credentials.username}: ${isPasswordValid}`);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }
        }

        // Return the user object
        console.log(`User ${user.username} authenticated successfully.`);
        return { id: user.id, username: user.username };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username; // Ensure username is in token
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id as number;
      session.username = token.username as string; // Ensure session includes username
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,

};
