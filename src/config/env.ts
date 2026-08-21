import { z } from 'zod';

const envSchema = z.object({
  VITE_TMDB_API_KEY: z.string().min(20, 'Falta la API Key de TMDB (v3)'),
  VITE_TMDB_API_BASE: z.url().default('https://api.themoviedb.org/3'),
  VITE_TMDB_IMAGE_BASE: z.url().default('https://image.tmdb.org/t/p'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(`Configuración inválida:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;