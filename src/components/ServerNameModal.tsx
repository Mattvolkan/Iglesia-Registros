import React, { useState } from 'react';
import { UserCircle2 } from 'lucide-react';

interface ServerNameModalProps {
  onSubmit: (serverName: string) => void;
  username: string;
}

export default function ServerNameModal({ onSubmit, username }: ServerNameModalProps) {
  const [serverName, setServerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(serverName || username);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <UserCircle2 className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Bienvenido, Servidor</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Por favor, ingresa tu nombre completo
            </label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder={username}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}