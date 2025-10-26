import { z } from 'zod';
const EnvSchema = z.object({
  VITE_API_BASE: z
    .string()
    .min(1)
    .refine((v) => v.startsWith('/') || /^https?:\/\//.test(v), {
      message: "VITE_API_BASE debe iniciar con '/' o 'http(s)://'",
    }),
});
export const env = EnvSchema.parse({
  VITE_API_BASE: (import.meta as any).env?.VITE_API_BASE ?? '/api',
});
