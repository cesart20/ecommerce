


import prisma from '@/lib/prisma';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';

 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
  },

  callbacks: {

    authorized({auth, request: { nextUrl}}) {
      console.log("===============================");
      
      console.log("AUTH",auth);
      
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if(isOnDashboard) {
      //   if(isLoggedIn) return true;
      //   return false;
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      return true;
    },

    jwt({ user, token }) {
      if( user ) {
        token.data = user;
      }
      
      return token;
    },

    session({ session, token, user }) {
      session.user = token.data as any;
      
      return session;
    }
  },


  providers: [

    Credentials({
        async authorize(credentials) {

            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);

                if(!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;


                const user = await prisma.user.findUnique({
                    where: {
                      email: email.toLowerCase()
                    }
                });

                if(!user) return null;

                if(!bcryptjs.compareSync(password, user.password)) {
                  return null;
                }

                // regresar el usuario sin el password
                const { password: _, ...rest } = user
                
                // console.log({ rest });
                

                return rest;
            
        },
    }),




  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);