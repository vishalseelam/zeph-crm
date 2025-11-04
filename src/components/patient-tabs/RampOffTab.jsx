import { LogOut, CheckCircle, Circle } from 'lucide-react';
import { exitCategories } from '../../data';

export default function RampOffTab({ patient, isEditing }) {
  const stages = [
    { key: 'offboardingAttempted', label: 'Offboarding Attempted', date: patient.offboardingAttempted },
    { key: 'offboardingCompleted', label: 'Offboarding Completed', date: patient.offboardingCompleted },
    { key: 'exitDate', label: 'Exit Date', date: patient.exitDate },
  ];
  
  const isCompleted = (date) => date !== null && date !== '';
  
  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="flex items-center justify-between p-4 bg-corporate-50 rounded-lg">
        <div>
          <div className="text-sm text-corporate-600">Ramp Off Stage</div>
          <div className="text-xl font-bold text-corporate-900">{patient.rampOffStage}</div>
        </div>
        {patient.rampOffTime && (
          <div className="text-right">
            <div className="text-sm text-corporate-600">Started</div>
            <div className="font-medium text-corporate-900">{patient.rampOffTime}</div>
          </div>
        )}
      </div>
      
      {/* Ramp Off Information */}
      <div>
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Ramp Off Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Ramp Off Stage</label>
            <input
              type="text"
              value={patient.rampOffStage || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Ramp Off Time</label>
            <input
              type="date"
              value={patient.rampOffTime || ''}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Exit Category</label>
            {isEditing ? (
              <select className="input-field" defaultValue={patient.exitCategory || ''}>
                <option value="">Select exit category...</option>
                {exitCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={patient.exitCategory || 'Not set'}
                className="input-readonly"
                readOnly
              />
            )}
          </div>
          <div>
            <label className="label">Exit Date</label>
            <input
              type="date"
              value={patient.exitDate || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="border-t border-corporate-200 pt-6">
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Ramp Off Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-corporate-200"></div>
          <div className="space-y-6">
            {stages.map((stage) => {
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
      
      {/* Milestone Details */}
      <div className="border-t border-corporate-200 pt-6">
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Milestone Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Offboarding Attempted</label>
            <input
              type="date"
              value={patient.offboardingAttempted || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Offboarding Completed</label>
            <input
              type="date"
              value={patient.offboardingCompleted || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
      
      {/* Exit Information */}
      {patient.exitCategory && (
        <div className="border-t border-corporate-200 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <LogOut className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-corporate-900">Exit Information</h3>
          </div>
          
          <div className={`p-4 rounded ${
            patient.exitCategory === 'PROGRAM COMPLETED' || patient.exitCategory === 'PROGRAM GRADUATED'
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-yellow-50 border-2 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-corporate-600">Exit Category</div>
                <div className="text-lg font-semibold text-corporate-900 mt-1">
                  {patient.exitCategory}
                </div>
              </div>
              {patient.exitDate && (
                <div className="text-right">
                  <div className="text-sm text-corporate-600">Exit Date</div>
                  <div className="font-medium text-corporate-900 mt-1">
                    {patient.exitDate}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Notes Section */}
      {isEditing && (
        <div className="border-t border-corporate-200 pt-6">
          <h3 className="text-lg font-semibold text-corporate-900 mb-4">Exit Notes</h3>
          <textarea
            className="input-field"
            rows="4"
            placeholder="Add any relevant notes about the patient's exit from the program..."
          ></textarea>
        </div>
      )}
    </div>
  );
}


