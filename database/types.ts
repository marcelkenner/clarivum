/**
 * Aurora PostgreSQL schema types.
 *
 * Generated from the canonical database using the shared type generation
 * workflow (`npm run db:types`). The structure mirrors the Supabase export we
 * previously used, but applies to the Aurora-managed Postgres cluster.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __internal: {
    PostgrestVersion: "13.0.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      content_items: {
        Row: {
          content_type: Database["public"]["Enums"]["content_kind"];
          created_at: string;
          created_by: string;
          deleted_at: string | null;
          deleted_by: string | null;
          excerpt: string | null;
          external_id: string;
          feature_flag_key: string | null;
          id: string;
          locale: string;
          metadata: Json;
          persona_id: string | null;
          published_at: string | null;
          revision: number;
          slug: string;
          status: Database["public"]["Enums"]["content_publish_status"];
          summary: string | null;
          title: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          content_type: Database["public"]["Enums"]["content_kind"];
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          excerpt?: string | null;
          external_id: string;
          feature_flag_key?: string | null;
          id?: string;
          locale?: string;
          metadata?: Json;
          persona_id?: string | null;
          published_at?: string | null;
          revision?: number;
          slug: string;
          status?: Database["public"]["Enums"]["content_publish_status"];
          summary?: string | null;
          title: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          content_type?: Database["public"]["Enums"]["content_kind"];
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          excerpt?: string | null;
          external_id?: string;
          feature_flag_key?: string | null;
          id?: string;
          locale?: string;
          metadata?: Json;
          persona_id?: string | null;
          published_at?: string | null;
          revision?: number;
          slug?: string;
          status?: Database["public"]["Enums"]["content_publish_status"];
          summary?: string | null;
          title?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_items_persona_id_fkey";
            columns: ["persona_id"];
            isOneToOne: false;
            referencedRelation: "personas";
            referencedColumns: ["id"];
          },
        ];
      };
      entitlement_status_history: {
        Row: {
          change_reason: string | null;
          created_at: string;
          created_by: string;
          entitlement_id: string;
          from_status: Database["public"]["Enums"]["entitlement_status"] | null;
          id: string;
          to_status: Database["public"]["Enums"]["entitlement_status"];
        };
        Insert: {
          change_reason?: string | null;
          created_at?: string;
          created_by?: string;
          entitlement_id: string;
          from_status?: Database["public"]["Enums"]["entitlement_status"] | null;
          id?: string;
          to_status: Database["public"]["Enums"]["entitlement_status"];
        };
        Update: {
          change_reason?: string | null;
          created_at?: string;
          created_by?: string;
          entitlement_id?: string;
          from_status?: Database["public"]["Enums"]["entitlement_status"] | null;
          id?: string;
          to_status?: Database["public"]["Enums"]["entitlement_status"];
        };
        Relationships: [
          {
            foreignKeyName: "entitlement_status_history_entitlement_id_fkey";
            columns: ["entitlement_id"];
            isOneToOne: false;
            referencedRelation: "entitlements";
            referencedColumns: ["id"];
          },
        ];
      };
      entitlements: {
        Row: {
          created_at: string;
          created_by: string;
          deleted_at: string | null;
          deleted_by: string | null;
          ends_at: string | null;
          external_reference: string | null;
          feature_key: string;
          granted_at: string;
          id: string;
          metadata: Json;
          plan_key: string;
          profile_id: string;
          revision: number;
          revoked_at: string | null;
          source: string | null;
          starts_at: string;
          status: Database["public"]["Enums"]["entitlement_status"];
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          ends_at?: string | null;
          external_reference?: string | null;
          feature_key: string;
          granted_at?: string;
          id?: string;
          metadata?: Json;
          plan_key: string;
          profile_id: string;
          revision?: number;
          revoked_at?: string | null;
          source?: string | null;
          starts_at?: string;
          status?: Database["public"]["Enums"]["entitlement_status"];
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          ends_at?: string | null;
          external_reference?: string | null;
          feature_key?: string;
          granted_at?: string;
          id?: string;
          metadata?: Json;
          plan_key?: string;
          profile_id?: string;
          revision?: number;
          revoked_at?: string | null;
          source?: string | null;
          starts_at?: string;
          status?: Database["public"]["Enums"]["entitlement_status"];
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entitlements_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          created_at: string;
          created_by: string;
          deleted_at: string | null;
          deleted_by: string | null;
          email: string;
          email_hash: string | null;
          first_seen_at: string;
          id: string;
          marketing_opt_in: boolean;
          metadata: Json;
          persona_id: string | null;
          profile_id: string | null;
          revision: number;
          source: string;
          updated_at: string;
          updated_by: string;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          utm_term: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          email: string;
          email_hash?: string | null;
          first_seen_at?: string;
          id?: string;
          marketing_opt_in?: boolean;
          metadata?: Json;
          persona_id?: string | null;
          profile_id?: string | null;
          revision?: number;
          source: string;
          updated_at?: string;
          updated_by?: string;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          email?: string;
          email_hash?: string | null;
          first_seen_at?: string;
          id?: string;
          marketing_opt_in?: boolean;
          metadata?: Json;
          persona_id?: string | null;
          profile_id?: string | null;
          revision?: number;
          source?: string;
          updated_at?: string;
          updated_by?: string;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_persona_id_fkey";
            columns: ["persona_id"];
            isOneToOne: false;
            referencedRelation: "personas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      personas: {
        Row: {
          created_at: string;
          created_by: string;
          deleted_at: string | null;
          deleted_by: string | null;
          description: string | null;
          id: string;
          key: string;
          name: string;
          revision: number;
          sort_order: number | null;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          key: string;
          name: string;
          revision?: number;
          sort_order?: number | null;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          description?: string | null;
          id?: string;
          key?: string;
          name?: string;
          revision?: number;
          sort_order?: number | null;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          auth_provider: string;
          auth_user_id: string | null;
          created_at: string;
          created_by: string;
          deleted_at: string | null;
          deleted_by: string | null;
          email: string;
          email_hash: string | null;
          id: string;
          last_claim_email_sent_at: string | null;
          locale: string | null;
          marketing_opt_in: boolean;
          pending_claim_token: string | null;
          pending_claim_token_expires_at: string | null;
          persona_id: string | null;
          revision: number;
          status: Database["public"]["Enums"]["profile_status"];
          timezone: string | null;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          auth_provider?: string;
          auth_user_id?: string | null;
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          email: string;
          email_hash?: string | null;
          id?: string;
          last_claim_email_sent_at?: string | null;
          locale?: string | null;
          marketing_opt_in?: boolean;
          pending_claim_token?: string | null;
          pending_claim_token_expires_at?: string | null;
          persona_id?: string | null;
          revision?: number;
          status?: Database["public"]["Enums"]["profile_status"];
          timezone?: string | null;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          auth_provider?: string;
          auth_user_id?: string | null;
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          email?: string;
          email_hash?: string | null;
          id?: string;
          last_claim_email_sent_at?: string | null;
          locale?: string | null;
          marketing_opt_in?: boolean;
          pending_claim_token?: string | null;
          pending_claim_token_expires_at?: string | null;
          persona_id?: string | null;
          revision?: number;
          status?: Database["public"]["Enums"]["profile_status"];
          timezone?: string | null;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_persona_id_fkey";
            columns: ["persona_id"];
            isOneToOne: false;
            referencedRelation: "personas";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      uuid_generate_v7: { Args: never; Returns: string };
    };
    Enums: {
      content_kind: "article" | "guide" | "ebook" | "tool" | "page";
      content_publish_status: "draft" | "scheduled" | "published" | "archived";
      entitlement_status: "pending_claim" | "active" | "processing" | "revoked" | "expired";
      profile_status: "pending_claim" | "active" | "inactive" | "blocked";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__internal">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      content_kind: ["article", "guide", "ebook", "tool", "page"],
      content_publish_status: ["draft", "scheduled", "published", "archived"],
      entitlement_status: ["pending_claim", "active", "processing", "revoked", "expired"],
      profile_status: ["pending_claim", "active", "inactive", "blocked"],
    },
  },
} as const;
