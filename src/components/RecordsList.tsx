import React, { useState } from 'react';
import { FileText, Users, Filter, Download } from 'lucide-react';
import { AttendanceRecord, Visitante, ServiceType } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface RecordsListProps {
  records: AttendanceRecord[];
  visitors: Visitante[];
  user?: { username: string; role: string };
}

export default function RecordsList({ records, visitors, user }: RecordsListProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'visitors'>('attendance');
  const [filters, setFilters] = useState({
    servidor: '',
    mes: '',
    tipoServicio: '' as ServiceType | '',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const uniqueServers = new Set([
    ...records.map(r => r.registradoPor),
    ...visitors.map(v => v.registradoPor)
  ]);

  const filteredRecords = records.filter(record => {
    const matchesServidor = !filters.servidor || record.registradoPor === filters.servidor;
    const matchesMes = !filters.mes || getMonthYear(record.date) === filters.mes;
    const matchesServicio = !filters.tipoServicio || record.tipoServicio === filters.tipoServicio;
    return matchesServidor && matchesMes && matchesServicio;
  });

  const filteredVisitors = visitors.filter(visitor => {
    const matchesServidor = !filters.servidor || visitor.registradoPor === filters.servidor;
    const matchesMes = !filters.mes || getMonthYear(visitor.fechaRegistro) === filters.mes;
    const matchesServicio = !filters.tipoServicio || visitor.tipoServicio === filters.tipoServicio;
    return matchesServidor && matchesMes && matchesServicio;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = activeTab === 'attendance' ? 'Registros de Asistencia' : 'Registro de Visitantes';
    doc.text(title, 14, 15);

    if (activeTab === 'attendance') {
      const headers = [['Fecha', 'Servicio', 'Damas', 'Caballeros', 'Niños', 'Jóvenes', 'Ancianos', 'Visitantes', 'Registrado Por']];
      const data = filteredRecords.map(record => [
        formatDate(record.date),
        record.tipoServicio === 'Otro' ? record.otroServicio : record.tipoServicio,
        record.damas.toString(),
        record.caballeros.toString(),
        record.ninos.toString(),
        record.jovenes.toString(),
        record.ancianos.toString(),
        record.visitantes.toString(),
        record.registradoPor
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 25,
      });
    } else {
      const headers = [['Fecha', 'Servicio', 'Nombre', 'Teléfono', 'Dirección', 'Email', 'Registrado Por']];
      const data = filteredVisitors.map(visitor => [
        formatDate(visitor.fechaRegistro),
        visitor.tipoServicio === 'Otro' ? visitor.otroServicio : visitor.tipoServicio,
        visitor.nombreCompleto,
        visitor.telefono,
        visitor.direccion,
        visitor.email || '-',
        visitor.registradoPor
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 25,
      });
    }

    doc.save(`registros-${activeTab}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    let data;
    let totals = {
      damas: 0,
      caballeros: 0,
      ninos: 0,
      jovenes: 0,
      ancianos: 0,
      visitantes: 0
    };
  
    if (activeTab === 'attendance') {
      // Calculate totals
      filteredRecords.forEach(record => {
        totals.damas += record.damas;
        totals.caballeros += record.caballeros;
        totals.ninos += record.ninos;
        totals.jovenes += record.jovenes;
        totals.ancianos += record.ancianos;
        totals.visitantes += record.visitantes;
      });
  
      data = [
        // Headers
        ['Fecha', 'Servicio', 'Damas', 'Caballeros', 'Niños', 'Jóvenes', 'Ancianos', 'Visitantes', 'Registrado Por'],
        // Data rows
        ...filteredRecords.map(record => [
          formatDate(record.date),
          record.tipoServicio === 'Otro' ? record.otroServicio : record.tipoServicio,
          record.damas,
          record.caballeros,
          record.ninos,
          record.jovenes,
          record.ancianos,
          record.visitantes,
          record.registradoPor
        ]),
        // Empty row
        [],
        // Totals
        ['TOTALES', '', totals.damas, totals.caballeros, totals.ninos, totals.jovenes, totals.ancianos, totals.visitantes, '']
      ];
    } else {
      data = [
        // Headers
        ['Fecha', 'Servicio', 'Nombre', 'Teléfono', 'Dirección', 'Email', 'Registrado Por'],
        // Data rows
        ...filteredVisitors.map(visitor => [
          formatDate(visitor.fechaRegistro),
          visitor.tipoServicio === 'Otro' ? visitor.otroServicio : visitor.tipoServicio,
          visitor.nombreCompleto,
          visitor.telefono,
          visitor.direccion,
          visitor.email || '-',
          visitor.registradoPor
        ])
      ];
    }
  
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
  
    // Set column widths
    const colWidths = activeTab === 'attendance' 
      ? [20, 30, 10, 10, 10, 10, 10, 10, 20]
      : [20, 30, 30, 15, 40, 30, 20];
    
    ws['!cols'] = colWidths.map(width => ({ width }));
  
    // Add autofilter
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    ws['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(range.e.c)}1` };
  
    // Style the totals row if it's attendance data
    if (activeTab === 'attendance') {
      const lastRow = data.length;
      const totalsRow = lastRow - 1;
      
      // Bold font for totals row
      for (let col = 0; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: totalsRow, c: col });
        if (!ws[cellRef]) ws[cellRef] = {};
        ws[cellRef].s = { font: { bold: true } };
      }
    }
  
    XLSX.utils.book_append_sheet(wb, ws, activeTab === 'attendance' ? 'Asistencia' : 'Visitantes');
    XLSX.writeFile(wb, `registros-${activeTab}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToWord = () => {
    let tableHTML;
    if (activeTab === 'attendance') {
      tableHTML = `
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Servicio</th>
              <th>Damas</th>
              <th>Caballeros</th>
              <th>Niños</th>
              <th>Jóvenes</th>
              <th>Ancianos</th>
              <th>Visitantes</th>
              <th>Registrado Por</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map(record => `
              <tr>
                <td>${formatDate(record.date)}</td>
                <td>${record.tipoServicio === 'Otro' ? record.otroServicio : record.tipoServicio}</td>
                <td>${record.damas}</td>
                <td>${record.caballeros}</td>
                <td>${record.ninos}</td>
                <td>${record.jovenes}</td>
                <td>${record.ancianos}</td>
                <td>${record.visitantes}</td>
                <td>${record.registradoPor}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      tableHTML = `
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Servicio</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Email</th>
              <th>Registrado Por</th>
            </tr>
          </thead>
          <tbody>
            ${filteredVisitors.map(visitor => `
              <tr>
                <td>${formatDate(visitor.fechaRegistro)}</td>
                <td>${visitor.tipoServicio === 'Otro' ? visitor.otroServicio : visitor.tipoServicio}</td>
                <td>${visitor.nombreCompleto}</td>
                <td>${visitor.telefono}</td>
                <td>${visitor.direccion}</td>
                <td>${visitor.email || '-'}</td>
                <td>${visitor.registradoPor}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    const blob = new Blob([`
      <html>
        <head>
          <meta charset="utf-8">
          <title>Registros</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${activeTab === 'attendance' ? 'Registros de Asistencia' : 'Registro de Visitantes'}</h1>
          ${tableHTML}
        </body>
      </html>
    `], { type: 'application/msword' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registros-${activeTab}-${new Date().toISOString().split('T')[0]}.doc`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FileText className="mr-2" size={20} />
          Registros de Asistencia
        </button>
        <button
          onClick={() => setActiveTab('visitors')}
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === 'visitors'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="mr-2" size={20} />
          Registro de Visitantes
        </button>
        
        {user?.role === 'pastor' && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="mr-2" size={20} />
              PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="mr-2" size={20} />
              Excel
            </button>
            <button
              onClick={exportToWord}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="mr-2" size={20} />
              Word
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex items-center mb-4">
          <Filter className="text-blue-600 mr-2" size={20} />
          <h3 className="text-lg font-semibold">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servidor
            </label>
            <select
              value={filters.servidor}
              onChange={(e) => setFilters(prev => ({ ...prev, servidor: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos</option>
              {Array.from(uniqueServers).map(servidor => (
                <option key={servidor} value={servidor}>{servidor}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mes
            </label>
            <input
              type="month"
              value={filters.mes}
              onChange={(e) => setFilters(prev => ({ ...prev, mes: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Servicio
            </label>
            <select
              value={filters.tipoServicio}
              onChange={(e) => setFilters(prev => ({ ...prev, tipoServicio: e.target.value as ServiceType | '' }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="Escuela Dominical">Escuela Dominical</option>
              <option value="Servicio de Adoracion y Sanidad">Servicio de Adoración y Sanidad</option>
              <option value="Culto Juvenil">Culto Juvenil</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {activeTab === 'attendance' ? 'Registros de Asistencia' : 'Registro de Visitantes'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          {activeTab === 'attendance' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Damas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caballeros</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niños</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jóvenes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ancianos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitantes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrado Por</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.tipoServicio === 'Otro' ? record.otroServicio : record.tipoServicio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.damas}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.caballeros}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.ninos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.jovenes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.ancianos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.visitantes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.registradoPor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrado Por</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(visitor.fechaRegistro)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visitor.tipoServicio === 'Otro' ? visitor.otroServicio : visitor.tipoServicio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.nombreCompleto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.telefono}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.direccion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.registradoPor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
