import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Visitante, ServiceType } from '../types';

interface VisitorFormProps {
  onSubmit: (visitor: Visitante) => void;
  username: string;
}

export default function VisitorForm({ onSubmit, username }: VisitorFormProps) {
  const [visitor, setVisitor] = useState({
    nombreCompleto: '',
    telefono: '',
    direccion: '',
    email: '',
    registradoPor: '',
    tipoServicio: 'Escuela Dominical' as ServiceType,
    otroServicio: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...visitor,
      id: Date.now().toString(),
      fechaRegistro: new Date().toISOString(),
      registradoPor: visitor.registradoPor || username,
    });
    // Reset form
    setVisitor({
      nombreCompleto: '',
      telefono: '',
      direccion: '',
      email: '',
      registradoPor: '',
      tipoServicio: 'Escuela Dominical',
      otroServicio: '',
    });
  };

  const handleChange = (field: keyof typeof visitor) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setVisitor(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <UserPlus className="text-blue-600 mr-2" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Registro de Visitantes</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Servidor que Registra
            </label>
            <input
              type="text"
              value={visitor.registradoPor}
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
              value={visitor.tipoServicio}
              onChange={handleChange('tipoServicio')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Escuela Dominical">Escuela Dominical</option>
              <option value="Servicio de Adoracion y Sanidad">Servicio de Adoración y Sanidad</option>
              <option value="Culto Juvenil">Culto Juvenil</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {visitor.tipoServicio === 'Otro' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Especificar Otro Servicio
              </label>
              <input
                type="text"
                value={visitor.otroServicio}
                onChange={handleChange('otroServicio')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              value={visitor.nombreCompleto}
              onChange={handleChange('nombreCompleto')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              value={visitor.telefono}
              onChange={handleChange('telefono')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              value={visitor.direccion}
              onChange={handleChange('direccion')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email (Opcional)
            </label>
            <input
              type="email"
              value={visitor.email}
              onChange={handleChange('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <UserPlus className="mr-2" size={20} />
            Registrar Visitante
          </button>
        </div>
      </form>
    </div>
  );
}