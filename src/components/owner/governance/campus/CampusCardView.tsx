import React from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck,
  Video,
  Bus,
  Layers,
  MoreVertical
} from 'lucide-react';
import { CampusRecord } from '../../../../services/CampusService';

interface CampusCardViewProps {
  campuses: CampusRecord[];
  onSelectCampus: (campus: CampusRecord) => void;
  onEditCampus: (campus: CampusRecord) => void;
  onToggleStatus: (campus: CampusRecord) => void;
  userRole?: string;
}

export const CampusCardView: React.FC<CampusCardViewProps> = ({
  campuses,
  onSelectCampus,
  onEditCampus,
  onToggleStatus,
  userRole = 'OWNER'
}) => {
  if (campuses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Branch Campuses Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No institutional nodes match your current filter or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {campuses.map((campus) => {
        const capacity = campus.capacity || 500;
        const students = campus.student_count || 0;
        const fillPercent = Math.min(Math.round((students / capacity) * 100), 100);
        
        const isCompliant = campus.compliance_status === 'COMPLIANT';
        const needsAudit = campus.compliance_status === 'NEEDS_AUDIT';

        return (
          <div 
            key={campus.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
          >
            {/* Top Banner */}
            <div className="p-5 pb-4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    campus.type === 'PRIMARY' 
                      ? 'bg-indigo-100 text-indigo-700'
                      : campus.type === 'SECONDARY'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {campus.type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {campus.code}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    campus.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${campus.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {campus.status}
                  </span>
                </div>
              </div>

              <h2 
                onClick={() => onSelectCampus(campus)}
                className="text-base font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>{campus.name}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
              </h2>

              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{campus.city}, {campus.state} — {campus.address}</span>
              </p>
            </div>

            {/* Metrics & Telemetry Grid */}
            <div className="p-5 space-y-4 bg-slate-50/50">
              {/* Capacity Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    Students Enrolled
                  </span>
                  <span className="font-bold text-slate-900">
                    {students.toLocaleString()} <span className="text-slate-400 font-normal">/ {capacity.toLocaleString()} ({fillPercent}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      fillPercent > 90 ? 'bg-amber-500' : fillPercent > 75 ? 'bg-indigo-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>

              {/* Leadership & Quick Stats Pill Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Campus Principal</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {campus.principal_name || 'Unassigned'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Faculty & Staff</span>
                  <span className="font-bold text-slate-800 block">
                    {campus.staff_count || 0} Members
                  </span>
                </div>
              </div>

              {/* Asset Readiness Badges */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1" title="CCTV Cameras Active">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{campus.cctv_cameras_count || 0}</span>
                  </span>
                  <span className="flex items-center gap-1" title="Transport Buses">
                    <Bus className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{campus.transport_fleet_count || 0}</span>
                  </span>
                  <span className="flex items-center gap-1" title="Departments Count">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{campus.departments?.length || 0}</span>
                  </span>
                </div>

                <div>
                  {isCompliant && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                    </span>
                  )}
                  {needsAudit && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Needs Audit
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectCampus(campus)}
                className="flex-1 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Inspect Branch Profile
              </button>

              {userRole === 'OWNER' && (
                <button
                  onClick={() => onEditCampus(campus)}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
