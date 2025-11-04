import { Activity, Users, TrendingDown, Calendar, Clock } from 'lucide-react';
import { cohorts } from '../../data';

export default function ProgramTab({ patient, isEditing }) {
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
                className="input-readonly"
                readOnly
              />
            </div>
            <div>
              <label className="label text-xs">Solo Time</label>
              <input
                type="text"
                value={cohort.soloTime}
                className="input-readonly"
                readOnly
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
      
      {/* Progress Bars */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white border border-corporate-200 rounded">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-brand-primary uppercase">Live</span>
            <span className="text-sm font-bold text-blue-700">{liveProgress}%</span>
          </div>
          <div className="w-full bg-corporate-200 rounded h-2">
            <div
              className={`h-2 rounded ${
                liveProgress >= 75 ? 'bg-green-500' :
                liveProgress >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${liveProgress}%` }}
            ></div>
          </div>
          {isEditing && (
            <input
              type="number"
              value={patient.liveSessionsAttended || 0}
              className="input-field mt-2"
              placeholder="Attended"
            />
          )}
        </div>
        
        <div className="p-3 bg-white border border-corporate-200 rounded">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-brand-primary uppercase">Solo</span>
            <span className="text-sm font-bold text-purple-700">{soloProgress}%</span>
          </div>
          <div className="w-full bg-corporate-200 rounded h-2">
            <div
              className={`h-2 rounded ${
                soloProgress >= 75 ? 'bg-green-500' :
                soloProgress >= 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${soloProgress}%` }}
            ></div>
          </div>
          {isEditing && (
            <input
              type="number"
              value={patient.soloSessionsAttended || 0}
              className="input-field mt-2"
              placeholder="Attended"
            />
          )}
        </div>
      </div>
    </div>
  );
}

