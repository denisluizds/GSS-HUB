import { getSupabase } from '@/lib/supabase';

export interface Aviso {
  id?: number;
  titulo: string;
  conteudo: string;
  data_criacao?: string;
  autor?: string;
}

export const supabaseService = {
  async getAvisos() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('avisos')
      .select('*')
      .order('data_criacao', { ascending: false });

    if (error) {
      console.error('Error fetching avisos:', error);
      return [];
    }

    return data as Aviso[];
  },

  async createAviso(aviso: Aviso) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('avisos')
      .insert([aviso])
      .select();

    if (error) {
      console.error('Error creating aviso:', error);
      throw error;
    }

    return data[0] as Aviso;
  },

  async deleteAviso(id: number) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('avisos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting aviso:', error);
      throw error;
    }
  }
};
