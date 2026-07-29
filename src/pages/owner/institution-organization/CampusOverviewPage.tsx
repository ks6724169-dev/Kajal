import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  List, 
  Download, 
  Printer, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  RefreshCw,
  Sparkles,
  MapPin,
  TrendingUp,
  Layers
} from 'lucide-react';
import { Tenant } from '../../../types';
import { CampusService, CampusRecord } from '../../../services/CampusService';
import { CampusCardView } from '../../../components/owner/governance/campus/CampusCardView';
import { CampusTableView } from '../../../components/owner/governance/campus/CampusTableView';
import { CampusCreationWizardModal } from '../../../components/owner/governance/campus/CampusCreationWizardModal';
import { CampusInspectorDrawer } from '../../../components/owner/governance/campus/CampusInspectorDrawer';

interface CampusOverviewPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
  userRole?: string; // OWNER, PRINCIPAL, VICE_PRINCIPAL
}

export const CampusOverviewPage: React.FC<CampusOverviewPageProps> = ({ 
  tenant, 
  onNavigate,
  userRole = 'OWNER'
}) => {
  const [loading, setLoading] = useState(true);
  const [campuses, setCampuses] = useState<CampusRecord[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modals & Drawers
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState<CampusRecord | null>(null);
  const [inspectedCampus, setInspectedCampus] = useState<CampusRecord | null>(null);

  const effectiveTenantId = tenant?.id || 'apex_k12';

  const loadCampuses = async () => {
    setLoading(true);
    try {
      const data = await CampusService.getCampuses(effectiveTenantId);
      setCampuses(data);
    } catch (err) {
      console.error('Campus Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampuses();
  }, [effectiveTenantId]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedForEdit(null);
    setShowWizardModal(true);
  };

  const handleOpenEdit = (campus: CampusRecord) => {
    setSelectedForEdit(campus);
    setShowWizardModal(true);
  };

  const handleWizardSubmit = async (formData: Partial<CampusRecord>) => {
    if (selectedForEdit) {
      await CampusService.updateCampus(selectedForEdit.id, formData, effectiveTenantId);
    } else {
      await CampusService.createCampus(formData, effectiveTenantId);
    }
    loadCampuses();
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Code', 'Type', 'City', 'State', 'Principal', 'Students', 'Capacity', 'Status'];
    const rows = campuses.map(c => [
      `"${c.name}"`,
      `"${c.code}"`,
      `"${c.type}"`,
      `"${c.city}"`,
      `"${c.state}"`,
      `"${c.principal_name || ''}"`,
      c.student_count || 0,
      c.capacity || 0,
      `"${c.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Galaxy_ERP_Campus_Registry_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintRegistry = () => {
    window.print();
  };

  // Filter Logic
  const filteredCampuses = campuses.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch = 
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.principal_name && c.principal_name.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (typeFilter !== 'ALL' && c.type !== typeFilter) {
      return false;
    }

    if (statusFilter !== 'ALL' && c.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Calculate Metrics
  const totalCampuses = campuses.length;
  const activeCampuses = campuses.filter(c => c.status === 'ACTIVE').length;
  const totalCapacity = campuses.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const totalStudents = campuses.reduce((acc, curr) => acc + (curr.student_count || 0), 0);
  const totalStaff = campuses.reduce((acc, curr) => acc + (curr.staff_count || 0), 0);
  const capacityUtilization = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <div className="w-12 h-12 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Retrieving Enterprise Branch Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left pb-12">
      {/* Page Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Institution Administration & Governance → Campus Network
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Registry & Branch Profiling</h1>
          <p className="text-slate-500 text-xs mt-0.5 max-w-2xl">
            Centralized multi-location control, branch leadership rosters, capacity telemetry, and institutional compliance monitoring.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadCampuses}
            title="Refresh Registry"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>

          <button
            onClick={handlePrintRegistry}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Summary
          </button>

          {userRole === 'OWNER' && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Provision Campus
            </button>
          )}
        </div>
      </div>

      {/* KPI & Telemetry Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Campus Branches</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalCampuses}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {activeCampuses} Active
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Multi-location operational nodes</p>
        </div>

        {/* Card 2 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Capacity Utilization</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{capacityUtilization}%</span>
            <span className="text-xs text-slate-500">({totalStudents.toLocaleString()} / {totalCapacity.toLocaleString()})</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${capacityUtilization}%` }} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Institution Workforce</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalStaff}</span>
            <span className="text-xs font-bold text-slate-600">Faculty & Staff</span>
          </div>
          <p className="text-[10px] text-slate-500">Assigned across branch locations</p>
        </div>

        {/* Card 4 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Compliance Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">100%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Charters Valid</span>
          </div>
          <p className="text-[10px] text-slate-500">CBSE / IB / Municipal Board verified</p>
        </div>
      </div>

      {/* Filter & View Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campus name, code, city, principal..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none cursor-pointer"
          >
            <option value="ALL">All Branch Types</option>
            <option value="PRIMARY">PRIMARY (HQ)</option>
            <option value="SECONDARY">SECONDARY (Regional)</option>
            <option value="SATELLITE">SATELLITE (Wing)</option>
            <option value="SPECIALIZATION">SPECIALIZATION</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          {/* View Mode Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
            <button
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('table')}
              title="Enterprise Table View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Display: Grid or Table */}
      {viewMode === 'grid' ? (
        <CampusCardView
          campuses={filteredCampuses}
          onSelectCampus={(campus) => setInspectedCampus(campus)}
          onEditCampus={handleOpenEdit}
          onToggleStatus={(c) => {}}
          userRole={userRole}
        />
      ) : (
        <CampusTableView
          campuses={filteredCampuses}
          onSelectCampus={(campus) => setInspectedCampus(campus)}
          onEditCampus={handleOpenEdit}
          onToggleStatus={(c) => {}}
          userRole={userRole}
        />
      )}

      {/* Multi-Step Creation / Edit Wizard Modal */}
      <CampusCreationWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        onSubmit={handleWizardSubmit}
        initialData={selectedForEdit}
      />

      {/* Deep Branch Inspector Drawer */}
      <CampusInspectorDrawer
        campus={inspectedCampus}
        onClose={() => setInspectedCampus(null)}
        onEdit={handleOpenEdit}
        onRefresh={loadCampuses}
        userRole={userRole}
        tenantId={effectiveTenantId}
      />
    </div>
  );
};
