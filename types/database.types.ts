export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      sotfc_minigames: {
        Row: {
          date: string
          id: number
          name: string
          published: boolean
          week_number: number
        }
        Insert: {
          date: string
          id?: number
          name?: string
          published?: boolean
          week_number: number
        }
        Update: {
          date?: string
          id?: number
          name?: string
          published?: boolean
          week_number?: number
        }
        Relationships: []
      }
      sotfc_placements: {
        Row: {
          id: number
          minigame_id: number
          placement: number
          player_id: number | null
        }
        Insert: {
          id?: number
          minigame_id: number
          placement: number
          player_id?: number | null
        }
        Update: {
          id?: number
          minigame_id?: number
          placement?: number
          player_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sotfc_placements_minigame_id_fkey"
            columns: ["minigame_id"]
            isOneToOne: false
            referencedRelation: "sotfc_minigames"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sotfc_placements_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "sotfc_players"
            referencedColumns: ["id"]
          },
        ]
      }
      sotfc_players: {
        Row: {
          color: string
          id: number
          member_since: string
          name: string
          notes: string
          tags: string[] | null
          username: string
          uuid: string
        }
        Insert: {
          color?: string
          id?: number
          member_since: string
          name?: string
          notes?: string
          tags?: string[] | null
          username?: string
          uuid: string
        }
        Update: {
          color?: string
          id?: number
          member_since?: string
          name?: string
          notes?: string
          tags?: string[] | null
          username?: string
          uuid?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      sotfc_summary: {
        Row: {
          date: string | null
          minigame: string | null
          minigame_id: number | null
          placement: number | null
          placement_id: number | null
          player: string | null
          player_id: number | null
          published: boolean | null
          week_number: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sotfc_placements_minigame_id_fkey"
            columns: ["minigame_id"]
            isOneToOne: false
            referencedRelation: "sotfc_minigames"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sotfc_placements_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "sotfc_players"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
    }
    Enums: {
      app_permission:
        | "sotfc.minigames.modify"
        | "sotfc.minigames.delete"
        | "sotfc.minigames.create"
      app_role: "lmnts.admin" | "sotfc.admin" | "sotfc.moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
