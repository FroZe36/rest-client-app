import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email();
export const nameSchema = z
  .string()
  .min(1, { message: 'Name is required' })
  .regex(/[\p{L}]/u, { message: 'Name must start with an uppercase letter' });
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must contain at least 8 characters' })
  .regex(/[\p{L}]/u, { message: 'Password must contain at least one letter' })
  .regex(/\d/, { message: 'Password must contain at least one digit' })
  .regex(/[^\p{L}\d]/u, {
    message: 'Password must contain at least one special character',
  });

export const SignUpSchema = z
  .object({
    email: emailSchema,
    name: nameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .strict()
  .refine(({ confirmPassword, password }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const SignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});
