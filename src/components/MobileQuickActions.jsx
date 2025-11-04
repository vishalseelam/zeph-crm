import { useState } from 'react';
import { Phone, Mail, FileText, CheckCircle, Package, DollarSign, X } from 'lucide-react';

export default function MobileQuickActions({ patient, onClose }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [note, setNote] = useState('');
  
  const quickActions = [
    { id: 'call', label: 'Phone Call', icon: Phone, color: 'blue' },
    { id: 'session', label: 'Session Attended', icon: CheckCircle, color: 'green' },
    { id: 'payment', label: 'Payment Received', icon: DollarSign, color: 'purple' },
    { id: 'kit', label: 'Kit Delivered', icon: Package, color: 'orange' },
    { id: 'note', label: 'Add Note', icon: FileText, color: 'gray' },
  ];
  
  const handleSubmit = () => {
    // Would save the update here
    console.log('Quick update:', { patient: patient.id, action: selectedAction, note });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center md:p-4">
      <div className="bg-white rounded-t-2xl md:rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-corporate-200 p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-corporate-900">Quick Update</h3>
            <p className="text-sm text-corporate-600">{patient.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-corporate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-corporate-600" />
          </button>
        </div>
        
        {/* Action Selection */}
        <div className="p-4">
          <div className="text-sm font-semibold text-corporate-700 mb-3">What just happened?</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {quickActions.map(action => {
              const Icon = action.icon;
              const isSelected = selectedAction === action.id;
              
              return (
                <button
                  key={action.id}
                  onClick={() => setSelectedAction(action.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `border-${action.color}-500 bg-${action.color}-50`
                      : 'border-corporate-200 hover:border-corporate-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    isSelected ? `text-${action.color}-600` : 'text-corporate-500'
                  }`} />
                  <div className={`text-sm font-medium ${
                    isSelected ? `text-${action.color}-900` : 'text-corporate-700'
                  }`}>
                    {action.label}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Note Input */}
          <div className="mb-4">
            <label className="label">Add a quick note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field"
              rows="4"
              placeholder={`E.g., "Spoke with patient about attendance concerns..."`}
            ></textarea>
          </div>
          
          {/* Context-Specific Fields */}
          {selectedAction === 'call' && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <label className="label">Call Outcome</label>
              <select className="input-field">
                <option>Connected - Resolved</option>
                <option>Connected - Follow-up needed</option>
                <option>Voicemail left</option>
                <option>No answer</option>
              </select>
            </div>
          )}
          
          {selectedAction === 'session' && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <label className="label">Session Type</label>
              <select className="input-field">
                <option>Live Session</option>
                <option>Solo Session</option>
              </select>
            </div>
          )}
          
          {selectedAction === 'payment' && (
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Month</label>
                  <input type="number" className="input-field" placeholder="1" />
                </div>
                <div>
                  <label className="label">Amount</label>
                  <input type="number" className="input-field" placeholder="299" />
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedAction}
              className={`btn-primary flex-1 ${!selectedAction ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Save Update
            </button>
          </div>
          
          {/* Timestamp */}
          <div className="mt-4 text-center text-xs text-corporate-500">
            Update will be timestamped: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

