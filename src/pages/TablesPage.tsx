import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  Sparkles,
  Wifi,
  ChefHat,
  AlertTriangle,
  Eye,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import initialTables from '@/data/tables.json';
import { RestaurantTable, TableFormData } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/common/EmptyState';

export const TablesPage: React.FC = () => {
  // In-memory tables state loaded from static tables.json
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables as RestaurantTable[]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [deletingTable, setDeletingTable] = useState<RestaurantTable | null>(null);
  const [previewStandTable, setPreviewStandTable] = useState<RestaurantTable | null>(null);

  // Cache generated QR data URLs by table ID
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [modalPreviewQr, setModalPreviewQr] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState<TableFormData>({
    tableNumber: '',
    tableName: '',
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState<{ tableNumber?: string; tableName?: string }>({});

  // Generate QR code data URL for a given table
  const getSimulatedUrl = (tableNumber: string, qrToken: string) => {
    return `https://restaurant-demo.local/menu/${tableNumber}?token=${qrToken}`;
  };

  // Generate QR codes for all loaded tables
  useEffect(() => {
    const generateAllQrs = async () => {
      const generated: Record<string, string> = {};
      for (const tbl of tables) {
        try {
          const url = getSimulatedUrl(tbl.tableNumber, tbl.qrToken);
          const dataUrl = await QRCode.toDataURL(url, {
            width: 320,
            margin: 2,
            color: {
              dark: '#0f172a',
              light: '#ffffff',
            },
          });
          generated[tbl.id] = dataUrl;
        } catch {
          // Fallback if error occurs
        }
      }
      setQrCodes(generated);
    };

    generateAllQrs();
  }, [tables]);

  // Live QR generation for the Add/Edit form
  useEffect(() => {
    if (!formData.tableNumber.trim()) {
      setModalPreviewQr('');
      return;
    }

    const tempToken = editingTable ? editingTable.qrToken : 'preview_token';
    const tempUrl = getSimulatedUrl(formData.tableNumber.trim(), tempToken);

    QRCode.toDataURL(tempUrl, {
      width: 260,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then((url) => setModalPreviewQr(url))
      .catch(() => setModalPreviewQr(''));
  }, [formData.tableNumber, editingTable]);

  // Form Reset
  const resetForm = () => {
    // Generate next available table number suggestion
    const nextNum = tables.length + 1;
    const formattedNum = `TABLE-${nextNum.toString().padStart(3, '0')}`;

    setFormData({
      tableNumber: formattedNum,
      tableName: '',
      status: 'Active',
    });
    setFormErrors({});
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (tbl: RestaurantTable) => {
    setFormData({
      tableNumber: tbl.tableNumber,
      tableName: tbl.tableName,
      status: tbl.status,
    });
    setFormErrors({});
    setEditingTable(tbl);
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: { tableNumber?: string; tableName?: string } = {};

    if (!formData.tableNumber.trim()) {
      errors.tableNumber = 'Table number is required (e.g. TABLE-009)';
    } else {
      // Check duplicate table number
      const duplicate = tables.find(
        (t) =>
          t.tableNumber.toLowerCase() === formData.tableNumber.trim().toLowerCase() &&
          (!editingTable || t.id !== editingTable.id)
      );
      if (duplicate) {
        errors.tableNumber = `Table number "${formData.tableNumber}" is already in use`;
      }
    }

    if (!formData.tableName.trim()) {
      errors.tableName = 'Table name or location description is required';
    } else if (formData.tableName.trim().length < 3) {
      errors.tableName = 'Table name must be at least 3 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create Table
  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newTable: RestaurantTable = {
      id: `tbl-${Date.now()}`,
      tableNumber: formData.tableNumber.trim().toUpperCase(),
      tableName: formData.tableName.trim(),
      qrToken: `tok_${formData.tableNumber.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${randomSuffix}`,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTables((prev) => [newTable, ...prev]);
    setIsAddModalOpen(false);
    resetForm();
    toast.success(`Table "${newTable.tableNumber}" created with unique QR token!`);
  };

  // Update Table
  const handleUpdateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable || !validateForm()) return;

    setTables((prev) =>
      prev.map((t) =>
        t.id === editingTable.id
          ? {
              ...t,
              tableNumber: formData.tableNumber.trim().toUpperCase(),
              tableName: formData.tableName.trim(),
              status: formData.status,
            }
          : t
      )
    );

    setEditingTable(null);
    resetForm();
    toast.success(`Table "${formData.tableNumber}" updated successfully!`);
  };

  // Delete Table
  const handleConfirmDelete = () => {
    if (!deletingTable) return;
    setTables((prev) => prev.filter((t) => t.id !== deletingTable.id));
    toast.success(`Table "${deletingTable.tableNumber}" removed from floor map.`);
    setDeletingTable(null);
  };

  // Toggle Status
  const handleToggleStatus = (tbl: RestaurantTable) => {
    const nextStatus = tbl.status === 'Active' ? 'Inactive' : 'Active';
    setTables((prev) =>
      prev.map((t) => (t.id === tbl.id ? { ...t, status: nextStatus } : t))
    );
    toast.success(`Table "${tbl.tableNumber}" is now ${nextStatus}`);
  };

  // Download QR Code PNG
  const handleDownloadQr = (table: RestaurantTable) => {
    const dataUrl = qrCodes[table.id];
    if (!dataUrl) {
      toast.error('QR code image is still generating. Please try again.');
      return;
    }

    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `${table.tableNumber}-QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toast.success(`Downloaded ${table.tableNumber}-QR.png`);
  };

  // Print Table Stand Card
  const handlePrintStand = (table: RestaurantTable) => {
    const qrImage = qrCodes[table.id];
    if (!qrImage) {
      toast.error('QR code not ready for printing.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=650,height=800');
    if (!printWindow) {
      toast.error('Please allow popups to print table stand.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Stand - ${table.tableNumber}</title>
          <style>
            @page { size: A5 portrait; margin: 10mm; }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 95vh;
              background: #ffffff;
              color: #0f172a;
              margin: 0;
              padding: 20px;
            }
            .stand-card {
              width: 380px;
              border: 2px solid #e2e8f0;
              border-radius: 20px;
              padding: 32px 24px;
              text-align: center;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            }
            .brand-badge {
              display: inline-block;
              background: #fff7ed;
              color: #F47738;
              font-weight: 700;
              font-size: 11px;
              letter-spacing: 1px;
              text-transform: uppercase;
              padding: 4px 12px;
              border-radius: 9999px;
              margin-bottom: 12px;
            }
            .restaurant-name {
              font-size: 20px;
              font-weight: 800;
              margin: 0 0 4px;
            }
            .table-badge {
              font-size: 32px;
              font-weight: 900;
              color: #F47738;
              margin: 8px 0;
              letter-spacing: -0.5px;
            }
            .table-name {
              font-size: 13px;
              color: #64748b;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .qr-wrapper {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 16px;
              display: inline-block;
              box-shadow: 0 2px 4px rgba(0,0,0,0.04);
            }
            .qr-wrapper img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .instructions {
              margin-top: 20px;
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
            }
            .sub-instructions {
              font-size: 12px;
              color: #64748b;
              margin-top: 4px;
            }
            .wifi-box {
              margin-top: 24px;
              padding: 10px 16px;
              background: #f8fafc;
              border: 1px dashed #cbd5e1;
              border-radius: 12px;
              font-size: 11px;
              color: #475569;
            }
          </style>
        </head>
        <body>
          <div class="stand-card">
            <div class="brand-badge">Guest Contactless Ordering</div>
            <h1 class="restaurant-name">The Grand Bistro</h1>
            <div class="table-badge">${table.tableNumber}</div>
            <div class="table-name">${table.tableName}</div>
            
            <div class="qr-wrapper">
              <img src="${qrImage}" alt="QR Code for ${table.tableNumber}" />
            </div>

            <div class="instructions">Scan to View Menu & Order</div>
            <div class="sub-instructions">Point your smartphone camera at this QR code</div>

            <div class="wifi-box">
              <strong>Guest Wi-Fi:</strong> BistroGuest &bull; <strong>Password:</strong> savorbistro
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Copy simulated URL
  const handleCopyUrl = (table: RestaurantTable) => {
    const url = getSimulatedUrl(table.tableNumber, table.qrToken);
    navigator.clipboard.writeText(url);
    toast.success(`Copied simulated URL for ${table.tableNumber}!`, { icon: '📋' });
  };

  // Filtered Tables
  const filteredTables = useMemo(() => {
    return tables.filter((tbl) => {
      const matchesSearch =
        tbl.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tbl.tableName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || tbl.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tables, searchQuery, statusFilter]);

  // Metrics
  const totalTablesCount = tables.length;
  const activeTablesCount = tables.filter((t) => t.status === 'Active').length;
  const inactiveTablesCount = tables.filter((t) => t.status === 'Inactive').length;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER & ACTIONS
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[11px] font-semibold text-[#F47738] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Floor Map & Table QR Codes</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tables & QR Codes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate printable QR stand cards, manage floor tables, and control guest ordering tokens.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Table
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Tables
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#F47738]">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalTablesCount}</p>
          <span className="text-[11px] text-slate-400">Total floor & patio capacity</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active QR Ordering
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{activeTablesCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for diners to scan</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Inactive / Closed
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{inactiveTablesCount}</p>
          <span className="text-[11px] text-slate-400">QR disabled / maintenance</span>
        </Card>
      </div>

      {/* =========================================================================
          CONTROLS: Search, Status Filter & View Mode
         ========================================================================= */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by table number or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F47738]/20 focus:border-[#F47738] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters & View Mode */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {(['All', 'Active', 'Inactive'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Card View"
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table List View"
              >
                Table
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          TABLES LISTING (Grid or Table)
         ========================================================================= */}
      {filteredTables.length === 0 ? (
        <EmptyState
          title="No restaurant tables found"
          description={
            searchQuery || statusFilter !== 'All'
              ? 'No tables match your current filter parameters. Try clearing your search.'
              : 'You have not added any tables yet. Generate your first QR code stand.'
          }
          icon={<QrCode className="w-8 h-8 text-[#F47738]" />}
          actionText={searchQuery || statusFilter !== 'All' ? 'Reset Filters' : 'Add First Table'}
          onAction={() => {
            if (searchQuery || statusFilter !== 'All') {
              setSearchQuery('');
              setStatusFilter('All');
            } else {
              handleOpenAddModal();
            }
          }}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW: Printable Stand Preview Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTables.map((tbl) => (
            <Card
              key={tbl.id}
              className="group hover:border-slate-300 transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden bg-white"
            >
              <div>
                {/* Top Table Card Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-[#F47738] tracking-tight">
                      {tbl.tableNumber}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">
                      {tbl.tableName}
                    </h4>
                  </div>
                  <Badge variant={tbl.status === 'Active' ? 'success' : 'default'}>
                    {tbl.status}
                  </Badge>
                </div>

                {/* QR Code Center Display */}
                <div className="p-5 flex flex-col items-center justify-center bg-slate-50/50">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs group-hover:scale-105 transition-transform duration-200">
                    {qrCodes[tbl.id] ? (
                      <img
                        src={qrCodes[tbl.id]}
                        alt={`QR code for ${tbl.tableNumber}`}
                        className="w-36 h-36 object-contain"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center bg-slate-100 rounded-xl text-slate-400">
                        <QrCode className="w-8 h-8 animate-pulse text-[#F47738]" />
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] font-semibold text-slate-600 mt-2.5 flex items-center gap-1">
                    Scan for Contactless Menu
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">
                    {tbl.qrToken}
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="px-3.5 py-3 bg-white border-t border-slate-100 flex items-center justify-between gap-1">
                {/* Print Stand Button */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewStandTable(tbl)}
                    className="text-[11px] px-2 py-1 gap-1"
                    title="Preview Printable Stand"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#F47738]" />
                    <span>Stand</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadQr(tbl)}
                    className="text-[11px] px-2 py-1"
                    title="Download QR as PNG"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrintStand(tbl)}
                    className="text-[11px] px-2 py-1"
                    title="Print Table QR Stand"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                  </Button>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(tbl)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Edit table"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingTable(tbl)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete table"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3 px-4">QR Preview</th>
                  <th scope="col" className="py-3 px-4">Table Number</th>
                  <th scope="col" className="py-3 px-4">Location / Name</th>
                  <th scope="col" className="py-3 px-4">Simulated URL</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Created Date</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTables.map((tbl) => (
                  <tr key={tbl.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Thumbnail QR */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center">
                        {qrCodes[tbl.id] ? (
                          <img
                            src={qrCodes[tbl.id]}
                            alt={tbl.tableNumber}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <QrCode className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                    </td>

                    {/* Table Number */}
                    <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                      <span className="text-[#F47738]">{tbl.tableNumber}</span>
                    </td>

                    {/* Location Name */}
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <div>{tbl.tableName}</div>
                      <span className="text-[10px] font-mono text-slate-400">{tbl.qrToken}</span>
                    </td>

                    {/* Simulated URL */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(tbl)}
                        className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors font-mono"
                        title="Click to copy simulated URL"
                      >
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>/menu/{tbl.tableNumber}</span>
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(tbl)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <Badge variant={tbl.status === 'Active' ? 'success' : 'default'}>
                          {tbl.status}
                        </Badge>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-slate-500">{tbl.createdAt}</td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewStandTable(tbl)}
                          className="text-xs text-[#F47738] hover:text-[#e05e1f]"
                          title="Preview Table Stand"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Stand
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadQr(tbl)}
                          className="text-xs text-slate-600 hover:text-slate-900"
                          title="Download PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintStand(tbl)}
                          className="text-xs text-slate-600 hover:text-slate-900"
                          title="Print Stand"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(tbl)}
                          className="text-xs text-slate-600 hover:text-slate-900"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingTable(tbl)}
                          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* =========================================================================
          ADD / EDIT TABLE MODAL
         ========================================================================= */}
      <Modal
        isOpen={isAddModalOpen || !!editingTable}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTable(null);
          resetForm();
        }}
        title={editingTable ? 'Edit Table Configuration' : 'Register New Table'}
        description={
          editingTable
            ? `Modify table number or name for ${editingTable.tableNumber}`
            : 'Generate a new QR token and assign a dining table or booth location.'
        }
        maxWidth="lg"
      >
        <form
          onSubmit={editingTable ? handleUpdateTable : handleCreateTable}
          noValidate
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Table Number */}
            <Input
              label="Table Number"
              name="tableNumber"
              placeholder="e.g. TABLE-009, BOOTH-04"
              required
              value={formData.tableNumber}
              error={formErrors.tableNumber}
              helperText="Unique floor code"
              onChange={(e) => {
                setFormData((p) => ({ ...p, tableNumber: e.target.value.toUpperCase() }));
                if (formErrors.tableNumber) {
                  setFormErrors((p) => ({ ...p, tableNumber: undefined }));
                }
              }}
            />

            {/* Table Name */}
            <Input
              label="Location / Table Name"
              name="tableName"
              placeholder="e.g. Patio Garden Pergola"
              required
              value={formData.tableName}
              error={formErrors.tableName}
              helperText="Friendly floor label"
              onChange={(e) => {
                setFormData((p) => ({ ...p, tableName: e.target.value }));
                if (formErrors.tableName) {
                  setFormErrors((p) => ({ ...p, tableName: undefined }));
                }
              }}
            />
          </div>

          {/* Live Generated QR Code Preview */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shrink-0">
              {modalPreviewQr ? (
                <img
                  src={modalPreviewQr}
                  alt="Live generated QR preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <QrCode className="w-8 h-8 text-slate-300" />
              )}
            </div>

            <div className="text-left space-y-1">
              <span className="text-[10px] font-bold text-[#F47738] uppercase tracking-wider">
                Simulated QR Link
              </span>
              <p className="text-xs font-mono text-slate-700 break-all">
                https://restaurant-demo.local/menu/{formData.tableNumber || 'TABLE-XXX'}
              </p>
              <p className="text-[11px] text-slate-400">
                Scanning this QR directly redirects diners to your active digital menu for this specific table.
              </p>
            </div>
          </div>

          {/* Table Status */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              QR Ordering Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={() => setFormData((p) => ({ ...p, status: 'Active' }))}
                  className="text-[#F47738] focus:ring-[#F47738]"
                />
                <span className="text-emerald-700 font-semibold">Active (Accepting Scans)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={() => setFormData((p) => ({ ...p, status: 'Inactive' }))}
                  className="text-[#F47738] focus:ring-[#F47738]"
                />
                <span className="text-slate-500">Inactive (Closed Table)</span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingTable(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingTable ? 'Save Changes' : 'Register Table'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* =========================================================================
          PRINTABLE RESTAURANT TABLE STAND PREVIEW MODAL
         ========================================================================= */}
      {previewStandTable && (
        <Modal
          isOpen={!!previewStandTable}
          onClose={() => setPreviewStandTable(null)}
          title="Printable Table Stand Card Preview"
          description="Designed to fit standard acrylic tabletop display stands (A5 / 4x6 inch)."
          maxWidth="md"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewStandTable(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadQr(previewStandTable)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download PNG
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handlePrintStand(previewStandTable)}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Stand Card
              </Button>
            </>
          }
        >
          <div className="flex flex-col items-center justify-center p-2">
            {/* Visual Table Stand Card Mockup */}
            <div className="w-full max-w-xs bg-white rounded-2xl border-2 border-slate-200 p-6 text-center shadow-lg relative overflow-hidden">
              {/* Decorative top accent strip */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-400 via-[#F47738] to-orange-500" />

              {/* Restaurant Branding Header */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[10px] font-bold text-[#F47738] tracking-wider uppercase mb-2">
                <ChefHat className="w-3 h-3" />
                <span>The Grand Bistro</span>
              </div>

              {/* Table Number & Name */}
              <h3 className="text-3xl font-black text-[#F47738] tracking-tight">
                {previewStandTable.tableNumber}
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {previewStandTable.tableName}
              </p>

              {/* High-Res QR Code */}
              <div className="my-5 p-3 bg-white rounded-2xl border border-slate-200 inline-block shadow-sm">
                {qrCodes[previewStandTable.id] ? (
                  <img
                    src={qrCodes[previewStandTable.id]}
                    alt={previewStandTable.tableNumber}
                    className="w-48 h-48 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-50">
                    <QrCode className="w-10 h-10 text-slate-300 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Customer Instruction */}
              <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                Scan to View Menu & Order
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Point your phone camera here to browse dishes and settle your bill.
              </p>

              {/* Guest Wi-Fi Footer Box */}
              <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-[#F47738]" />
                <span>
                  <strong>Wi-Fi:</strong> BistroGuest &bull; <strong>Pass:</strong> savorbistro
                </span>
              </div>
            </div>

            {/* Quick URL Copy Helper */}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono text-[11px]">
                /menu/{previewStandTable.tableNumber}
              </span>
              <button
                type="button"
                onClick={() => handleCopyUrl(previewStandTable)}
                className="text-[#F47738] hover:underline font-semibold inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy Link
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
         ========================================================================= */}
      <Modal
        isOpen={!!deletingTable}
        onClose={() => setDeletingTable(null)}
        title="Delete Table & QR Code"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingTable(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Confirm Delete
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Are you sure you want to delete {deletingTable?.tableNumber}?
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Diners scanning physical stands with this QR code will no longer be directed to this table's session.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-[11px] text-rose-800 font-medium">
              Location: <span className="font-semibold">{deletingTable?.tableName}</span> &bull; Token:{' '}
              <span className="font-mono font-semibold">{deletingTable?.qrToken}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TablesPage;
