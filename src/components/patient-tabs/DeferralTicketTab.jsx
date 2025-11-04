import { useState } from 'react';
import { Plus, Clock, User, CheckCircle } from 'lucide-react';
import { deferralCategories } from '../../data';

export default function DeferralTicketTab({ patient, tickets, isEditing }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState(null);
  
  const getStatusBadge = (stage) => {
    const colors = {
      'Active': 'badge-warning',
      'Completed': 'badge-success',
      'Cancelled': 'badge-neutral',
    };
    return colors[stage] || 'badge-neutral';
  };
  
  const getWorkflowSteps = (ticket) => {
    return [
      { label: 'Initiated', completed: true, date: ticket.initiated },
      { label: 'Clinic Notified', completed: !!ticket.clinicAssistanceRequested, date: ticket.clinicAssistanceRequested },
      { label: 'Completed', completed: !!ticket.ended, date: ticket.ended },
    ];
  };
  
  const getActivityLog = (ticket) => {
    const log = [
      { date: ticket.initiated, user: 'Patient', action: `Deferral initiated - ${ticket.category}` },
    ];
    
    if (ticket.clinicAssistanceRequested) {
      log.push({ date: ticket.clinicAssistanceRequested, user: 'Care Team', action: 'Clinic assistance requested' });
    }
    
    if (ticket.ended) {
      log.push({ date: ticket.ended, user: 'Sarah M.', action: 'Deferral completed - patient returned' });
    }
    
    return log.reverse();
  };
  
  const getDaysDeferred = (ticket) => {
    if (!ticket.initiated) return 0;
    const start = new Date(ticket.initiated);
    const end = ticket.ended ? new Date(ticket.ended) : new Date();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-corporate-900">Deferral Tickets</h3>
          <p className="text-sm text-corporate-600 mt-1">
            Track patient deferrals with return planning
          </p>
        </div>
        {isEditing && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Deferral Ticket</span>
          </button>
        )}
      </div>
      
      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-corporate-50 rounded-lg">
          <Clock className="w-12 h-12 text-corporate-400 mx-auto mb-3" />
          <p className="text-corporate-600">No deferral tickets found for this patient</p>
          {isEditing && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Create first deferral ticket
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const workflowSteps = getWorkflowSteps(ticket);
            const activityLog = getActivityLog(ticket);
            const isExpanded = expandedTicket === ticket.id;
            const daysDeferred = getDaysDeferred(ticket);
            
            return (
              <div key={ticket.id} className="card border-l-4 border-l-yellow-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-corporate-900">{ticket.id}</h4>
                      <span className={`badge ${getStatusBadge(ticket.stage)}`}>
                        {ticket.stage}
                      </span>
                    </div>
                    <p className="text-sm text-corporate-600 mt-1">{ticket.category} Deferral</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-corporate-600">Duration: {daysDeferred} days</div>
                    {!ticket.ended && (
                      <div className="text-yellow-600 font-medium">Ongoing</div>
                    )}
                  </div>
                </div>
                
                {/* Workflow Progress */}
                <div className="mb-4">
                  <div className="text-xs text-corporate-600 font-semibold mb-2">WORKFLOW PROGRESS</div>
                  <div className="flex items-center space-x-2">
                    {workflowSteps.map((step, index) => (
                      <div key={index} className="flex items-center flex-1">
                        <div className="flex-1 flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? 'bg-green-500' : 'bg-corporate-300'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-white text-xs">{index + 1}</span>
                            )}
                          </div>
                          {index < workflowSteps.length - 1 && (
                            <div className={`flex-1 h-1 ${
                              workflowSteps[index + 1].completed ? 'bg-green-500' : 'bg-corporate-300'
                            }`}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center mt-2">
                    {workflowSteps.map((step, index) => (
                      <div key={index} className="flex-1 text-center">
                        <div className={`text-xs font-medium ${
                          step.completed ? 'text-green-700' : 'text-corporate-500'
                        }`}>
                          {step.label}
                        </div>
                        {step.date && (
                          <div className="text-xs text-corporate-500">{step.date}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Deferral Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-corporate-500">Category</div>
                    <div className="text-sm font-medium text-corporate-900">{ticket.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-corporate-500">Initiated Date</div>
                    <div className="text-sm font-medium text-corporate-900">{ticket.initiated}</div>
                  </div>
                  <div>
                    <div className="text-xs text-corporate-500">Clinic Assistance</div>
                    <div className="text-sm font-medium text-corporate-900">
                      {ticket.clinicAssistanceRequested || 'Not requested'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-corporate-500">Ended Date</div>
                    <div className="text-sm font-medium text-corporate-900">
                      {ticket.ended || 'Ongoing'}
                    </div>
                  </div>
                </div>
                
                {/* Activity Log */}
                {isExpanded && (
                  <div className="border-t border-corporate-200 pt-3 mb-3">
                    <div className="text-xs text-corporate-600 font-semibold mb-2">ACTIVITY LOG</div>
                    <div className="space-y-2">
                      {activityLog.map((entry, idx) => (
                        <div key={idx} className="flex items-start space-x-3 text-sm">
                          <div className="w-6 h-6 bg-corporate-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-corporate-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-corporate-900">{entry.action}</div>
                            <div className="text-xs text-corporate-500">{entry.user} • {entry.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {ticket.notes && (
                  <div className="pt-3 border-t border-corporate-200">
                    <div className="text-xs text-corporate-500 mb-1">Notes</div>
                    <p className="text-sm text-corporate-700">{ticket.notes}</p>
                  </div>
                )}
                
                {ticket.stage === 'Active' && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">This deferral is currently active</span>
                    </div>
                    {isEditing && (
                      <button className="btn-primary text-sm">Schedule Return</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Add Deferral Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-corporate-900 mb-4">New Deferral Ticket</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Deferral Category</label>
                    <select className="input-field">
                      <option value="">Select category...</option>
                      {deferralCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Expected Return</label>
                    <input type="date" className="input-field" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Initiated Date</label>
                    <input type="date" className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="label">Clinic Notified</label>
                    <input type="date" className="input-field" />
                  </div>
                </div>
                
                <div>
                  <label className="label">Reason for Deferral</label>
                  <textarea
                    className="input-field"
                    rows="4"
                    placeholder="Describe the reason for deferral and any relevant details..."
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notifyClinic" className="w-4 h-4" />
                  <label htmlFor="notifyClinic" className="text-sm text-corporate-700">
                    Send automatic notification to clinic
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-corporate-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-primary"
                >
                  Create Deferral Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

