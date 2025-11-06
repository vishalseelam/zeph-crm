import { DollarSign, CheckCircle, XCircle, AlertTriangle, Send, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function MaintenanceTab({ patient, isEditing }) {
  const [showLiveSessions, setShowLiveSessions] = useState(false);
  const [showSoloSessions, setShowSoloSessions] = useState(false);
  const payments = patient.maintenancePayments || [];
  
  const totalPaid = payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
  const totalDue = payments.reduce((sum, p) => sum + p.amount, 0);
  const unpaidPayments = payments.filter(p => !p.paid);
  
  // Calculate days overdue for unpaid payments
  const getDaysOverdue = (paymentDate) => {
    const due = new Date(paymentDate);
    const now = new Date();
    const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };
  
  const paymentReliability = payments.length > 0 
    ? Math.round((payments.filter(p => p.paid).length / payments.length) * 100)
    : 100;
  
  return (
    <div className="space-y-4">
      {/* Status Overview */}
      <div className="flex items-center justify-between p-3 bg-corporate-50 rounded">
        <div>
          <div className="text-xs text-corporate-600">Maintenance Stage</div>
          <div className="text-lg font-bold text-corporate-900">
            {patient.maintenanceStage === 'Active' && patient.maintenanceSoloSessionNumber 
              ? `SOLO SESSION ${patient.maintenanceSoloSessionNumber}`
              : patient.maintenanceStage}
          </div>
        </div>
        {patient.maintenanceTime && (
          <div className="text-right">
            <div className="text-xs text-corporate-600">Started</div>
            <div className="font-medium text-corporate-900 text-sm">{patient.maintenanceTime}</div>
          </div>
        )}
      </div>
      
      {/* Overdue Payments Alert */}
      {unpaidPayments.length > 0 && (
        <div className="p-3 border-l-4 border-l-red-500 bg-red-50 rounded">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-red-900 mb-1 text-sm">
                {unpaidPayments.length} Overdue Payment{unpaidPayments.length > 1 ? 's' : ''}
              </div>
              {unpaidPayments.map((payment, index) => {
                const daysOverdue = getDaysOverdue(payment.started);
                return (
                  <div key={index} className="text-xs text-red-700 mb-1">
                    Month {payment.month}: ${payment.amount} 
                    {daysOverdue > 0 && ` (${daysOverdue} days overdue)`}
                  </div>
                );
              })}
              <div className="mt-2 flex items-center space-x-2">
                <button className="btn-primary text-xs py-1 px-2 flex items-center space-x-1">
                  <Send className="w-3 h-3" />
                  <span>Send Reminder</span>
                </button>
                <button className="btn-secondary text-xs py-1 px-2">Mark Paid</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Maintenance Information - Matching Excel */}
      <div>
        <h3 className="text-base font-semibold text-corporate-900 mb-3">Maintenance Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="label">Maintenance Stage</label>
            <input
              type="text"
              value={patient.maintenanceStage || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Maintenance Time</label>
            <input
              type="date"
              value={patient.maintenanceTime || ''}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Cohort Type</label>
            <input
              type="text"
              value={patient.maintenanceCohortType || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Cohort ID</label>
            <input
              type="text"
              value={patient.cohortId || 'N/A'}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Live Session Type</label>
            <input
              type="text"
              value={patient.maintenanceLiveSessionType || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Live Days</label>
            <input
              type="text"
              value={patient.maintenanceLiveDays || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Live Time</label>
            <input
              type="text"
              value={patient.maintenanceLiveTime || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Solo Days</label>
            <input
              type="text"
              value={patient.maintenanceSoloDays || 'N/A'}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Solo Time</label>
            <input
              type="text"
              value={patient.maintenanceSoloTime || 'N/A'}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
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
                ({patient.maintenanceLiveSessionsCompleted || 0}/{patient.maintenanceLiveSessionsTotal || 0} completed)
              </span>
            </div>
            {showLiveSessions ? (
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {showLiveSessions && (
            <div className="mt-2 p-3 bg-white border border-blue-200 rounded">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Array.from({ length: patient.maintenanceLiveSessionsTotal || 0 }, (_, i) => i + 1).map((sessionNum) => (
                  <div key={`live-${sessionNum}`}>
                    <label className="label text-xs">Live Session {sessionNum}</label>
                    <input
                      type="date"
                      className={isEditing ? 'input-field text-xs' : 'input-readonly text-xs'}
                      readOnly={!isEditing}
                      placeholder="Not scheduled"
                      defaultValue={sessionNum <= (patient.maintenanceLiveSessionsCompleted || 0) ? '2024-10-18' : ''}
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
                ({patient.maintenanceSoloSessionsCompleted || 0}/{patient.maintenanceSoloSessionsTotal || 0} completed)
              </span>
            </div>
            {showSoloSessions ? (
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {showSoloSessions && (
            <div className="mt-2 p-3 bg-white border border-purple-200 rounded">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Array.from({ length: patient.maintenanceSoloSessionsTotal || 0 }, (_, i) => i + 1).map((sessionNum) => (
                  <div key={`solo-${sessionNum}`}>
                    <label className="label text-xs">Solo Session {sessionNum}</label>
                    <input
                      type="date"
                      className={isEditing ? 'input-field text-xs' : 'input-readonly text-xs'}
                      readOnly={!isEditing}
                      placeholder="Not scheduled"
                      defaultValue={sessionNum <= (patient.maintenanceSoloSessionsCompleted || 0) ? '2024-10-18' : ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Summary */}
      {payments.length > 0 && (
        <div className="border-t border-corporate-200 pt-4">
          <h3 className="text-base font-semibold text-corporate-900 mb-3">Payment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center space-x-1.5 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div className="text-xs text-green-600 font-semibold">Total Paid</div>
              </div>
              <div className="text-xl font-bold text-green-900">${totalPaid}</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center space-x-1.5 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <div className="text-xs text-blue-600 font-semibold">Total Due</div>
              </div>
              <div className="text-xl font-bold text-blue-900">${totalDue}</div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <div className="flex items-center space-x-1.5 mb-1">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <div className="text-xs text-purple-600 font-semibold">Months</div>
              </div>
              <div className="text-xl font-bold text-purple-900">{payments.length}</div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <div className="flex items-center space-x-1.5 mb-1">
                <DollarSign className="w-4 h-4 text-orange-600" />
                <div className="text-xs text-orange-600 font-semibold">Reliability</div>
              </div>
              <div className="text-xl font-bold text-orange-900">{paymentReliability}%</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment History */}
      <div className="border-t border-corporate-200 pt-4">
        <h3 className="text-base font-semibold text-corporate-900 mb-3">Payment History</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-6 bg-corporate-50 rounded">
            <DollarSign className="w-8 h-8 text-corporate-400 mx-auto mb-2" />
            <p className="text-corporate-600 text-xs">No maintenance payments recorded</p>
          </div>
        ) : isEditing ? (
          // EDIT MODE - Show full editable grid
          <div className="space-y-2">
            {payments.map((payment, index) => {
              const daysOverdue = payment.paid ? 0 : getDaysOverdue(payment.started);
              
              return (
                <div
                  key={index}
                  className="p-2 bg-white border border-corporate-200 rounded"
                >
                  <div className="grid grid-cols-4 gap-2 items-end">
                    {/* Month X Started [W] */}
                    <div>
                      <label className="label text-xs">Month {payment.month} - Started</label>
                      <input
                        type="date"
                        defaultValue={payment.started}
                        className="input-field text-xs"
                      />
                    </div>
                    
                    {/* Month X Paid [W] */}
                    <div>
                      <label className="label text-xs">Paid</label>
                      <div className="flex items-center h-8">
                        <input
                          type="checkbox"
                          defaultChecked={payment.paid}
                          className="w-4 h-4"
                        />
                        <span className={`ml-2 text-xs font-medium ${
                          payment.paid ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {payment.paid ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Month X Payment Amount [W] */}
                    <div>
                      <label className="label text-xs">Amount</label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-corporate-600">$</span>
                        <input
                          type="number"
                          defaultValue={payment.amount}
                          className="input-field text-xs pl-6"
                        />
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div>
                      <label className="label text-xs opacity-0">Actions</label>
                      <button className="btn-secondary text-xs py-1.5 px-2 w-full flex items-center justify-center space-x-1">
                        <Send className="w-3 h-3" />
                        <span>Remind</span>
                      </button>
                    </div>
                  </div>
                  {daysOverdue > 0 && (
                    <div className="text-xs text-red-600 font-medium mt-1">
                      ⚠ Overdue by {daysOverdue} days
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // VIEW MODE - Clean compact list
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {payments.map((payment, index) => {
              const daysOverdue = payment.paid ? 0 : getDaysOverdue(payment.started);
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded border ${
                    payment.paid
                      ? 'border-green-200 bg-green-50'
                      : daysOverdue > 0
                      ? 'border-red-200 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      payment.paid ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {payment.paid ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-corporate-900 text-xs">
                        Month {payment.month}
                      </div>
                      <div className="text-xs text-corporate-600">
                        {payment.started}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-bold text-corporate-900">
                      ${payment.amount}
                    </div>
                    <div className={`text-xs font-medium ${
                      payment.paid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {payment.paid ? 'Paid' : daysOverdue > 0 ? `${daysOverdue}d late` : 'Pending'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Add Payment (Edit Mode) */}
      {isEditing && (
        <div className="border-t border-corporate-200 pt-4">
          <h3 className="text-base font-semibold text-corporate-900 mb-3">Add New Payment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="label">Month</label>
              <input
                type="number"
                className="input-field"
                placeholder="Month number"
                defaultValue={payments.length + 1}
              />
            </div>
            <div>
              <label className="label">Started Date</label>
              <input
                type="date"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Amount</label>
              <input
                type="number"
                className="input-field"
                placeholder="299"
                defaultValue="299"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <input type="checkbox" id="paid" className="w-4 h-4" />
            <label htmlFor="paid" className="text-xs text-corporate-700">
              Payment already received
            </label>
          </div>
          <button className="btn-primary mt-3 text-sm">Add Payment Record</button>
        </div>
      )}
    </div>
  );
}

