import type {
  Database as SupabaseDatabase,
  Tables as SupabaseTables,
  TablesInsert as SupabaseTablesInsert,
  TablesUpdate as SupabaseTablesUpdate,
  Enums as SupabaseEnums,
} from "../../../supabase/types";

/**
 * Re-export generated Supabase schema types from a stable module so callers can
 * import via `@/lib/supabase/types` instead of reaching into the root `supabase/` directory.
 */
export type Database = SupabaseDatabase;
export type Tables<Name extends keyof Database["public"]["Tables"]> = SupabaseTables<Name>;
export type TablesInsert<Name extends keyof Database["public"]["Tables"]> =
  SupabaseTablesInsert<Name>;
export type TablesUpdate<Name extends keyof Database["public"]["Tables"]> =
  SupabaseTablesUpdate<Name>;
export type Enums<Name extends keyof Database["public"]["Enums"]> = SupabaseEnums<Name>;
