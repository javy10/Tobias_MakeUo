// src/lib/optimized-db.ts
// Base de datos optimizada para operaciones rápidas

import { supabase } from './supabase';

export interface OptimizedQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
  select?: string;
}

export class OptimizedDB {
  private static instance: OptimizedDB;
  private cache: Map<string, any> = new Map();
  private cacheTimeout: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  static getInstance(): OptimizedDB {
    if (!OptimizedDB.instance) {
      OptimizedDB.instance = new OptimizedDB();
    }
    return OptimizedDB.instance;
  }

  async get<T>(
    table: string, 
    options: OptimizedQueryOptions = {}
  ): Promise<T[]> {
    const cacheKey = this.generateCacheKey(table, options);
    
    // Verificar cache
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let query = supabase.from(table).select(options.select || '*');

      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching from ${table}:`, error);
        return [];
      }

      // Guardar en cache
      this.cache.set(cacheKey, data || []);
      this.cacheTimeout.set(cacheKey, Date.now() + this.CACHE_DURATION);

      return data || [];
    } catch (error) {
      console.error(`Error in optimized query for ${table}:`, error);
      return [];
    }
  }

  async insert<T>(table: string, data: Partial<T>): Promise<T | null> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`Error inserting into ${table}:`, error);
        return null;
      }

      // Invalidar cache
      this.invalidateCache(table);

      return result;
    } catch (error) {
      console.error(`Error in insert for ${table}:`, error);
      return null;
    }
  }

  async update<T>(
    table: string, 
    id: string | number, 
    data: Partial<T>
  ): Promise<T | null> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${table}:`, error);
        return null;
      }

      // Invalidar cache
      this.invalidateCache(table);

      return result;
    } catch (error) {
      console.error(`Error in update for ${table}:`, error);
      return null;
    }
  }

  async delete(table: string, id: string | number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        return false;
      }

      // Invalidar cache
      this.invalidateCache(table);

      return true;
    } catch (error) {
      console.error(`Error in delete for ${table}:`, error);
      return false;
    }
  }

  private generateCacheKey(table: string, options: OptimizedQueryOptions): string {
    return `${table}_${JSON.stringify(options)}`;
  }

  private isCacheValid(key: string): boolean {
    const timeout = this.cacheTimeout.get(key);
    return timeout ? Date.now() < timeout : false;
  }

  private invalidateCache(table: string): void {
    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(table)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.cacheTimeout.delete(key);
    });
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheTimeout.clear();
  }
}

// Funciones optimistas para operaciones rápidas
export async function updateItemOptimistic<T>(
  table: string,
  id: string | number,
  data: Partial<T>
): Promise<T | null> {
  const db = OptimizedDB.getInstance();
  return await db.update(table, id, data);
}

export async function deleteItemOptimistic(
  table: string,
  id: string | number
): Promise<boolean> {
  const db = OptimizedDB.getInstance();
  return await db.delete(table, id);
}

// Instancia global
export const optimizedDB = OptimizedDB.getInstance();