import type { NextAuthOptions } from 'next-auth';
import { type DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { linkGoogleAccount, loginWithPassword } from '@/lib/accounts';

// Pour un vrai e-commerce, vous devriez utiliser une vraie base de données
// Ici, on utilise une solution simple avec variables d'environnement pour les admins
// Vous pouvez facilement migrer vers Supabase, MongoDB, PostgreSQL, etc.

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Provider Email/Password (simple, pour démarrer)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Trim pour éviter les espaces
        const email = (credentials.email as string).trim();
        const password = (credentials.password as string).trim();

        let adminEmail = process.env.ADMIN_EMAIL;
        let adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPassword) {
          adminEmail = adminEmail.trim().replace(/^["']|["']$/g, '');
          adminPassword = adminPassword.trim().replace(/^["']|["']$/g, '');
          if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
            return { id: '1', email: adminEmail, name: 'Admin' };
          }
        }

        const account = await loginWithPassword(email, password);
        if (account && 'unverified' in account) {
          throw new Error('EMAIL_NOT_VERIFIED');
        }
        if (account) return account;

        return null;
      },
    }),
    
    // Provider Google OAuth (optionnel)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  
  pages: {
    signIn: '/fr/login',
    error: '/fr/login',
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') return true;
      const email = user.email?.toLowerCase();
      const verified = Boolean((profile as { email_verified?: boolean } | undefined)?.email_verified);
      if (!email || !verified || !account.providerAccountId) return false;
      const id = await linkGoogleAccount({
        email,
        name: user.name || email,
        sub: account.providerAccountId,
      });
      if (!id) return false;
      user.id = id;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (typeof token.email === 'string') session.user.email = token.email;
        if (typeof token.name === 'string') session.user.name = token.name;
      }
      return session;
    },
  },
  
  session: {
    strategy: 'jwt',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};
