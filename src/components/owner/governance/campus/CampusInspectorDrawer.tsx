import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Users, 
  ShieldCheck, 
  FileText, 
  Video, 
  Bus, 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Edit3, 
  Power, 
  History, 
  Settings, 
  UserCheck, 
  Award, 
  Download,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { CampusRecord, CampusService } from '../../../../services/CampusService';

interface CampusInspectorDrawerProps {
  campus: CampusRecord | null;
  onClose: () => void;
  onEdit: (campus: CampusRecord) => void;
  onRefresh: () => void;
  userRole?: string;
  tenantId: string;
}

export const CampusInspectorDrawer: React.FC<CampusInspectorDrawerProps> = ({
  campus,
  onClose,
  onEdit,
  onRefresh,
  userRole = 'OWNER',
  tenantId
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leadership' | 'departments' | 'infrastructure' | 'compliance' | 'audit' | 'settings'>('overview');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!campus) return null;

  const capacity = campus.capacity || 500;
  const students = campus.student_count || 0;
  const fillPercent = Math.min(Math.round((students / capacity) * 100), 100);

  const handleToggleCampusStatus = async () => {
    if (!campus) return;
    setUpdatingStatus(true);
    const newStatus = campus.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await CampusService.updateCampus(campus.id, { status: newStatus }, tenantId);
      onRefresh();
    } catch (err) {
      console.error('Error toggling status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col text-left overflow-hidden border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {campus.code.slice(-2)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                  {campus.type}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {campus.code}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  campus.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${campus.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {campus.status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{campus.name}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{campus.address}, {campus.city}, {campus.state} {campus.pincode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole === 'OWNER' && (
              <button
                onClick={() => onEdit(campus)}
                className="p-2 bg-white hover:bg-slate-200/80 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}

            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100/80 px-6 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'overview', label: 'Executive Overview', icon: Building2 },
            { id: 'leadership', label: 'Leadership Roster', icon: UserCheck },
            { id: 'departments', label: 'Departments & Units', icon: Layers },
            { id: 'infrastructure', label: 'Infrastructure & Assets', icon: Video },
            { id: 'compliance', label: 'Compliance & Legal', icon: ShieldCheck },
            { id: 'audit', label: 'Audit Log Trail', icon: History },
            { id: 'settings', label: 'Operational Settings', icon: Settings }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Student Capacity</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-900">{students.toLocaleString()}</span>
                    <span className="text-slate-400 font-semibold">/ {capacity.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${fillPercent}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Faculty & Staff</span>
                  <span className="text-xl font-bold text-slate-900">{campus.staff_count || 0} Members</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Teaching & Admin Staff</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Accreditation</span>
                  <span className="text-sm font-bold text-emerald-700 block">{campus.accreditation_rating || 'Grade A'}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">{campus.affiliation_board || 'CBSE Affiliated'}</span>
                </div>
              </div>

              {/* Leadership & Location Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" /> Executive Leadership
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Principal</span>
                      <span className="font-bold text-slate-900 text-sm block">{campus.principal_name || 'Unassigned'}</span>
                      <span className="text-slate-500">{campus.principal_email || 'No email provided'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Vice Principal</span>
                      <span className="font-semibold text-slate-800 block">{campus.vice_principal_name || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Phone className="w-4 h-4 text-indigo-600" /> Contacts & Emergency Hotline
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Phone</span>
                      <span className="font-bold text-slate-900">{campus.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Email</span>
                      <span className="font-bold text-slate-900">{campus.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Emergency Hotline</span>
                      <span className="font-bold text-red-600 font-mono">{campus.emergency_hotline || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEADERSHIP TAB */}
          {activeTab === 'leadership' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Institutional Governance & Branch Roster</h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700">Primary Authority</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{campus.principal_name || 'Unassigned'}</h4>
                    <p className="text-slate-500 text-xs">{campus.principal_email} • {campus.principal_phone || 'No direct phone'}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-[10px]">Active Appointment</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-200 text-slate-700">Secondary Authority</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{campus.vice_principal_name || 'Unassigned'}</h4>
                    <p className="text-slate-500 text-xs">{campus.vice_principal_email || 'No email registered'}</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-xl font-bold text-[10px]">Vice Principal</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-200 text-slate-700">Administrative Officer</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{campus.admin_officer_name || 'Unassigned'}</h4>
                  </div>
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-xl font-bold text-[10px]">Operations Lead</span>
                </div>
              </div>
            </div>
          )}

          {/* DEPARTMENTS TAB */}
          {activeTab === 'departments' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Active Campus Academic Departments</h3>
                <span className="text-xs font-bold text-slate-500">{campus.departments?.length || 0} Units Registered</span>
              </div>

              {campus.departments && campus.departments.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {campus.departments.map(dept => (
                    <div key={dept.id} className="p-4 bg-white hover:bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{dept.name}</span>
                          <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{dept.code}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Department Head: <span className="font-bold text-slate-700">{dept.head_name}</span></p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">{dept.student_count} Students</span>
                        <span className="text-[10px] text-slate-400 block">{dept.faculty_count} Faculty Staff</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic py-6 text-center">No active departments linked to this branch yet.</p>
              )}
            </div>
          )}

          {/* INFRASTRUCTURE TAB */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Physical Facilities & Tech Assets</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Classrooms</span>
                  <span className="text-lg font-bold text-slate-900">{campus.classrooms_count || 0} Rooms</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{campus.smart_boards_percent || 0}% Smart Classrooms</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Laboratories</span>
                  <span className="text-lg font-bold text-slate-900">{campus.labs_count || 0} Science/AI Labs</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Surveillance & CCTV</span>
                  <span className="text-lg font-bold text-slate-900">{campus.cctv_cameras_count || 0} IP Cameras</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">● CCTV Monitoring Active</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Transport Fleet</span>
                  <span className="text-lg font-bold text-slate-900">{campus.transport_fleet_count || 0} Buses</span>
                </div>
              </div>
            </div>
          )}

          {/* COMPLIANCE TAB */}
          {activeTab === 'compliance' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Board Affiliations & Regulatory Charters</h3>
              {campus.documents && campus.documents.length > 0 ? (
                <div className="space-y-3">
                  {campus.documents.map(doc => (
                    <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-200 text-slate-700">{doc.category}</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{doc.title}</h4>
                        <p className="text-xs text-slate-500 font-mono">No. {doc.document_number} • Issued by {doc.issued_by}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-[10px]">Valid until {doc.expiry_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic py-6 text-center">No legal charter documents on file.</p>
              )}
            </div>
          )}

          {/* AUDIT LOG TAB */}
          {activeTab === 'audit' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Administrative Event & Audit Trail</h3>
              {campus.activity_logs && campus.activity_logs.length > 0 ? (
                <div className="space-y-3">
                  {campus.activity_logs.map(log => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{log.event}</span>
                        <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-600">{log.details}</p>
                      <span className="text-[10px] font-bold text-indigo-600 block">Actor: {log.actor} ({log.role})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic py-6 text-center">No recent audit events recorded for this campus node.</p>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Campus Administrative Controls</h3>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">Campus Operational Status</h4>
                    <p className="text-slate-500 text-xs">Activate or temporarily pause administrative services for this branch node.</p>
                  </div>

                  {userRole === 'OWNER' && (
                    <button
                      onClick={handleToggleCampusStatus}
                      disabled={updatingStatus}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        campus.status === 'ACTIVE' 
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {campus.status === 'ACTIVE' ? 'Deactivate Branch' : 'Reactivate Branch'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
