const fs = require('fs');

const hookContent = `
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';

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

export function useOwnerDashboard(currentCampus: string) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCampuses() {
      if (!user?.tenantId) return;
      
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name, address')
          .eq('tenant_id', user.tenantId);
          
        if (error) throw error;
        setCampuses(data || []);
      } catch (err) {
        console.error('Failed to load campuses', err);
      }
    }
    loadCampuses();
  }, [user?.tenantId]);

  useEffect(() => {
    async function loadStats() {
      if (!user?.tenantId) {
        setError('Tenant not resolved.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.rpc('get_owner_dashboard_stats', {
          p_tenant_id: user.tenantId,
          p_campus_name: currentCampus
        });
        
        if (error) {
           console.error('RPC failed:', error.message);
           throw error;
        }
        
        setStats(data as DashboardStats);
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user?.tenantId, currentCampus]);

  return { stats, campuses, loading, error };
}
`;

fs.writeFileSync('src/hooks/useOwnerDashboard.ts', hookContent.trim());
