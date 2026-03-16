import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  NEWS_API_KEY: z.string().optional(),
  EVENT_REGISTRY_API_KEY: z.string().optional(),
  REDDIT_CLIENT_ID: z.string().optional(),
  REDDIT_SECRET: z.string().optional(),
  MAPBOX_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  CRON_SECRET: z.string().optional()
});

export const env = envSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  EVENT_REGISTRY_API_KEY: process.env.EVENT_REGISTRY_API_KEY,
  REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
  REDDIT_SECRET: process.env.REDDIT_SECRET,
  MAPBOX_KEY: process.env.MAPBOX_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  CRON_SECRET: process.env.CRON_SECRET
});
