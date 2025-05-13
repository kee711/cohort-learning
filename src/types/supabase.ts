export type Database = {
  public: {
    Tables: {
      class: {
        Row: {
          id: string
          title: string
          price: number
          start_date: string | null
          end_date: string | null
          rating: number
          likes: number
          thumbnail_img: string | null
          detail_img: string | null
          detail_text: string | null
          lecturer: string
          students_total: number
          students_max: number | null
          manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          price?: number
          start_date?: string | null
          end_date?: string | null
          rating?: number
          likes?: number
          thumbnail_img?: string | null
          detail_img?: string | null
          detail_text?: string | null
          lecturer: string
          students_total?: number
          students_max?: number | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          price?: number
          start_date?: string | null
          end_date?: string | null
          rating?: number
          likes?: number
          thumbnail_img?: string | null
          detail_img?: string | null
          detail_text?: string | null
          lecturer?: string
          students_total?: number
          students_max?: number | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user: {
        Row: {
          id: string
          email: string
          name: string
          phone_number: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone_number?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone_number?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      enrollment: {
        Row: {
          id: string
          student_id: string
          class_id: string
          enrolled_at: string
          is_attended: boolean
        }
        Insert: {
          id?: string
          student_id: string
          class_id: string
          enrolled_at?: string
          is_attended?: boolean
        }
        Update: {
          id?: string
          student_id?: string
          class_id?: string
          enrolled_at?: string
          is_attended?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
} 