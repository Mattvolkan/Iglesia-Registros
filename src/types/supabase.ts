export interface Database {
  public: {
    Tables: {
      attendance_records: {
        Row: {
          id: string
          date: string
          damas: number
          caballeros: number
          ninos: number
          jovenes: number
          ancianos: number
          visitantes: number
          registrado_por: string
          tipo_servicio: string
          otro_servicio?: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance_records']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['attendance_records']['Insert']>
      }
      visitors: {
        Row: {
          id: string
          nombre_completo: string
          telefono: string
          direccion: string
          email?: string
          fecha_registro: string
          registrado_por: string
          tipo_servicio: string
          otro_servicio?: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['visitors']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['visitors']['Insert']>
      }
    }
  }
}