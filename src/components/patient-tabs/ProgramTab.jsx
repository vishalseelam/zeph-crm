import { Activity, Users, TrendingDown, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cohorts } from '../../data';
import { useState } from 'react';

export default function ProgramTab({ patient, isEditing }) {
  const [showLiveSessions, setShowLiveSessions] = useState(false);
  const [showSoloSessions, setShowSoloSessions] = useState(false);
  const calculateProgress = (attended, available) => {
    if (!available || available === 0) return 0;
    return Math.round((attended / available) * 100);
  };
  
  const liveProgress = calculateProgress(patient.liveSessionsAttended, patient.liveSessionsAvailable);
  const soloProgress = calculateProgress(patient.soloSessionsAttended, patient.soloSessionsAvailable);
  
  // Get cohort details
  const cohort = cohorts.find(c => c.id === patient.cohortId);
  
  // Condensed attendance pattern
  const attendancePattern = [
    ['✓', '✓', '✓', '✓'],  // Week 1
    ['✓', '✗', '✓', '✗'],  // Week 2
    ['✗', '✗', '✓', '✓'],  // Week 3
    ['✓', '✗', '✗', '✓'],  // Week 4
  ];
  
  // Generate insights
  const getInsights = () => {
    const insights = [];
    if (liveProgress < 50) {
      insights.push(`Critical: ${liveProgress}% live attendance - Create risk ticket`);
    } else if (liveProgress < 75) {
      insights.push(`Below target: ${liveProgress}% live - Schedule check-in`);
    }
    if (attendancePattern[2][0] === '✗' && attendancePattern[2][1] === '✗') {
      insights.push('3 consecutive misses detected - Contact patient');
    }
    return insights;
  };
  
  const insights = getInsights();
  
  return (
    <div className="space-y-3">
      {/* Program Info Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Program Stage</label>
          <input
            type="text"
            value={patient.programStage || 'N/A'}
            className="input-readonly"
            readOnly
          />
        </div>
        <div>
          <label className="label">Program Time</label>
          <input
            type="date"
            value={patient.programTime || ''}
            className="input-readonly"
            readOnly
          />
        </div>
      </div>
      
      {/* Attendance Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-xs text-blue-700 uppercase tracking-wide mb-1">Live</div>
          <div className="font-bold text-blue-900">
            {patient.liveSessionsAttended}/{patient.liveSessionsAvailable}
          </div>
          <div className="text-xs text-blue-600 mt-1">{liveProgress}%</div>
        </div>
        
        <div className="p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="text-xs text-purple-700 uppercase tracking-wide mb-1">Solo</div>
          <div className="font-bold text-purple-900">
            {patient.soloSessionsAttended}/{patient.soloSessionsAvailable}
          </div>
          <div className="text-xs text-purple-600 mt-1">{soloProgress}%</div>
        </div>
        
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-xs text-green-700 uppercase tracking-wide mb-1">Overall</div>
          <div className="font-bold text-green-900">
            {Math.round((liveProgress + soloProgress) / 2)}%
          </div>
          <div className="text-xs text-green-600 mt-1">Average</div>
        </div>
      </div>
      
      {/* Insights */}
      {insights.length > 0 && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
          <div className="text-xs font-semibold text-orange-900 uppercase tracking-wide mb-1.5">Insights</div>
          <div className="space-y-1">
            {insights.map((insight, index) => (
              <div key={index} className="text-sm text-orange-900">{insight}</div>
            ))}
          </div>
        </div>
      )}
      
      {/* Cohort Details - FROM EXCEL REQUIREMENT */}
      {cohort && (
        <div className="p-3 bg-brand-accent bg-opacity-10 border border-brand-accent border-opacity-30 rounded">
          <div className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-2">Cohort Schedule</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Cohort Type</label>
              <input
                type="text"
                value={cohort.type}
                className="input-readonly"
                readOnly
              />
            </div>
            <div>
              <label className="label text-xs">Cohort ID</label>
              <input
                type="text"
                value={cohort.id}
                className={isEditing ? 'input-field' : 'input-readonly'}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="label text-xs">Live Session Type</label>
              <input
                type="text"
                value={cohort.liveSessionType}
                className="input-readonly"
                readOnly
              />
            </div>
            <div>
              <label className="label text-xs">Live Days</label>
              <input
                type="text"
                value={cohort.liveDays}
                className="input-readonly"
                readOnly
              />
            </div>
            <div>
              <label className="label text-xs">Live Time</label>
              <input
                type="text"
                value={cohort.liveTime}
                className="input-readonly"
                readOnly
              />
            </div>
            <div>
              <label className="label text-xs">Solo Days</label>
              <input
                type="text"
                value={cohort.soloDays}
                className={isEditing ? 'input-field' : 'input-readonly'}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="label text-xs">Solo Time</label>
              <input
                type="text"
                value={cohort.soloTime}
                className={isEditing ? 'input-field' : 'input-readonly'}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Attendance Calendar */}
      <div className="p-3 bg-corporate-50 border border-corporate-200 rounded">
        <div className="text-xs font-semibold text-corporate-700 uppercase tracking-wide mb-2">4-Week Attendance</div>
        <div className="grid grid-cols-4 gap-1.5">
          {['W1', 'W2', 'W3', 'W4'].map((week, weekIndex) => (
            <div key={week}>
              <div className="text-xs text-corporate-600 text-center mb-1">{week}</div>
              <div className="space-y-1">
                {attendancePattern[weekIndex].map((status, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-full h-6 flex items-center justify-center text-xs font-bold rounded ${
                      status === '✓' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Session Tracking - Collapsible */}
      <div className="border-t border-corporate-200 pt-4">
        {/* Live Sessions */}
        <div className="mb-3">
          <button
            onClick={() => setShowLiveSessions(!showLiveSessions)}
            className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-900 text-sm">Live Sessions</span>
              <span className="text-xs text-blue-600">
                ({patient.liveSessionsAttended}/{patient.liveSessionsAvailable} completed)
              </span>
            </div>
            {showLiveSessions ? (
              <ChevronUp className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-blue-600" />
            )}
          </button>
          
          {showLiveSessions && (
            <div className="mt-2 p-3 bg-white border border-blue-200 rounded">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Array.from({ length: patient.liveSessionsAvailable || 18 }, (_, i) => i + 1).map((sessionNum) => (
                  <div key={`live-${sessionNum}`}>
                    <label className="label text-xs">Session {sessionNum}</label>
                    <input
                      type="date"
                      className={isEditing ? 'input-field text-xs' : 'input-readonly text-xs'}
                      readOnly={!isEditing}
                      placeholder="Not scheduled"
                      defaultValue={sessionNum <= patient.liveSessionsAttended ? '2024-10-18' : ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Solo Sessions */}
        <div>
          <button
            onClick={() => setShowSoloSessions(!showSoloSessions)}
            className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-purple-900 text-sm">Solo Sessions</span>
              <span className="text-xs text-purple-600">
                ({patient.soloSessionsAttended}/{patient.soloSessionsAvailable} completed)
              </span>
            </div>
            {showSoloSessions ? (
              <ChevronUp className="w-4 h-4 text-purple-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-purple-600" />
            )}
          </button>
          
          {showSoloSessions && (
            <div className="mt-2 p-3 bg-white border border-purple-200 rounded">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Array.from({ length: patient.soloSessionsAvailable || 8 }, (_, i) => i + 1).map((sessionNum) => (
                  <div key={`solo-${sessionNum}`}>
                    <label className="label text-xs">Session {sessionNum}</label>
                    <input
                      type="date"
                      className={isEditing ? 'input-field text-xs' : 'input-readonly text-xs'}
                      readOnly={!isEditing}
                      placeholder="Not scheduled"
                      defaultValue={sessionNum <= patient.soloSessionsAttended ? '2024-10-18' : ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
