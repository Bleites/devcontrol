import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import type { Adapter } from 'next-auth/adapters'
import { AuthOptions } from 'next-auth'
import prismaClient from './prisma'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prismaClient) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
          })
    ],
    callbacks: {
        // aqui indicamos que quando usamos a função session nós temos acesso á sessão, ao token
        // da sessão e ao objecto user que tem o email password e id por exemplo e nós podemos
        // estampar isso no login, ou até ir buscar o nome para mostrar que está logado.
        async session({session, token, user,}){
            session.user = { ...session.user, id: user.id} as {
                id: string;
                name: string;
                email: string;
            }

            return session
        }
    }
}