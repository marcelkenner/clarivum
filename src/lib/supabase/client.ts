import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

type DatabaseSchema = Extract<Exclude<keyof Database, "__InternalSupabase">, string>;

interface ClientOptions {
  /**
   * Override the Postgres schema (defaults to "public").
   */
  schema?: DatabaseSchema;
}

const DEFAULT_SCHEMA = "public" as const satisfies DatabaseSchema;

function requireEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Returns a Supabase client authenticated with the anon key. Suitable for SSR
 * flows that operate on behalf of end users.
 */
export function createSupabaseAnonClient({
  schema = DEFAULT_SCHEMA,
}: ClientOptions = {}): SupabaseClient<Database, DatabaseSchema> {
  const url = requireEnv("SUPABASE_URL");
  const anonKey = requireEnv("SUPABASE_ANON_KEY");

  return createClient<Database, DatabaseSchema>(url, anonKey, {
    db: { schema },
  });
}

/**
 * Returns a Supabase client authenticated with the service role key. Restrict
 * usage to trusted server environments (background jobs, API routes).
 */
export function createSupabaseServiceRoleClient({
  schema = DEFAULT_SCHEMA,
}: ClientOptions = {}): SupabaseClient<Database, DatabaseSchema> {
  const url = requireEnv("SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient<Database, DatabaseSchema>(url, serviceRoleKey, {
    db: { schema },
  });
}

/**
 * Shared type alias so features can refer to the Clarivum-typed Supabase client
 * without repeating the generic parameters.
 */
export type ClarivumSupabaseClient = SupabaseClient<Database, DatabaseSchema>;
