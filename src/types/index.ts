import { z } from 'zod';

// 1. Define the schema
export const UserSchema = z.object({
  id: z.uuid(),
  nom: z.string(),
  prenom: z.string(),
  email: z.email("Format d'email invalide"),
});

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const LoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      passwordRegex,
      'Le mot de passe est trop faible. Il doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre ou caractère spécial',
    ),
});
export const CreateUserSchema = z
  .object({
    nom: z.string().min(1, 'Le nom est requis'),
    prenom: z.string().min(1, 'Le prénom est requis'),
    email: z.email("Format d'email invalide"),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        passwordRegex,
        'Le mot de passe est trop faible. Il doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre ou caractère spécial',
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const ResetPasswordEmailSchema = z.object({
  email: z.email("Format d'email invalide"),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        passwordRegex,
        'Le mot de passe est trop faible. Il doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre ou caractère spécial',
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

// 2. Infer the TypeScript type automatically
export type NewPasswordForm = z.infer<typeof NewPasswordSchema>;
export type User = z.infer<typeof UserSchema>;
