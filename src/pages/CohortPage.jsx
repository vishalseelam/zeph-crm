import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Users, Calendar, Clock, Video, User, ChevronRight, Search } from 'lucide-react';
import { cohorts, patients, cohortTypes, liveSessionTypes } from '../data';

export default function CohortPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get patients for a cohort
  const getCohortPatients = (cohortId) => {
    return patients.filter(p => p.cohortId === cohortId);
  };
  
  // Get unassigned patients
  const getUnassignedPatients = () => {
    return patients.filter(p => !p.cohortId && p.programStage !== 'Completed');
  };
  
  // Get weekly calendar
  const getWeeklyCalendar = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const calendar = {};
    
    daysOfWeek.forEach(day => {
      calendar[day] = [];
    });
    
    const dayMap = { 'M': 'Monday', 'T': 'Tuesday', 'W': 'Wednesday', 'Th': 'Thursday', 'F': 'Friday' };
    
    cohorts.forEach(cohort => {
      // Live sessions
      const liveDays = cohort.liveDays.split('-');
      liveDays.forEach(dayCode => {
        const day = dayMap[dayCode];
        if (calendar[day]) {
          calendar[day].push({
            cohortId: cohort.id,
            time: cohort.liveTime,
            type: 'Live',
            duration: cohort.liveSessionType,
            count: getCohortPatients(cohort.id).length
          });
        }
      });
      
      // Solo sessions
      const soloDays = cohort.soloDays.split('-');
      soloDays.forEach(dayCode => {
        const day = dayMap[dayCode];
        if (calendar[day]) {
          calendar[day].push({
            cohortId: cohort.id,
            time: cohort.soloTime,
            type: 'Solo',
            duration: '30 MIN',
            count: getCohortPatients(cohort.id).length
          });
        }
      });
    });
    
    // Sort sessions by time within each day
    Object.keys(calendar).forEach(day => {
      calendar[day].sort((a, b) => {
        const timeA = a.time.replace(/[APM\s:]/g, '');
        const timeB = b.time.replace(/[APM\s:]/g, '');
        return timeA.localeCompare(timeB);
      });
    });
    
    return calendar;
  };
  
  const weeklyCalendar = getWeeklyCalendar();
  
  const togglePatientSelection = (patientId) => {
    setSelectedPatients(prev =>
      prev.includes(patientId)
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };
  
  // Filter cohorts based on search
  const filteredCohorts = useMemo(() => {
    if (!searchTerm) return cohorts;
    
    const lowerSearch = searchTerm.toLowerCase();
    
    return cohorts.filter(cohort => {
      // Search by cohort ID
      if (cohort.id.toLowerCase().includes(lowerSearch)) {
        return true;
      }
      
      // Search by patient names in this cohort
      const cohortPatients = getCohortPatients(cohort.id);
      const hasMatchingPatient = cohortPatients.some(patient => 
        patient.name.toLowerCase().includes(lowerSearch)
      );
      
      return hasMatchingPatient;
    });
  }, [searchTerm]);
  
  return (
    <div className="space-y-4">
      {/* Page Header - Branded */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">Cohort Management</h2>
          <p className="text-sm text-corporate-600 mt-0.5">
            {filteredCohorts.length} of {cohorts.length} cohorts
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Cohort</span>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-corporate-400" />
        <input
          type="text"
          placeholder="Search by cohort ID or patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-corporate-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-corporate-400 hover:text-corporate-600 text-xs"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Cohort Cards - Compact Grid */}
      {filteredCohorts.length === 0 ? (
        <div className="text-center py-12 bg-corporate-50 rounded">
          <Users className="w-12 h-12 text-corporate-400 mx-auto mb-3" />
          <p className="text-corporate-600">No cohorts found matching "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCohorts.map((cohort) => {
            const cohortPatients = getCohortPatients(cohort.id);
          
          return (
            <div key={cohort.id} className="card p-3 hover:shadow transition-shadow border-l-2 border-l-brand-primary">
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-base font-bold text-brand-primary">{cohort.id}</h3>
                    <span className="text-xs px-1.5 py-0.5 bg-brand-accent bg-opacity-20 text-brand-primary rounded font-semibold border border-brand-accent border-opacity-30">
                      {cohort.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCohort(cohort)}
                  className="p-1 hover:bg-corporate-100 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5 text-corporate-600" />
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between mb-2 text-sm">
                <div className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-corporate-500" />
                  <span className="text-corporate-900 font-semibold">{cohortPatients.length}/{cohort.size}</span>
                </div>
                <span className="text-xs text-corporate-500 font-medium">
                  {Math.round((cohortPatients.length / cohort.size) * 100)}%
                </span>
              </div>
              
              {/* Schedule */}
              <div className="space-y-1 text-xs border-t border-corporate-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-corporate-500 uppercase tracking-wide">Live</span>
                  <span className="font-medium text-corporate-900">{cohort.liveDays} • {cohort.liveTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-corporate-500 uppercase tracking-wide">Solo</span>
                  <span className="font-medium text-corporate-900">{cohort.soloDays} • {cohort.soloTime}</span>
                </div>
              </div>
              
              {/* View Link */}
              {cohortPatients.length > 0 && (
                <Link
                  to={`/funnel?cohort=${cohort.id}`}
                  className="mt-2 flex items-center justify-between text-xs text-brand-primary hover:text-brand-primary-dark font-medium"
                >
                  <span>{cohortPatients.length} patient{cohortPatients.length !== 1 ? 's' : ''}</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
      )}
      
      {/* Weekly Schedule Calendar - Sleek */}
      <div className="card">
        <h3 className="text-base font-bold text-corporate-900 mb-3 flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-primary-600" />
          <span>Weekly Schedule</span>
        </h3>
        
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(weeklyCalendar).map(([day, sessions]) => (
            <div key={day} className="border border-corporate-200 rounded overflow-hidden">
              {/* Day Header */}
              <div className="bg-corporate-100 px-2 py-1.5 border-b border-corporate-200">
                <div className="font-semibold text-xs text-corporate-900">{day}</div>
              </div>
              
              {/* Sessions - Sleek */}
              <div className="p-1.5 space-y-1.5 min-h-[100px]">
                {sessions.length === 0 ? (
                  <div className="text-center text-xs text-corporate-400 py-3">
                    —
                  </div>
                ) : (
                  sessions.map((session, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded text-xs border ${
                        session.type === 'Live' 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-purple-50 border-purple-200'
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-0.5">
                        {session.type === 'Live' ? (
                          <Video className="w-2.5 h-2.5 text-blue-600" />
                        ) : (
                          <User className="w-2.5 h-2.5 text-purple-600" />
                        )}
                        <span className={`font-semibold text-xs ${
                          session.type === 'Live' ? 'text-blue-900' : 'text-purple-900'
                        }`}>
                          {session.cohortId}
                        </span>
                      </div>
                      <div className={`font-medium ${
                        session.type === 'Live' ? 'text-blue-700' : 'text-purple-700'
                      }`}>
                        {session.time}
                      </div>
                      <div className="text-corporate-600 mt-0.5 text-xs">
                        {session.duration}
                      </div>
                      <div className="flex items-center space-x-0.5 mt-0.5 text-corporate-600">
                        <Users className="w-2.5 h-2.5" />
                        <span className="text-xs">{session.count}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add/Edit Modal */}
      {(showAddModal || selectedCohort) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-corporate-900 mb-4">
                {selectedCohort ? 'Edit Cohort' : 'Create New Cohort'}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Cohort ID</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="COH-XXX"
                      defaultValue={selectedCohort?.id || ''}
                    />
                  </div>
                  
                  <div>
                    <label className="label">Cohort Type</label>
                    <select className="input-field" defaultValue={selectedCohort?.type || ''}>
                      <option value="">Select type...</option>
                      {cohortTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="label">Cohort Size (Capacity)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="12"
                    defaultValue={selectedCohort?.size || ''}
                  />
                </div>
                
                <div className="border-t border-corporate-200 pt-4">
                  <h4 className="font-medium text-corporate-900 mb-3">Live Sessions</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Session Type</label>
                      <select className="input-field" defaultValue={selectedCohort?.liveSessionType || ''}>
                        <option value="">Select...</option>
                        {liveSessionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Days</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="M-W"
                        defaultValue={selectedCohort?.liveDays || ''}
                      />
                    </div>
                    <div>
                      <label className="label">Time</label>
                      <input
                        type="time"
                        className="input-field"
                        defaultValue={selectedCohort?.liveTime || ''}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-corporate-200 pt-4">
                  <h4 className="font-medium text-corporate-900 mb-3">Solo Sessions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Days</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="T-Th"
                        defaultValue={selectedCohort?.soloDays || ''}
                      />
                    </div>
                    <div>
                      <label className="label">Time</label>
                      <input
                        type="time"
                        className="input-field"
                        defaultValue={selectedCohort?.soloTime || ''}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Patient Assignment */}
                {!selectedCohort && (
                  <div className="border-t border-corporate-200 pt-4">
                    <h4 className="font-medium text-corporate-900 mb-3">Assign Patients (Optional)</h4>
                    <div className="max-h-60 overflow-y-auto border border-corporate-200 rounded-lg">
                      {getUnassignedPatients().length === 0 ? (
                        <div className="p-4 text-center text-sm text-corporate-500">
                          No unassigned patients available
                        </div>
                      ) : (
                        <div className="divide-y divide-corporate-200">
                          {getUnassignedPatients().map(patient => (
                            <label
                              key={patient.id}
                              className="flex items-center space-x-3 p-3 hover:bg-corporate-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedPatients.includes(patient.id)}
                                onChange={() => togglePatientSelection(patient.id)}
                                className="w-4 h-4 text-primary-600"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-corporate-900">{patient.name}</div>
                                <div className="text-xs text-corporate-500">{patient.id} • {patient.state}</div>
                              </div>
                              <span className="text-xs text-corporate-600">{patient.currentStage}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedPatients.length > 0 && (
                      <div className="mt-2 text-sm text-primary-600">
                        {selectedPatients.length} patient{selectedPatients.length !== 1 ? 's' : ''} selected
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-corporate-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedCohort(null);
                    setSelectedPatients([]);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save logic would go here
                    setShowAddModal(false);
                    setSelectedCohort(null);
                    setSelectedPatients([]);
                  }}
                  className="btn-primary"
                >
                  {selectedCohort ? 'Save Changes' : 'Create Cohort'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

