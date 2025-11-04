import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronRight, AlertCircle, Clock, Star, TrendingDown, DollarSign } from 'lucide-react';
import { patients, stages } from '../data';
import { calculateHealthScore, getHealthIcon } from '../utils/healthScore';

export default function FunnelPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedHealth, setSelectedHealth] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeQuickView, setActiveQuickView] = useState(searchParams.get('filter') || null);
  
  // Get unique states
  const states = useMemo(() => {
    const uniqueStates = [...new Set(patients.map(p => p.state))];
    return ['All', ...uniqueStates.sort()];
  }, []);
  
  // Quick view filters
  const quickViews = [
    { id: 'urgent', label: 'Needs Attention', icon: AlertCircle, color: 'red', filter: (p) => {
      const health = calculateHealthScore(p);
      return health.score <= 2 || p.lastRiskStage === 'Active';
    }},
    { id: 'risks', label: 'Active Risks', icon: TrendingDown, color: 'orange', filter: (p) => p.lastRiskStage === 'Active' },
    { id: 'deferrals', label: 'Deferred', icon: Clock, color: 'yellow', filter: (p) => p.lastDeferralStage === 'Active' },
    { id: 'payments', label: 'Payment Issues', icon: DollarSign, color: 'purple', filter: (p) => {
      return (p.maintenancePayments || []).some(pm => !pm.paid);
    }},
    { id: 'healthy', label: 'Healthy', icon: Star, color: 'green', filter: (p) => {
      const health = calculateHealthScore(p);
      return health.score >= 4;
    }},
  ];
  
  // Filter patients
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // Search filter
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Basic filters
      const matchesStage = selectedStage === 'All' || patient.currentStage === selectedStage;
      const matchesState = selectedState === 'All' || patient.state === selectedState;
      
      // Health filter
      const health = calculateHealthScore(patient);
      const matchesHealth = selectedHealth === 'All' || health.level === selectedHealth;
      
      // Quick view filter
      const matchesQuickView = !activeQuickView || 
        quickViews.find(v => v.id === activeQuickView)?.filter(patient);
      
      return matchesSearch && matchesStage && matchesState && matchesHealth && matchesQuickView;
    });
  }, [searchTerm, selectedStage, selectedState, selectedHealth, activeQuickView]);
  
  // Get stage badge color
  const getStageBadge = (stage) => {
    const colors = {
      'Kit': 'badge-info',
      'Ramp On': 'badge-warning',
      'Program': 'badge-success',
      'Maintenance': 'badge-neutral',
      'Ramp Off': 'badge-danger'
    };
    return colors[stage] || 'badge-neutral';
  };
  
  // Check if patient has active risk or deferral
  const hasActiveRisk = (patient) => patient.lastRiskStage === 'Active';
  const hasActiveDeferral = (patient) => patient.lastDeferralStage === 'Active';
  
  return (
    <div className="space-y-4">
      {/* Page Header - Branded */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">Patient Funnel</h2>
          <p className="text-sm text-corporate-600 mt-0.5">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>
        </div>
      </div>
      
      {/* Quick View Filters - Sleek with Better Active State */}
      <div className="flex flex-wrap gap-1.5">
        {quickViews.map(view => {
          const Icon = view.icon;
          const count = patients.filter(view.filter).length;
          const isActive = activeQuickView === view.id;
          
          // Active state colors
          const activeColors = {
            red: 'bg-red-600 border-red-700 text-white',
            orange: 'bg-orange-600 border-orange-700 text-white',
            yellow: 'bg-yellow-600 border-yellow-700 text-white',
            purple: 'bg-purple-600 border-purple-700 text-white',
            green: 'bg-green-600 border-green-700 text-white'
          };
          
          return (
            <button
              key={view.id}
              onClick={() => setActiveQuickView(isActive ? null : view.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
                isActive
                  ? activeColors[view.color]
                  : 'bg-white text-corporate-700 border-corporate-300 hover:border-corporate-400 hover:bg-corporate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{view.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                isActive ? 'bg-white bg-opacity-25 text-white' : 'bg-corporate-100 text-corporate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
        {activeQuickView && (
          <button
            onClick={() => setActiveQuickView(null)}
            className="px-3 py-1.5 text-xs text-corporate-600 hover:text-corporate-900 font-medium"
          >
            Clear ×
          </button>
        )}
      </div>
      
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-corporate-400" />
            <input
              type="text"
              placeholder="Search by name, MRN, or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-primary-100 text-primary-700' : ''}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-corporate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Stage</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="input-field"
              >
                <option value="All">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input-field"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">Health Status</label>
              <select
                value={selectedHealth}
                onChange={(e) => setSelectedHealth(e.target.value)}
                className="input-field"
              >
                <option value="All">All Health Levels</option>
                <option value="Healthy">Healthy</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="At Risk">At Risk</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Patients Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-corporate-200">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">MRN</th>
                <th className="px-4 py-3 text-left">State</th>
                <th className="px-4 py-3 text-left">Current Stage</th>
                <th className="px-4 py-3 text-left">Sub-Stage</th>
                <th className="px-4 py-3 text-left">Alerts</th>
                <th className="px-4 py-3 text-left">Kit Status</th>
                <th className="px-4 py-3 text-left">Program Progress</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-corporate-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-corporate-500">
                    No patients found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-corporate-50 transition-colors">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-corporate-900">{patient.name}</div>
                        <div className="text-xs text-corporate-500">{patient.id}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-corporate-700 font-mono text-xs">{patient.mrn}</span>
                    </td>
                    <td className="table-cell">
                      <span className="badge badge-neutral">{patient.state}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${getStageBadge(patient.currentStage)}`}>
                        {patient.currentStage}
                      </span>
                    </td>
                    <td className="table-cell text-corporate-600">
                      {patient.currentSubStage}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {hasActiveRisk(patient) && (
                          <div className="flex items-center space-x-1 text-red-600" title="Active Risk">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs">Risk</span>
                          </div>
                        )}
                        {hasActiveDeferral(patient) && (
                          <div className="flex items-center space-x-1 text-yellow-600" title="Active Deferral">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">Deferred</span>
                          </div>
                        )}
                        {!hasActiveRisk(patient) && !hasActiveDeferral(patient) && (
                          <span className="text-xs text-corporate-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`text-xs ${
                        patient.kitStage === 'Delivered' ? 'text-green-600' :
                        patient.kitStage === 'Returned' ? 'text-corporate-500' :
                        'text-yellow-600'
                      }`}>
                        {patient.kitStage}
                      </span>
                    </td>
                    <td className="table-cell">
                      {patient.programStage === 'Active' || patient.programStage === 'Completed' ? (
                        <div className="text-xs">
                          <div>Live: {patient.liveSessionAttendance}</div>
                          <div className="text-corporate-500">Solo: {patient.soloSessionAttendance}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-corporate-400">N/A</span>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/patient/${patient.id}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map(stage => {
          const count = patients.filter(p => p.currentStage === stage).length;
          return (
            <div key={stage} className="card">
              <div className="text-sm text-corporate-600 mb-1">{stage}</div>
              <div className="text-2xl font-bold text-corporate-900">{count}</div>
              <div className="text-xs text-corporate-500 mt-1">
                {((count / patients.length) * 100).toFixed(0)}% of total
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


