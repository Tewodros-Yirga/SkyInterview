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
        Insert: any
        Update: any
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
        Update: any
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
        Update: any
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
        Update: any
      }
    }
  }
}