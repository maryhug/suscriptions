import { DefaultSession } from 'next-auth'
import { JWT } from '@auth/core/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string
  }
}
