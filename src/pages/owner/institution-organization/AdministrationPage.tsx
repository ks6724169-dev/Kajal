import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Lock, 
  RefreshCw,
  Fingerprint,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Users,
  X,
  Loader2,
  UserCheck,
  UserX,
  Building2,
  Sliders,
  Mail,
  Phone,
  Check
} from 'lucide-react';
import { Tenant, Role } from '../../../types';
import { motion } from 'motion/react';
import { AuditLogger } from '../../../services/AuditLogger';
import { UserService, InstitutionUser, ScopeType, GovernanceSettings } from '../../../services/UserService';
import { CampusService, Campus } from '../../../services/CampusService';
import { DepartmentService, Department } from '../../../services/DepartmentService';
import { useAuth } from '../../../hooks/useAuth';

interface AdministrationPageProps {
  tenant: Tenant;
  onNavigate: (path: string) => void;
}

export const AdministrationPage: React.FC<AdministrationPageProps> = ({ tenant, onNavigate }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [usersList, setUsersList] = useState<InstitutionUser[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [govSettings, setGovSettings] = useState<GovernanceSettings>({
    allow_principal_assign_vp: true,
    strict_campus_isolation: true,
    require_owner_approval_for_vp: false
  });

  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    phone: string;
    role: Role;
    scopeType: ScopeType;
    campusId: string;
    departmentId: string;
    permissions: string[];
  }>({
    name: '',
    email: '',
    phone: '',
    role: 'principal',
    scopeType: 'CAMPUS',
    campusId: '',
    departmentId: '',
    permissions: ['CAMPUS_MANAGE', 'ACADEMIC_MANAGE', 'STUDENT_MANAGE']
  });

  const effectiveTenantId = tenant?.id || 'apex_k12';

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, campusData, deptData, govData] = await Promise.all([
        UserService.getInstitutionUsers(effectiveTenantId),
        CampusService.getCampuses(effectiveTenantId),
        DepartmentService.getDepartments(effectiveTenantId),
        UserService.getGovernanceSettings(effectiveTenantId)
      ]);

      setUsersList(usersData);
      setCampuses(campusData);
      setDepartments(deptData);
      setGovSettings(govData);

      if (campusData.length > 0 && !newUser.campusId) {
        setNewUser(prev => ({ ...prev, campusId: campusData[0].id }));
      }
      if (deptData.length > 0 && !newUser.departmentId) {
        setNewUser(prev => ({ ...prev, departmentId: deptData[0].id }));
      }
    } catch (err) {
      console.error('Error loading administration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [effectiveTenantId]);

  const handleToggleGovSetting = async (key: keyof GovernanceSettings) => {
    const updated = { ...govSettings, [key]: !govSettings[key] };
    setGovSettings(updated);
    await UserService.updateGovernanceSettings(effectiveTenantId, updated);

    AuditLogger.log({
      eventType: 'GOVERNANCE_SETTING_UPDATED',
      details: `Governance rule '${key}' updated to ${updated[key]}`,
      tenantId: effectiveTenantId,
      userId: currentUser?.id
    });
  };

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    setCreating(true);
    try {
      const selectedCampus = campuses.find(c => c.id === newUser.campusId);
      const selectedDept = departments.find(d => d.id === newUser.departmentId);

      const created = await UserService.provisionUser({
        tenantId: effectiveTenantId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        scopeType: newUser.scopeType,
        campusId: selectedCampus?.id,
        campusName: selectedCampus?.name || 'Main Campus',
        departmentId: selectedDept?.id,
        departmentName: selectedDept?.name,
        permissions: newUser.permissions,
        assignedBy: currentUser?.name || 'Institution Owner'
      });

      setUsersList(prev => [created, ...prev]);

      AuditLogger.log({
        eventType: 'USER_ROLE_PROVISIONED',
        details: `Role '${newUser.role}' with ${newUser.scopeType} scope provisioned for ${newUser.name} (${newUser.email})`,
        tenantId: effectiveTenantId,
        userId: currentUser?.id
      });

      setShowRoleModal(false);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'principal',
        scopeType: 'CAMPUS',
        campusId: campuses[0]?.id || '',
        departmentId: departments[0]?.id || '',
        permissions: ['CAMPUS_MANAGE', 'ACADEMIC_MANAGE', 'STUDENT_MANAGE']
      });
    } catch (err) {
      console.error('Error provisioning user:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleUserStatus = async (userItem: InstitutionUser) => {
    const newStatus = userItem.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    await UserService.updateUserStatus(userItem.id, effectiveTenantId, newStatus);
    setUsersList(prev => prev.map(u => u.id === userItem.id ? { ...u, status: newStatus } : u));

    AuditLogger.log({
      eventType: 'USER_STATUS_CHANGED',
      details: `User status for ${userItem.name} changed to ${newStatus}`,
      tenantId: effectiveTenantId,
      userId: currentUser?.id
    });
  };

  const isOwner = currentUser?.role === 'organization_owner' || currentUser?.role === 'super_admin';

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
             <div className="w-2 h-2 rounded-full bg-indigo-600" />
             Institutional User & Role Governance
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Administration Console</h1>
           <p className="text-slate-500 font-medium mt-2 max-w-2xl">
             Provision verified personnel, configure Role + Scope architecture (Institution / Campus / Department), and assign operational privileges across your institutional ecosystem.
           </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={() => setShowRoleModal(true)}
             className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] transition-all cursor-pointer"
           >
            <Plus className="w-4 h-4" /> Provision Personnel Role
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="w-12 h-12 animate-spin mb-6 text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Security Layers & Users...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Roles & Users Column */}
           <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3">
                   <Lock className="w-5 h-5 text-indigo-600" />
                   Active Institutional Personnel ({usersList.length})
                 </h3>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Users className="w-3.5 h-3.5" />
                    Role + Scope Enforced
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {usersList.map((userItem, idx) => (
                  <motion.div 
                    key={userItem.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[32px] border border-slate-200/80 shadow-xl shadow-slate-200/30 p-6 hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                       <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md ${
                            userItem.role === 'organization_owner' ? 'bg-indigo-900 text-white' :
                            userItem.role === 'principal' ? 'bg-slate-900 text-white' :
                            userItem.role === 'vice_principal' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                             <Fingerprint className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h4 className="text-base font-black text-slate-900 tracking-tight">{userItem.name}</h4>
                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full ${
                                  userItem.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                                }`}>
                                   {userItem.status}
                                </span>
                             </div>

                             <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {userItem.email}</span>
                                {userItem.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {userItem.phone}</span>}
                             </div>

                             {/* Scope Badge */}
                             <div className="flex flex-wrap items-center gap-2 mt-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                                   Role: {userItem.role.replace(/_/g, ' ')}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                   Scope: {userItem.scope_type}
                                </span>
                                {userItem.campus_name && (
                                   <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                      Campus: {userItem.campus_name}
                                   </span>
                                )}
                                {userItem.department_name && (
                                   <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                                      Dept: {userItem.department_name}
                                   </span>
                                )}
                             </div>
                          </div>
                       </div>

                       {/* Action Controls */}
                       <div className="flex items-center gap-3 self-end sm:self-center">
                          <button
                            onClick={() => handleToggleUserStatus(userItem)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                              userItem.status === 'ACTIVE' 
                                ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {userItem.status === 'ACTIVE' ? 'Revoke Role' : 'Re-Activate'}
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>

           {/* Policy & Governance Settings Column */}
           <div className="lg:col-span-4 space-y-8">
              {/* Governance Rules & Authority Toggle */}
              <div className="bg-white rounded-[40px] border border-slate-200/80 shadow-xl p-8 space-y-6">
                 <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    <div>
                       <h3 className="text-base font-black text-slate-900 tracking-tight">Authority & Delegation Settings</h3>
                       <p className="text-[11px] font-medium text-slate-500">Configure Principal delegation rights</p>
                    </div>
                 </div>

                 <div className="space-y-5">
                    {/* Principal Vice Principal Toggle */}
                    <div className="flex items-start justify-between gap-4">
                       <div>
                          <p className="text-xs font-bold text-slate-900">Allow Principal to assign Vice Principals</p>
                          <p className="text-[10px] font-medium text-slate-500 mt-0.5">When enabled, Campus Principals can provision Vice Principals for their assigned campus scope.</p>
                       </div>
                       <button
                         disabled={!isOwner}
                         onClick={() => handleToggleGovSetting('allow_principal_assign_vp')}
                         className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 mt-1 ${
                           govSettings.allow_principal_assign_vp ? 'bg-indigo-600' : 'bg-slate-300'
                         }`}
                       >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            govSettings.allow_principal_assign_vp ? 'left-7' : 'left-1'
                          }`} />
                       </button>
                    </div>

                    {/* Strict Isolation Toggle */}
                    <div className="flex items-start justify-between gap-4 pt-4 border-t border-slate-100">
                       <div>
                          <p className="text-xs font-bold text-slate-900">Strict Campus Scope Isolation</p>
                          <p className="text-[10px] font-medium text-slate-500 mt-0.5">Principals & Vice Principals can only view data tagged to their assigned campus.</p>
                       </div>
                       <button
                         disabled={!isOwner}
                         onClick={() => handleToggleGovSetting('strict_campus_isolation')}
                         className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 mt-1 ${
                           govSettings.strict_campus_isolation ? 'bg-indigo-600' : 'bg-slate-300'
                         }`}
                       >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            govSettings.strict_campus_isolation ? 'left-7' : 'left-1'
                          }`} />
                       </button>
                    </div>

                    {/* Owner Approval Toggle */}
                    <div className="flex items-start justify-between gap-4 pt-4 border-t border-slate-100">
                       <div>
                          <p className="text-xs font-bold text-slate-900">Require Owner Approval for VP Roles</p>
                          <p className="text-[10px] font-medium text-slate-500 mt-0.5">Principal created Vice Principal roles require Institution Owner verification.</p>
                       </div>
                       <button
                         disabled={!isOwner}
                         onClick={() => handleToggleGovSetting('require_owner_approval_for_vp')}
                         className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 mt-1 ${
                           govSettings.require_owner_approval_for_vp ? 'bg-indigo-600' : 'bg-slate-300'
                         }`}
                       >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            govSettings.require_owner_approval_for_vp ? 'left-7' : 'left-1'
                          }`} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Security Policy Card */}
              <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <ShieldAlert className="w-48 h-48 rotate-12" />
                 </div>
                 <h3 className="text-xl font-black tracking-tighter mb-2">Zero-Trust Access Policy</h3>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                   Role assignments use cryptographic tenant context headers and strict RLS query filters.
                 </p>
                 
                 <div className="space-y-3">
                    {[
                      { label: 'Role + Permission Architecture', active: true },
                      { label: 'Scoped Campus Context', active: true },
                      { label: 'Audit Trail Logging', active: true },
                      { label: 'Session Fingerprinting', active: true },
                    ].map((policy, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/10">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{policy.label}</span>
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Provision Personnel Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="text-lg font-black text-slate-900">Provision Personnel & Assign Role</h3>
                    <p className="text-xs text-slate-500 font-medium">Assign Role, Scope, Campus, Department & Permissions.</p>
                 </div>
                 <button onClick={() => setShowRoleModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={handleProvisionUser} className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name *</label>
                       <input 
                         type="text" 
                         required
                         value={newUser.name}
                         onChange={e => setNewUser({...newUser, name: e.target.value})}
                         placeholder="e.g. Dr. Robert Vance"
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>

                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Institutional Email *</label>
                       <input 
                         type="email" 
                         required
                         value={newUser.email}
                         onChange={e => setNewUser({...newUser, email: e.target.value})}
                         placeholder="e.g. vance@galaxy.edu"
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
                       <input 
                         type="tel" 
                         value={newUser.phone}
                         onChange={e => setNewUser({...newUser, phone: e.target.value})}
                         placeholder="+1 (555) 019-2831"
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                    </div>

                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Assign Role *</label>
                       <select 
                         value={newUser.role}
                         onChange={e => {
                           const r = e.target.value as Role;
                           setNewUser({
                             ...newUser, 
                             role: r,
                             scopeType: r === 'organization_owner' ? 'INSTITUTION' : r === 'principal' ? 'CAMPUS' : 'CAMPUS'
                           });
                         }}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                          {isOwner && <option value="organization_owner">Institution Owner</option>}
                          <option value="principal">Principal</option>
                          <option value="vice_principal">Vice Principal</option>
                          <option value="school_admin">School Admin</option>
                          <option value="academic_head">Academic Coordinator</option>
                          <option value="teacher">Teacher</option>
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Scope Level</label>
                       <select 
                         value={newUser.scopeType}
                         onChange={e => setNewUser({...newUser, scopeType: e.target.value as ScopeType})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                          <option value="INSTITUTION">INSTITUTION (Entire Org)</option>
                          <option value="CAMPUS">CAMPUS (Specific Branch)</option>
                          <option value="DEPARTMENT">DEPARTMENT (Specific Dept)</option>
                       </select>
                    </div>

                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Campus Scope</label>
                       <select 
                         value={newUser.campusId}
                         onChange={e => setNewUser({...newUser, campusId: e.target.value})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                          {campuses.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                       </select>
                    </div>

                    <div>
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Department Scope</label>
                       <select 
                         value={newUser.departmentId}
                         onChange={e => setNewUser({...newUser, departmentId: e.target.value})}
                         className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       >
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowRoleModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={creating}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                       {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                       Provision Personnel
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

