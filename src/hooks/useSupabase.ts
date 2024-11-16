import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AttendanceRecord, Visitante } from '../types';
import toast from 'react-hot-toast';

export function useSupabase() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [visitors, setVisitors] = useState<Visitante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    setupSubscriptions();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: attendanceData }, { data: visitorsData }] = await Promise.all([
        supabase.from('attendance_records').select('*').order('date', { ascending: false }),
        supabase.from('visitors').select('*').order('fecha_registro', { ascending: false })
      ]);

      if (attendanceData) {
        setRecords(attendanceData.map(record => ({
          date: record.date,
          damas: record.damas,
          caballeros: record.caballeros,
          ninos: record.ninos,
          jovenes: record.jovenes,
          ancianos: record.ancianos,
          visitantes: record.visitantes,
          registradoPor: record.registrado_por,
          tipoServicio: record.tipo_servicio as any,
          otroServicio: record.otro_servicio
        })));
      }

      if (visitorsData) {
        setVisitors(visitorsData.map(visitor => ({
          id: visitor.id,
          nombreCompleto: visitor.nombre_completo,
          telefono: visitor.telefono,
          direccion: visitor.direccion,
          email: visitor.email,
          fechaRegistro: visitor.fecha_registro,
          registradoPor: visitor.registrado_por,
          tipoServicio: visitor.tipo_servicio as any,
          otroServicio: visitor.otro_servicio
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const setupSubscriptions = () => {
    const attendanceSubscription = supabase
      .channel('attendance_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, fetchData)
      .subscribe();

    const visitorsSubscription = supabase
      .channel('visitors_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitors' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(attendanceSubscription);
      supabase.removeChannel(visitorsSubscription);
    };
  };

  const addAttendanceRecord = async (record: AttendanceRecord) => {
    try {
      const { error } = await supabase.from('attendance_records').insert({
        date: record.date,
        damas: record.damas,
        caballeros: record.caballeros,
        ninos: record.ninos,
        jovenes: record.jovenes,
        ancianos: record.ancianos,
        visitantes: record.visitantes,
        registrado_por: record.registradoPor,
        tipo_servicio: record.tipoServicio,
        otro_servicio: record.otroServicio
      });

      if (error) throw error;
      toast.success('Registro guardado exitosamente');
    } catch (error) {
      console.error('Error adding attendance record:', error);
      toast.error('Error al guardar el registro');
      throw error;
    }
  };

  const addVisitor = async (visitor: Visitante) => {
    try {
      const { error } = await supabase.from('visitors').insert({
        nombre_completo: visitor.nombreCompleto,
        telefono: visitor.telefono,
        direccion: visitor.direccion,
        email: visitor.email,
        fecha_registro: visitor.fechaRegistro,
        registrado_por: visitor.registradoPor,
        tipo_servicio: visitor.tipoServicio,
        otro_servicio: visitor.otroServicio
      });

      if (error) throw error;
      toast.success('Visitante registrado exitosamente');
    } catch (error) {
      console.error('Error adding visitor:', error);
      toast.error('Error al registrar el visitante');
      throw error;
    }
  };

  return {
    records,
    visitors,
    loading,
    addAttendanceRecord,
    addVisitor
  };
}