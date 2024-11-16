import React, { useState } from 'react';
import { validateUser } from './auth';
import { AttendanceRecord, User, Visitante } from './types';
import LoginForm from './components/LoginForm';
import AttendanceForm from './components/AttendanceForm';
import VisitorForm from './components/VisitorForm';
import RecordsList from './components/RecordsList';
import { LogOut, ClipboardList, Users, FileText } from 'lucide-react';
import { useSupabase } from './hooks/useSupabase';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'attendance' | 'visitors' | 'records'>('attendance');
  const { records, visitors, loading, addAttendanceRecord, addVisitor } = useSupabase();

  const handleLogin = (username: string, password: string) => {
    const validUser = validateUser(username, password);
    if (validUser) {
      setUser(validUser);
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setError('');
  };

  const handleAttendanceSubmit = async (record: AttendanceRecord) => {
    try {
      await addAttendanceRecord(record);
    } catch (error) {
      console.error('Error en el registro de asistencia:', error);
    }
  };

  const handleVisitorSubmit = async (visitor: Visitante) => {
    try {
      await addVisitor(visitor);
    } catch (error) {
      console.error('Error en el registro de visitante:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <LoginForm onLogin={handleLogin} error={error} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Sistema de Registro de Asistencia
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hidden md:inline">
                Bienvenido, {user.username} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="mr-2" size={20} />
                <span className="hidden md:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'attendance'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } flex-grow md:flex-grow-0`}
          >
            <ClipboardList className="mr-2" size={20} />
            Registro de Asistencia
          </button>
          <button
            onClick={() => setActiveTab('visitors')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'visitors'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } flex-grow md:flex-grow-0`}
          >
            <Users className="mr-2" size={20} />
            Registro de Visitantes
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } flex-grow md:flex-grow-0`}
          >
            <FileText className="mr-2" size={20} />
            Ver Registros
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'attendance' && (
              <AttendanceForm onSubmit={handleAttendanceSubmit} username={user.username} />
            )}
            {activeTab === 'visitors' && (
              <VisitorForm onSubmit={handleVisitorSubmit} username={user.username} />
            )}
            {activeTab === 'records' && (
              <RecordsList records={records} visitors={visitors} user={user} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;