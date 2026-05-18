'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function loginWithCredentials(email: string, password: string) {
  try {
    await signIn('credentials', { email, password, redirectTo: '/' })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Correo o contraseña incorrectos.' }
        default:
          return { error: 'Ocurrió un error. Intenta de nuevo.' }
      }
    }
    // signIn throws a NEXT_REDIRECT on success — must re-throw
    throw error
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  if (!name.trim() || !email.trim() || !password) {
    return { error: 'Todos los campos son obligatorios.' }
  }

  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: 'Ya existe una cuenta con ese correo.' }
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { name: name.trim(), email: email.trim(), password: hashed },
  })

  return { success: true }
}
