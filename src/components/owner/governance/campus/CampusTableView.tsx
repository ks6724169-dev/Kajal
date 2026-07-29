import React from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical,
  ExternalLink,
  Edit2,
  Power,
  Layers,
  Phone,
  Mail
} from 'lucide-react';
import { CampusRecord } from '../../../../services/CampusService';

interface CampusTableViewProps {
  campuses: CampusRecord[];
  onSelectCampus: (campus: CampusRecord) => void;
  onEditCampus: (campus: CampusRecord) => void;
  onToggleStatus: (campus: CampusRecord) => void;
  userRole?: string;
}

export const CampusTableView: React.FC<CampusTableViewProps> = ({
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Campus Name & Code</th>
              <th className="py-3.5 px-4">Branch Type</th>
              <th className="py-3.5 px-4">Location & Address</th>
              <th className="py-3.5 px-4">Leadership (Principal)</th>
              <th className="py-3.5 px-4">Capacity & Students</th>
              <th className="py-3.5 px-4">Compliance</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {campuses.map((campus) => {
              const capacity = campus.capacity || 500;
              const students = campus.student_count || 0;
              const fillPercent = Math.min(Math.round((students / capacity) * 100), 100);

              return (
                <tr 
                  key={campus.id}
                  className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                  onClick={() => onSelectCampus(campus)}
                >
                  {/* Name & Code */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                        {campus.code.slice(-2)}
                      </div>
                      <div>
                        <span className="block font-bold">{campus.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{campus.code} • Est. {campus.established_year || 'N/A'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      campus.type === 'PRIMARY' 
                        ? 'bg-indigo-100 text-indigo-700'
                        : campus.type === 'SECONDARY'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {campus.type}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{campus.city}, {campus.state}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">{campus.address}</span>
                  </td>

                  {/* Principal */}
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">
                    <span className="block text-slate-900 font-bold">{campus.principal_name || 'Unassigned'}</span>
                    {campus.principal_email && (
                      <span className="text-[10px] text-slate-400 block">{campus.principal_email}</span>
                    )}
                  </td>

                  {/* Capacity & Students */}
                  <td className="py-3.5 px-4">
                    <div className="w-36">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-0.5">
                        <span>{students.toLocaleString()} enrolled</span>
                        <span>{fillPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            fillPercent > 90 ? 'bg-amber-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Max: {capacity.toLocaleString()}</span>
                    </div>
                  </td>

                  {/* Compliance */}
                  <td className="py-3.5 px-4">
                    {campus.compliance_status === 'COMPLIANT' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Compliant
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Needs Audit
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      campus.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${campus.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {campus.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectCampus(campus)}
                        title="Inspect Branch Profile"
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      {userRole === 'OWNER' && (
                        <button
                          onClick={() => onEditCampus(campus)}
                          title="Edit Campus Details"
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
