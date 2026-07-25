import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { CampusService } from '../services/CampusService';

export interface DashboardStats {
  totalStudents: number;
  activeStaff: number;
  feesCollected: number;
  avgAttendance: number;
  activeRoutes: number;
  revenueData: any[];
  attendanceData: any[];
  alertsData: any[];
}

export function useOwnerDashboard(currentCampus: string, tenantId?: string) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback UUID if no specific tenant is provided
  const effectiveTenantId = user?.tenantId || tenantId || user?.schoolCode || '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    async function loadCampuses() {
      try {
        const list = await CampusService.getCampuses(effectiveTenantId);
        setCampuses(list);
      } catch (err) {
        console.error('Failed to load campuses:', err);
        setCampuses([]);
      }
    }
    
    loadCampuses();

    const handleCampusChange = () => {
      loadCampuses();
    };

    window.addEventListener('campus-created', handleCampusChange);
    window.addEventListener('campus-updated', handleCampusChange);

    return () => {
      window.removeEventListener('campus-created', handleCampusChange);
      window.removeEventListener('campus-updated', handleCampusChange);
    };
  }, [effectiveTenantId]);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.rpc('get_owner_dashboard_stats', {
          p_tenant_id: effectiveTenantId,
          p_campus_name: currentCampus
        });
        
        if (error) {
           console.error('RPC get_owner_dashboard_stats failed:', error.message);
           throw error;
        }
        
        setStats(data as DashboardStats);
      } catch (err: any) {
        console.error('Failed to load dashboard stats:', err);
        setError(err.message || 'Failed to connect to database RPC.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [effectiveTenantId, currentCampus]);

  return { stats, campuses, loading, error };
}
