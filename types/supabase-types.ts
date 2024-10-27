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
      locations: {
        Row: {
          created_at: string
          from: string | null
          id: number
          to: string | null
        }
        Insert: {
          created_at?: string
          from?: string | null
          id?: number
          to?: string | null
        }
        Update: {
          created_at?: string
          from?: string | null
          id?: number
          to?: string | null
        }
        Relationships: []
      }
      logistics: {
        Row: {
          created_at: string
          distance: number | null
          duration: number | null
          from: string
          from_additional_instructions: string | null
          id: number
          to: string
          to_additional_instructions: string | null
        }
        Insert: {
          created_at?: string
          distance?: number | null
          duration?: number | null
          from: string
          from_additional_instructions?: string | null
          id?: number
          to: string
          to_additional_instructions?: string | null
        }
        Update: {
          created_at?: string
          distance?: number | null
          duration?: number | null
          from?: string
          from_additional_instructions?: string | null
          id?: number
          to?: string
          to_additional_instructions?: string | null
        }
        Relationships: []
      }
      order: {
        Row: {
          created_at: string
          deliver_to: number | null
          delivered_by: number | null
          id: number
          logistics: number
          payment_done: boolean | null
          payment_error: string | null
          payment_method: string | null
          pickup_between: string
          pickup_from: number | null
          pickup_on: string | null
          placed_by: number | null
          product: number
          service_type: Database["public"]["Enums"]["service_type"] | null
          status: Database["public"]["Enums"]["order_status"] | null
          total: string
          type: Database["public"]["Enums"]["service_type"]
        }
        Insert: {
          created_at?: string
          deliver_to?: number | null
          delivered_by?: number | null
          id?: number
          logistics: number
          payment_done?: boolean | null
          payment_error?: string | null
          payment_method?: string | null
          pickup_between: string
          pickup_from?: number | null
          pickup_on?: string | null
          placed_by?: number | null
          product: number
          service_type?: Database["public"]["Enums"]["service_type"] | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total: string
          type: Database["public"]["Enums"]["service_type"]
        }
        Update: {
          created_at?: string
          deliver_to?: number | null
          delivered_by?: number | null
          id?: number
          logistics?: number
          payment_done?: boolean | null
          payment_error?: string | null
          payment_method?: string | null
          pickup_between?: string
          pickup_from?: number | null
          pickup_on?: string | null
          placed_by?: number | null
          product?: number
          service_type?: Database["public"]["Enums"]["service_type"] | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total?: string
          type?: Database["public"]["Enums"]["service_type"]
        }
        Relationships: [
          {
            foreignKeyName: "order_deliver_to_fkey"
            columns: ["deliver_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_delivered_by_fkey"
            columns: ["delivered_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_logistics_fkey"
            columns: ["logistics"]
            isOneToOne: false
            referencedRelation: "logistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_pickup_from_fkey"
            columns: ["pickup_from"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_placed_by_fkey"
            columns: ["placed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          created_at: string
          id: number
          listed_by: string | null
          pic_url: string | null
          price: string | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          listed_by?: string | null
          pic_url?: string | null
          price?: string | null
          title: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          listed_by?: string | null
          pic_url?: string | null
          price?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: number
          password: string | null
          phone_number: string | null
          profile_pic: string | null
          ratings: number | null
          type: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: number
          password?: string | null
          phone_number?: string | null
          profile_pic?: string | null
          ratings?: number | null
          type?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: number
          password?: string | null
          phone_number?: string | null
          profile_pic?: string | null
          ratings?: number | null
          type?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status:
        | "order_pending_payment"
        | "order_processing"
        | "order_processed_success"
        | "order_processed_failure"
        | "order_completed_success"
        | "order_completed_failure"
      service_type: "buying" | "selling"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
