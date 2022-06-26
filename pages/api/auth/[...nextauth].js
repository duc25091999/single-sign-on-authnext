import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        name: {
          label: "Name",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect();
        const result = await User.findOne({email:credentials.email});
        if(result) return res.status(400).json({ success: false });
        return null;
      },
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      await dbConnect();
      const result = await User.findById(token.sub);
      session.user = result;
      return session;
    },
  },
});
