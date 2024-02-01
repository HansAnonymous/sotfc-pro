export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sotfc_minigames: {
        Row: {
          date: string
          id: number
          name: string
          week_number: number
        }
        Insert: {
          date: string
          id?: number
          name: string
          week_number: number
        }
        Update: {
          date?: string
          id?: number
          name?: string
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
          }
        ]
      }
      sotfc_players: {
        Row: {
          color: string
          id: number
          member_since: string
          name: string
          notes: string
          username: string
        }
        Insert: {
          color?: string
          id?: number
          member_since: string
          name?: string
          notes?: string
          username?: string
        }
        Update: {
          color?: string
          id?: number
          member_since?: string
          name?: string
          notes?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      sotfc_summary: {
        Row: {
          minigame: string
          minigame_id: number
          placement: number
          placement_id: number
          player: string
          player_id: number
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
          }
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
