import { useState } from 'react';
import { Plus, AlertCircle, User, CheckCircle } from 'lucide-react';
import { riskTypes } from '../../data';

export default function RiskTicketTab({ patient, tickets, isEditing }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState(null);
  
  const getStatusBadge = (stage) => {
    const colors = {
      'Active': 'badge-danger',
      'Investigating': 'badge-warning',
      'Mitigated': 'badge-info',
      'Resolved': 'badge-success',
    };
    return colors[stage] || 'badge-neutral';
  };
  
  const getWorkflowSteps = (ticket) => {
    return [
      { label: 'Active', completed: true, date: ticket.triggered },
      { label: 'Investigating', completed: !!ticket.mitigationAttempted, date: ticket.mitigationAttempted },
      { label: 'Resolved', completed: !!ticket.mitigationCompleted, date: ticket.mitigationCompleted },
    ];
  };
  
  // Mock activity log
  const getActivityLog = (ticket) => {
    const log = [
      { date: ticket.triggered, user: 'System', action: `Risk triggered - ${ticket.type}` },
    ];
    
    if (ticket.mitigationAttempted) {
      log.push({ date: ticket.mitigationAttempted, user: 'Sarah M.', action: 'Mitigation attempted - called patient' });
    }
    
    if (ticket.mitigationCompleted) {
      log.push({ date: ticket.mitigationCompleted, user: 'Sarah M.', action: 'Risk resolved - issue addressed' });
    }
    
    return log.reverse();
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-corporate-900">Risk Tickets</h3>
          <p className="text-sm text-corporate-600 mt-1">
            Track and manage patient risks with workflow states
          </p>
        </div>
        {isEditing && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Risk Ticket</span>
          </button>
        )}
      </div>
      
      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-corporate-50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-corporate-400 mx-auto mb-3" />
          <p className="text-corporate-600">No risk tickets found for this patient</p>
          {isEditing && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Create first risk ticket
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const workflowSteps = getWorkflowSteps(ticket);
            const activityLog = getActivityLog(ticket);
            const isExpanded = expandedTicket === ticket.id;
            
            return (
              <div key={ticket.id} className="card border-l-4 border-l-red-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-corporate-900">{ticket.id}</h4>
                      <span className={`badge ${getStatusBadge(ticket.stage)}`}>
                        {ticket.stage}
                      </span>
                    </div>
                    <p className="text-sm text-corporate-600 mt-1">{ticket.type} Risk</p>
                  </div>
                  <div className="text-right text-sm text-corporate-600">
                    <div>Triggered: {ticket.triggered}</div>
                    {ticket.mitigationCompleted && (
                      <div className="text-green-600">Completed: {ticket.mitigationCompleted}</div>
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
                
                {/* Risk Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-corporate-500">Risk Type</div>
                    <div className="text-sm font-medium text-corporate-900">{ticket.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-corporate-500">Triggered Date</div>
                    <div className="text-sm font-medium text-corporate-900">{ticket.triggered}</div>
                  </div>
                  <div>
                    <div className="text-xs text-corporate-500">Mitigation Attempted</div>
                    <div className="text-sm font-medium text-corporate-900">
                      {ticket.mitigationAttempted || 'Not yet'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-corporate-500">Mitigation Completed</div>
                    <div className="text-sm font-medium text-corporate-900">
                      {ticket.mitigationCompleted || 'In progress'}
                    </div>
                  </div>
                </div>
                
                {/* Activity Log Toggle */}
                <button
                  onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-3"
                >
                  {isExpanded ? 'Hide' : 'Show'} Activity Log →
                </button>
                
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
                      {isEditing && (
                        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                          + Add Activity
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {ticket.notes && (
                  <div className="pt-3 border-t border-corporate-200">
                    <div className="text-xs text-corporate-500 mb-1">Notes</div>
                    <p className="text-sm text-corporate-700">{ticket.notes}</p>
                  </div>
                )}
                
                {ticket.stage === 'Active' && isEditing && (
                  <div className="mt-3 flex items-center space-x-2">
                    <button className="btn-primary text-sm">Update Status</button>
                    <button className="btn-secondary text-sm">Assign To</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Add Risk Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-corporate-900 mb-4">New Risk Ticket</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Risk Type</label>
                    <select className="input-field">
                      <option value="">Select type...</option>
                      {riskTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Priority</label>
                    <select className="input-field">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Triggered Date</label>
                    <input type="date" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Assign To</label>
                    <select className="input-field">
                      <option>Sarah M. (Care Coordinator)</option>
                      <option>John D. (Clinical Lead)</option>
                      <option>Emily R. (Operations)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input-field"
                    rows="4"
                    placeholder="Describe the risk and any immediate concerns..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="label">Mitigation Plan</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Outline steps to address this risk..."
                  ></textarea>
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
                  Create Risk Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

