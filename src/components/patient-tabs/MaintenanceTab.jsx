import { DollarSign, CheckCircle, XCircle, AlertTriangle, Send } from 'lucide-react';

export default function MaintenanceTab({ patient, isEditing }) {
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
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="flex items-center justify-between p-4 bg-corporate-50 rounded-lg">
        <div>
          <div className="text-sm text-corporate-600">Maintenance Stage</div>
          <div className="text-xl font-bold text-corporate-900">{patient.maintenanceStage}</div>
        </div>
        {patient.maintenanceTime && (
          <div className="text-right">
            <div className="text-sm text-corporate-600">Started</div>
            <div className="font-medium text-corporate-900">{patient.maintenanceTime}</div>
          </div>
        )}
      </div>
      
      {/* Overdue Payments Alert */}
      {unpaidPayments.length > 0 && (
        <div className="card border-l-4 border-l-red-500 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-red-900 mb-1">
                {unpaidPayments.length} Overdue Payment{unpaidPayments.length > 1 ? 's' : ''}
              </div>
              {unpaidPayments.map((payment, index) => {
                const daysOverdue = getDaysOverdue(payment.started);
                return (
                  <div key={index} className="text-sm text-red-700 mb-2">
                    Month {payment.month}: ${payment.amount} 
                    {daysOverdue > 0 && ` (${daysOverdue} days overdue)`}
                  </div>
                );
              })}
              <div className="mt-3 flex items-center space-x-2">
                <button className="btn-primary text-sm flex items-center space-x-1">
                  <Send className="w-3 h-3" />
                  <span>Send Reminder</span>
                </button>
                <button className="btn-secondary text-sm">Mark as Paid</button>
                <button className="btn-secondary text-sm">Payment Plan</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Upcoming Payment */}
      {patient.maintenanceStage === 'Active' && (
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-700 mb-1">Next Payment Due</div>
              <div className="text-lg font-bold text-blue-900">
                Month {payments.length + 1} - $299
              </div>
              <div className="text-sm text-blue-600 mt-1">
                Due in 15 days (Dec 20, 2024)
              </div>
            </div>
            <button className="btn-primary">Schedule Reminder</button>
          </div>
        </div>
      )}
      
      {/* Maintenance Information */}
      <div>
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Maintenance Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
      
      {/* Payment Summary */}
      {payments.length > 0 && (
        <div className="border-t border-corporate-200 pt-6">
          <h3 className="text-lg font-semibold text-corporate-900 mb-4">Payment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card bg-green-50">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div className="text-sm text-green-600">Total Paid</div>
              </div>
              <div className="text-2xl font-bold text-green-900">${totalPaid}</div>
            </div>
            <div className="card bg-blue-50">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <div className="text-sm text-blue-600">Total Due</div>
              </div>
              <div className="text-2xl font-bold text-blue-900">${totalDue}</div>
            </div>
            <div className="card bg-purple-50">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div className="text-sm text-purple-600">Months</div>
              </div>
              <div className="text-2xl font-bold text-purple-900">{payments.length}</div>
            </div>
            <div className="card bg-orange-50">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <div className="text-sm text-orange-600">Reliability</div>
              </div>
              <div className="text-2xl font-bold text-orange-900">{paymentReliability}%</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment History */}
      <div className="border-t border-corporate-200 pt-6">
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Payment History</h3>
        
        {payments.length === 0 ? (
          <div className="text-center py-12 bg-corporate-50 rounded-lg">
            <DollarSign className="w-12 h-12 text-corporate-400 mx-auto mb-3" />
            <p className="text-corporate-600">No maintenance payments recorded</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment, index) => {
              const daysOverdue = payment.paid ? 0 : getDaysOverdue(payment.started);
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    payment.paid
                      ? 'border-green-200 bg-green-50'
                      : daysOverdue > 0
                      ? 'border-red-200 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.paid ? 'bg-green-100' : daysOverdue > 0 ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {payment.paid ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-corporate-900">
                        Month {payment.month}
                      </div>
                      <div className="text-sm text-corporate-600">
                        Due: {payment.started}
                      </div>
                      {daysOverdue > 0 && (
                        <div className="text-xs text-red-600 font-medium mt-1">
                          Overdue by {daysOverdue} days
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-corporate-900">
                        ${payment.amount}
                      </div>
                      <div className={`text-sm font-medium ${
                        payment.paid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {payment.paid ? 'Paid' : 'Pending'}
                      </div>
                    </div>
                    {!payment.paid && isEditing && (
                      <div className="flex flex-col space-y-1">
                        <button className="btn-primary text-xs py-1 px-2">Mark Paid</button>
                        <button className="btn-secondary text-xs py-1 px-2 flex items-center space-x-1">
                          <Send className="w-3 h-3" />
                          <span>Remind</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Add Payment (Edit Mode) */}
      {isEditing && (
        <div className="border-t border-corporate-200 pt-6">
          <h3 className="text-lg font-semibold text-corporate-900 mb-4">Add New Payment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="label">Due Date</label>
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
          <div className="mt-4 flex items-center space-x-2">
            <input type="checkbox" id="paid" className="w-4 h-4" />
            <label htmlFor="paid" className="text-sm text-corporate-700">
              Payment already received
            </label>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input type="checkbox" id="autoReminder" className="w-4 h-4" defaultChecked />
            <label htmlFor="autoReminder" className="text-sm text-corporate-700">
              Send automatic reminder 3 days before due date
            </label>
          </div>
          <button className="btn-primary mt-4">Add Payment Record</button>
        </div>
      )}
    </div>
  );
}

