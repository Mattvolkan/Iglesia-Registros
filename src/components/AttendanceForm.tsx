import React, { useState } from 'react';
import { Users, Save } from 'lucide-react';
import { AttendanceRecord, ServiceType } from '../types';

interface AttendanceFormProps {
  onSubmit: (record: AttendanceRecord) => void;
  username: string;
}

export default function AttendanceForm({ onSubmit, username }: AttendanceFormProps) {
  const [attendance, setAttendance] = useState({
    damas: 0,
    caballeros: 0,
    ninos: 0,
    jovenes: 0,
    ancianos: 0,
    visitantes: 0,
    registradoPor: '',
    tipoServicio: 'Escuela Dominical' as ServiceType,
    otroServicio: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...attendance,
      date: new Date().toISOString(),
      registradoPor: attendance.registradoPor || username,
    });
    // Reset form
    setAttendance({
      damas: 0,
      caballeros: 0,
      ninos: 0,
      jovenes: 0,
      ancianos: 0,
      visitantes: 0,
      registradoPor: '',
      tipoServicio: 'Escuela Dominical',
      otroServicio: '',
    });
  };

  const handleChange = (field: keyof typeof attendance) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setAttendance((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Users className="text-blue-600 mr-2" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Registro de Asistencia</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Servidor que Registra
            </label>
            <input
              type="text"
              value={attendance.registradoPor}
              onChange={handleChange('registradoPor')}
              placeholder={username}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Servicio
            </label>
            <select
              value={attendance.tipoServicio}
              onChange={handleChange('tipoServicio')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Escuela Dominical">Escuela Dominical</option>
              <option value="Servicio de Adoracion y Sanidad">Servicio de Adoración y Sanidad</option>
              <option value="Culto Juvenil">Culto Juvenil</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {attendance.tipoServicio === 'Otro' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Especificar Otro Servicio
              </label>
              <input
                type="text"
                value={attendance.otroServicio}
                onChange={handleChange('otroServicio')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Damas</label>
            <input
              type="number"
              min="0"
              value={attendance.damas}
              onChange={handleChange('damas')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Caballeros</label>
            <input
              type="number"
              min="0"
              value={attendance.caballeros}
              onChange={handleChange('caballeros')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Niños</label>
            <input
              type="number"
              min="0"
              value={attendance.ninos}
              onChange={handleChange('ninos')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Jóvenes</label>
            <input
              type="number"
              min="0"
              value={attendance.jovenes}
              onChange={handleChange('jovenes')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ancianos</label>
            <input
              type="number"
              min="0"
              value={attendance.ancianos}
              onChange={handleChange('ancianos')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Visitantes</label>
            <input
              type="number"
              min="0"
              value={attendance.visitantes}
              onChange={handleChange('visitantes')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="mr-2" size={20} />
            Guardar Registro
          </button>
        </div>
      </form>
    </div>
  );
}