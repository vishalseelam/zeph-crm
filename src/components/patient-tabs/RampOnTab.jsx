import { CheckCircle, Circle } from 'lucide-react';

export default function RampOnTab({ patient, isEditing }) {
  const stages = [
    { key: 'referred', label: 'Referred', date: patient.referred },
    { key: 'enrollmentAttempted', label: 'Enrollment Attempted', date: patient.enrollmentAttempted },
    { key: 'enrollmentCompleted', label: 'Enrollment Completed', date: patient.enrollmentCompleted },
    { key: 'onboardingAttempted', label: 'Onboarding Attempted', date: patient.onboardingAttempted },
    { key: 'onboardingCompleted', label: 'Onboarding Completed', date: patient.onboardingCompleted },
  ];
  
  const isCompleted = (date) => date !== null && date !== '';
  
  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="flex items-center justify-between p-4 bg-corporate-50 rounded-lg">
        <div>
          <div className="text-sm text-corporate-600">Ramp On Stage</div>
          <div className="text-xl font-bold text-corporate-900">{patient.rampOnStage}</div>
        </div>
        {patient.rampOnTime && (
          <div className="text-right">
            <div className="text-sm text-corporate-600">Last Updated</div>
            <div className="font-medium text-corporate-900">{patient.rampOnTime}</div>
          </div>
        )}
      </div>
      
      {/* Ramp On Details */}
      <div>
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Ramp On Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Ramp On Stage</label>
            <input
              type="text"
              value={patient.rampOnStage || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Ramp On Time</label>
            <input
              type="date"
              value={patient.rampOnTime || ''}
              className="input-readonly"
              readOnly
            />
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="border-t border-corporate-200 pt-6">
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Ramp On Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-corporate-200"></div>
          <div className="space-y-6">
            {stages.map((stage, index) => {
              const completed = isCompleted(stage.date);
              
              return (
                <div key={stage.key} className="relative flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    completed ? 'bg-green-100' : 'bg-corporate-100'
                  }`}>
                    {completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-corporate-400" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-medium ${completed ? 'text-corporate-900' : 'text-corporate-500'}`}>
                          {stage.label}
                        </div>
                        {completed && (
                          <div className="text-sm text-corporate-600 mt-1">{stage.date}</div>
                        )}
                      </div>
                      {isEditing && (
                        <input
                          type="date"
                          value={stage.date || ''}
                          className="input-field w-40"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Milestones Grid */}
      <div className="border-t border-corporate-200 pt-6">
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Milestone Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Referred Date</label>
            <input
              type="date"
              value={patient.referred || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Enrollment Attempted</label>
            <input
              type="date"
              value={patient.enrollmentAttempted || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Enrollment Completed</label>
            <input
              type="date"
              value={patient.enrollmentCompleted || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Onboarding Attempted</label>
            <input
              type="date"
              value={patient.onboardingAttempted || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Onboarding Completed</label>
            <input
              type="date"
              value={patient.onboardingCompleted || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


