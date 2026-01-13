import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL and Service Key are required');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Get the Supabase client instance
   */
  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Test Supabase connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseClient
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error('Supabase connection error:', error);
        return false;
      }

      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('Failed to test Supabase connection:', error);
      return false;
    }
  }

  /**
   * Insert data into a table
   */
  async insert<T>(table: string, data: T) {
    return this.supabaseClient.from(table).insert([data]).select();
  }

  /**
   * Fetch data from a table
   */
  async fetch<T>(table: string, filters?: Record<string, any>) {
    let query = this.supabaseClient.from(table).select();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return query;
  }

  /**
   * Update data in a table
   */
  async update<T>(table: string, id: string, data: Partial<T>) {
    return this.supabaseClient
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
  }

  /**
   * Delete data from a table
   */
  async delete(table: string, id: string) {
    return this.supabaseClient.from(table).delete().eq('id', id);
  }
}
