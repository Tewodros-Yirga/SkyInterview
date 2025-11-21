// lib/supabase/types.ts
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
      notebook_pages: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          content: string
          section: string | null
          parent_id: string | null
          is_folder: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          slug: string
          content?: string
          section?: string | null
          parent_id?: string | null
          is_folder?: boolean
          sort_order?: number
        }
        Update: {
          title?: string
          slug?: string
          content?: string
          section?: string | null
          parent_id?: string | null
          is_folder?: boolean
          sort_order?: number
        }
      }

      discussion_topics: {
        Row: {
          id: string
          topic: string
          category: string | null
          difficulty: number
          created_at: string
        }
        Insert: {
          topic: string
          category?: string | null
          difficulty?: number
        }
        Update: {
          topic?: string
          category?: string | null
          difficulty?: number
        }
      }

      discussion_sessions: {
        Row: {
          id: string
          user_id: string
          topic_id: string | null
          assigned_side: "for" | "against"
          transcript: string | null
          audio_url: string | null
          score: Json | null
          feedback: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          topic_id?: string | null
          assigned_side: "for" | "against"
          transcript?: string | null
          audio_url?: string | null
          score?: Json | null
          feedback?: string | null
        }
        Update: {
          user_id?: string
          topic_id?: string | null
          assigned_side?: "for" | "against"
          transcript?: string | null
          audio_url?: string | null
          score?: Json | null
          feedback?: string | null
        }
      }

      // Join table for last session topic
      discussion_topics_sessions_join: {
        Row: {
          discussion_topics: {
            topic: string
          } | null
        }
      }

      interview_sessions: {
        Row: {
          id: string
          user_id: string
          question: string
          category: string
          transcript: string | null
          audio_url: string | null
          total_score: number | null
          score: Json | null
          feedback: string | null
          improvements: Json | null
          strengths: Json | null
          created_at: string
        }
        Insert: {
          user_id: string
          question: string
          category: string
          transcript?: string | null
          audio_url?: string | null
          total_score?: number | null
          score?: Json | null
          feedback?: string | null
          improvements?: Json | null
          strengths?: Json | null
        }
        Update: {
          user_id?: string
          question?: string
          category?: string
          transcript?: string | null
          audio_url?: string | null
          total_score?: number | null
          score?: Json | null
          feedback?: string | null
          improvements?: Json | null
          strengths?: Json | null
        }
      }

      ai_messages: {
        Row: {
          id: string
          user_id: string
          role: "user" | "assistant"
          content: string
          created_at: string
        }
        Insert: {
          user_id: string
          role: "user" | "assistant"
          content: string
        }
        Update: {
          user_id?: string
          role?: "user" | "assistant"
          content?: string
        }
      }

      notebook_templates: {
        Row: {
          id: string
          title: string
          subtitle: string
          description: string
          icon: string | null
          section: string
          tips: Json | null
          created_at: string
        }
        Insert: {
          title: string
          subtitle: string
          description: string
          icon?: string | null
          section: string
          tips?: Json | null
        }
        Update: {
          title?: string
          subtitle?: string
          description?: string
          icon?: string | null
          section?: string
          tips?: Json | null
        }
      }
    }
  }
}