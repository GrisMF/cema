export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          role: string
          is_superuser: boolean
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name?: string | null
          role?: string
          is_superuser?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          role?: string
          is_superuser?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
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
