// src/lib/supabase.ts
// Configuración de Supabase para el proyecto

import { createClient } from '@supabase/supabase-js';

// Obtener las credenciales de Supabase desde variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ Faltante');
  console.error('📝 Crea un archivo .env.local con las credenciales de Supabase');
  
  // Usar valores por defecto para evitar errores de compilación
  const defaultUrl = 'https://prlxicaxkpctkksmlnax.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybHhpY2F4a3BjdGtrc21sbmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTg2MjAsImV4cCI6MjA3NDk5NDYyMH0.gT1P_5lfOkYtTCpqhnEGjKm8LJd_Tx1cUCMl9TjW0LQ';
  
  console.warn('⚠️ Usando credenciales por defecto. Crea .env.local para usar tus propias credenciales.');
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(
  supabaseUrl || 'https://prlxicaxkpctkksmlnax.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybHhpY2F4a3BjdGtrc21sbmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTg2MjAsImV4cCI6MjA3NDk5NDYyMH0.gT1P_5lfOkYtTCpqhnEGjKm8LJd_Tx1cUCMl9TjW0LQ'
);

// Tipos de datos para TypeScript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          name: string;
          description: string;
          url: string;
          type: 'image' | 'video';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          url: string;
          type: 'image' | 'video';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          stock: number;
          category_id: string;
          url: string;
          type: 'image' | 'video';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      perfumes: {
        Row: {
          id: string;
          name: string;
          description: string;
          stock: number;
          url: string;
          type: 'image' | 'video';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['perfumes']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['perfumes']['Insert']>;
      };
      gallery_items: {
        Row: {
          id: string;
          title: string;
          description: string;
          alt: string;
          url: string;
          type: 'image' | 'video';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gallery_items']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['gallery_items']['Insert']>;
      };
      hero_content: {
        Row: {
          id: string;
          title: string;
          subtitle: string;
          url: string;
          type: 'image' | 'video';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hero_content']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['hero_content']['Insert']>;
      };
      about_me_content: {
        Row: {
          id: string;
          text: string;
          url: string;
          type: 'image' | 'video';
          happy_clients: string;
          years_of_experience: string;
          events: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['about_me_content']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['about_me_content']['Insert']>;
      };
      testimonials: {
        Row: {
          id: string;
          text: string;
          author: string;
          status: 'pending' | 'approved' | 'rejected';
          seen: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
  };
}
