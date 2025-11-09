import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Mohon masukan email yang valid'),
  password: z.string().min(1, 'Password di butuhkan'),
});

export const registerSchema = z
  .object({
    email: z.email('Mohon masukan email yang valid'),
    password: z.string().min(1, 'Password di butuhkan'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  });
