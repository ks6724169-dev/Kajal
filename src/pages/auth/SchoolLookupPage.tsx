import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Building, ArrowRight, ShieldCheck, HelpCircle, RefreshCw, GraduationCap } from 'lucide-react';
import { RealSchoolLookupService, PublicInstitutionRecord } from '../../services/RealSchoolLookupService';
import { useTenant } from '../../hooks/useTenant';

interface SchoolLookupPageProps {
  navigate: (path: string) => void;
}

export const SchoolLookupPage: React.FC<SchoolLookupPageProps> = ({ navigate }) => {
  const { selectTenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterType, setFilterType] = useState('');

  const [schools, setSchools] = useState<PublicInstitutionRecord[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real registered institutions from Supabase database
  useEffect(() => {
    let isMounted = true;
    const fetchRealData = async () => {
      setIsLoading(true);
      try {
        const results = await RealSchoolLookupService.searchRealInstitutions({
          searchTerm,
          city: filterCity,
          state: filterState,
          type: filterType
        });
        
        if (isMounted) {
          setSchools(results);

          // Extract filter options dynamically
          const { cities: cList, states: sList } = await RealSchoolLookupService.getFilterOptions();
          setCities(cList);
          setStates(sList);
        }
      } catch (err) {
        if (isMounted) setSchools([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRealData();
    return () => { isMounted = false; };
  }, [searchTerm, filterCity, filterState, filterType]);

  const handleLaunchSchool = (school: PublicInstitutionRecord) => {
    selectTenant(school.id);
    
    // Pass school code in URL or state to login
    navigate(`/auth/login?schoolCode=${encodeURIComponent(school.code)}`);
  };

  return (
    <div id="school-lookup-page" className="w-full max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 md:p-8 space-y-6"
      >
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-50 flex items-center justify-center gap-2">
            <Building className="h-5.5 w-5.5 text-indigo-500" />
            Verified Educational Portal Lookup
          </h2>
          <p className="text-xs text-slate-400">
            Search registered schools and colleges live from the Supabase database.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="lookup-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by School Unique ID, College ID, Name, or City..."
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label htmlFor="lookup-type-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Institution Type
              </label>
              <select
                id="lookup-type-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-2 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200"
              >
                <option value="">All Types</option>
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="academy">Academy</option>
              </select>
            </div>

            <div>
              <label htmlFor="lookup-city-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Filter City
              </label>
              <select
                id="lookup-city-select"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-2 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lookup-state-select" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Filter State
              </label>
              <select
                id="lookup-state-select"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full px-2 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200"
              >
                <option value="">All States</option>
                {states.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Registered Database Institutions ({schools.length})</span>
            {searchTerm || filterCity || filterState || filterType ? (
              <button
                id="lookup-clear-filters-btn"
                onClick={() => { setSearchTerm(''); setFilterCity(''); setFilterState(''); setFilterType(''); }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline normal-case"
              >
                Reset Search
              </button>
            ) : null}
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-semibold">Connecting to Supabase database registry...</p>
            </div>
          ) : schools.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
              <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                कोई registered school या college नहीं मिला
              </p>
              <p className="text-[11px] text-slate-400">
                No registered active institutions matched your search parameters in the database.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/register-school')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Register New Institution
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {schools.map((school) => (
                <div
                  key={school.id}
                  onClick={() => handleLaunchSchool(school)}
                  className="p-3.5 bg-slate-50 hover:bg-indigo-50/30 dark:bg-slate-900/50 dark:hover:bg-indigo-950/20 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{school.name}</span>
                      <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded">
                        {school.code}
                      </span>
                      <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {school.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{school.city}, {school.state}</span>
                      {school.organizationName && (
                        <span className="text-slate-300 dark:text-slate-600">• {school.organizationName}</span>
                      )}
                    </div>
                  </div>
                  <button
                    id={`launch-school-${school.id}`}
                    type="button"
                    className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-400 transition-all shadow-xs"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center">
          <button
            id="lookup-back-btn"
            type="button"
            onClick={() => navigate('/auth/login')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            ← Return to Sign In Screen
          </button>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-indigo-500" />
            Live Supabase Registry
          </span>
        </div>
      </motion.div>
    </div>
  );
};
