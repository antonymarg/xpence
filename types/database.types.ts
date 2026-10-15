import { ExpensesSummary, MonthlyInsights } from "./expenses.types"
import { Currency, Locale } from "./users.types"

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    is_default: boolean
                    name: string
                    type: Database["public"]["Enums"]["expense_type"]
                }
                Insert: {
                    id?: string
                    is_default?: boolean
                    name: string
                    type?: Database["public"]["Enums"]["expense_type"]
                }
                Update: {
                    id?: string
                    is_default?: boolean
                    name?: string
                    type?: Database["public"]["Enums"]["expense_type"]
                }
                Relationships: []
            }
            expenses: {
                Row: {
                    amount: number
                    category_id: string
                    date: string
                    description: string
                    id: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category_id?: string
                    date: string
                    description?: string
                    id?: string
                    user_id?: string
                }
                Update: {
                    amount?: number
                    category_id?: string
                    date?: string
                    description?: string
                    id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "expenses_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_profiles: {
                Row: {
                    budget: number
                    created_at: string
                    currency: Currency
                    display_name: string
                    locale: Locale
                    user_id: string
                }
                Insert: {
                    budget?: number
                    created_at?: string
                    currency?: Currency
                    display_name?: string
                    locale?: Locale
                    user_id?: string
                }
                Update: {
                    budget?: number
                    created_at?: string
                    currency?: Currency
                    display_name?: string
                    locale?: Locale
                    user_id?: string
                }
                Relationships: []
            }
            user_to_category: {
                Row: {
                    category_id: string
                    is_active: boolean
                    user_id: string
                }
                Insert: {
                    category_id?: string
                    is_active?: boolean
                    user_id?: string
                }
                Update: {
                    category_id?: string
                    is_active?: boolean
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_to_category_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            expenses_by_category: {
                Args: {
                    p_category_type?: Database["public"]["Enums"]["expense_type"]
                    p_end_date: string
                    p_start_date: string
                }
                Returns: {
                    category_id: string
                    category_name: string
                    category_type: Database["public"]["Enums"]["expense_type"]
                    percentage_in_total: number
                    sum_amount: number
                }[]
            }
            expenses_by_category_type: {
                Args: {
                    p_category_type?: Database["public"]["Enums"]["expense_type"]
                    p_end_date: string
                    p_start_date: string
                }
                Returns: {
                    category_type: Database["public"]["Enums"]["expense_type"]
                    percentage_in_total: number
                    sum_amount: number
                }[]
            }
            get_current_month_expenses_by_type: { Args: never; Returns: ExpensesSummary }
            get_monthly_insights: {
                Args: {
                    p_category_type?: string
                    p_from_date: string
                    p_to_date: string
                }
                Returns: MonthlyInsights
            }
        }
        Enums: {
            expense_type: "needs" | "wants" | "savings"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
            DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends (DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
            expense_type: ["needs", "wants", "savings"],
        },
    },
} as const