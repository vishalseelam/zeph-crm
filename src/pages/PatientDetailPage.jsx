import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Clock, Package, TrendingUp, Activity, DollarSign, LogOut, Phone, Mail, FileText } from 'lucide-react';
import { patients, riskTickets, deferralTickets } from '../data';
import { calculateHealthScore, getHealthIcon } from '../utils/healthScore';
import InformationTab from '../components/patient-tabs/InformationTab';
import KitTab from '../components/patient-tabs/KitTab';
import RiskTicketTab from '../components/patient-tabs/RiskTicketTab';
import DeferralTicketTab from '../components/patient-tabs/DeferralTicketTab';
import RampOnTab from '../components/patient-tabs/RampOnTab';
import ProgramTab from '../components/patient-tabs/ProgramTab';
import MaintenanceTab from '../components/patient-tabs/MaintenanceTab';
import RampOffTab from '../components/patient-tabs/RampOffTab';

export default function PatientDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'information');
  const [isEditing, setIsEditing] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(null);
  
  // Scroll to top when patient changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const patient = patients.find(p => p.id === id);
  const patientRisks = riskTickets.filter(r => r.patientId === id);
  const patientDeferrals = deferralTickets.filter(d => d.patientId === id);
  const health = patient ? calculateHealthScore(patient) : null;
  
  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-corporate-600">Patient not found</p>
        <Link to="/funnel" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          ← Back to Funnel
        </Link>
      </div>
    );
  }
  
  const tabs = [
    { id: 'information', label: 'Info', icon: Activity, color: 'blue' },
    { id: 'kit', label: 'Kit', icon: Package, color: 'purple' },
    { id: 'risk', label: 'Risks', icon: AlertCircle, color: 'red', badge: patientRisks.length },
    { id: 'deferral', label: 'Deferrals', icon: Clock, color: 'yellow', badge: patientDeferrals.length },
    { id: 'rampon', label: 'Ramp On', icon: TrendingUp, color: 'green' },
    { id: 'program', label: 'Program', icon: Activity, color: 'indigo' },
    { id: 'maintenance', label: 'Maintenance', icon: DollarSign, color: 'emerald' },
    { id: 'rampoff', label: 'Ramp Off', icon: LogOut, color: 'gray' },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'information':
        return <InformationTab patient={patient} isEditing={isEditing} />;
      case 'kit':
        return <KitTab patient={patient} isEditing={isEditing} />;
      case 'risk':
        return <RiskTicketTab patient={patient} tickets={patientRisks} isEditing={isEditing} />;
      case 'deferral':
        return <DeferralTicketTab patient={patient} tickets={patientDeferrals} isEditing={isEditing} />;
      case 'rampon':
        return <RampOnTab patient={patient} isEditing={isEditing} />;
      case 'program':
        return <ProgramTab patient={patient} isEditing={isEditing} />;
      case 'maintenance':
        return <MaintenanceTab patient={patient} isEditing={isEditing} />;
      case 'rampoff':
        return <RampOffTab patient={patient} isEditing={isEditing} />;
      default:
        return null;
    }
  };
  
  const quickActions = [
    { id: 'call', label: 'Call', icon: Phone },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'note', label: 'Note', icon: FileText },
  ];
  
  return (
    <div className="flex gap-6">
      {/* Sleek Sidebar */}
      <div className="w-56 flex-shrink-0 space-y-3 sticky top-6 self-start">
        {/* Patient Card - Sleek */}
        <div className="card p-3">
          <div className="text-center mb-3">
            <div className="w-12 h-12 bg-brand-primary rounded flex items-center justify-center mx-auto mb-2">
              <span className="text-xl font-bold text-white">
                {patient.name.split(',')[0][0]}{patient.name.split(',')[1]?.trim()[0]}
              </span>
            </div>
            <h3 className="font-bold text-sm text-brand-primary">{patient.name}</h3>
            <p className="text-xs text-corporate-500 mt-0.5 font-mono">{patient.id}</p>
          </div>
          
          {/* Compact Stats */}
          <div className="space-y-1.5 text-xs border-t border-corporate-200 pt-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-corporate-500 uppercase text-xs">Stage</span>
              <span className="font-semibold text-corporate-900">{patient.currentStage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-corporate-500 uppercase text-xs">State</span>
              <span className="font-medium text-corporate-700">{patient.state}</span>
            </div>
            {health && health.score <= 3 && (
              <div className="flex justify-between items-center">
                <span className="text-corporate-500 uppercase text-xs">Status</span>
                <span className={`text-xs px-1.5 py-0.5 rounded border ${
                  health.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                  health.color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  health.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {health.level}
                </span>
              </div>
            )}
          </div>
          
          {/* Alerts - Compact */}
          {(patient.lastRiskStage === 'Active' || patient.lastDeferralStage === 'Active') && (
            <div className="border-t border-corporate-200 pt-3 mb-3 space-y-1.5">
              {patient.lastRiskStage === 'Active' && (
                <div className="flex items-center space-x-1.5 text-red-700 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{patient.lastRiskType}</span>
                </div>
              )}
              {patient.lastDeferralStage === 'Active' && (
                <div className="flex items-center space-x-1.5 text-yellow-700 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{patient.lastDeferralCategory}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Quick Actions - Sleek */}
          <div className="border-t border-corporate-200 pt-2">
            <div className="text-xs text-corporate-500 font-semibold mb-1.5 uppercase tracking-wide">Actions</div>
            <div className="flex flex-col space-y-1">
              {quickActions.map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => setShowQuickAction(action.id)}
                    className="flex items-center space-x-2 px-2 py-1.5 text-xs rounded hover:bg-corporate-100 transition-colors text-left border border-transparent hover:border-corporate-300"
                    title={action.label}
                  >
                    <Icon className="w-3.5 h-3.5 text-corporate-600" />
                    <span className="text-corporate-900">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Progress Bars - Sleek */}
        {patient.programStage === 'Active' && (
          <div className="card p-3">
            <div className="text-xs text-corporate-500 font-semibold mb-2 uppercase tracking-wide">Progress</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-corporate-600">Live</span>
                  <span className="text-corporate-900 font-semibold">{patient.liveSessionAttendance}</span>
                </div>
                <div className="w-full bg-corporate-200 rounded h-1">
                  <div
                    className="bg-blue-500 h-1 rounded"
                    style={{ width: patient.liveSessionAttendance }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-corporate-600">Solo</span>
                  <span className="text-corporate-900 font-semibold">{patient.soloSessionAttendance}</span>
                </div>
                <div className="w-full bg-corporate-200 rounded h-1">
                  <div
                    className="bg-purple-500 h-1 rounded"
                    style={{ width: patient.soloSessionAttendance }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content - Sleek */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header - Minimal */}
        <div className="flex items-center justify-between">
          <Link
            to="/funnel"
            className="flex items-center space-x-1.5 text-sm text-corporate-600 hover:text-corporate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn-${isEditing ? 'primary' : 'secondary'} flex items-center space-x-1.5`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Save' : 'Edit'}</span>
          </button>
        </div>
        
        {/* Sleek Tabs */}
        <div className="card p-0">
          {/* Tab Selector - Sleek Pills */}
          <div className="border-b border-corporate-200 px-3 py-2">
            {/* Mobile Dropdown */}
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="input-field"
              >
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label} {tab.badge > 0 ? `(${tab.badge})` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Desktop Pills - Sleeker */}
            <div className="hidden md:flex flex-wrap gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-primary text-white'
                        : 'bg-corporate-100 text-brand-primary hover:bg-brand-accent hover:bg-opacity-20 border border-corporate-300'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                    {tab.badge > 0 && (
                      <span className={`px-1 py-0.5 text-xs rounded ${
                        isActive ? 'bg-primary-500' : 'bg-corporate-300'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Tab Content - Tighter Padding */}
          <div className="p-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      {/* Quick Action Modals */}
      {showQuickAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-corporate-900 mb-4">
                {showQuickAction === 'call' && 'Log Phone Call'}
                {showQuickAction === 'email' && 'Send Email'}
                {showQuickAction === 'note' && 'Add Note'}
              </h3>
              
              <div className="space-y-4">
                {showQuickAction === 'call' && (
                  <>
                    <div>
                      <label className="label">Call Outcome</label>
                      <select className="input-field">
                        <option>Connected - Patient available</option>
                        <option>Connected - Left voicemail</option>
                        <option>No answer</option>
                        <option>Wrong number</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Notes</label>
                      <textarea className="input-field" rows="4" placeholder="Call summary..."></textarea>
                    </div>
                  </>
                )}
                
                {showQuickAction === 'email' && (
                  <>
                    <div>
                      <label className="label">Email Template</label>
                      <select className="input-field">
                        <option>Appointment Reminder</option>
                        <option>Payment Reminder</option>
                        <option>Check-in</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Message</label>
                      <textarea className="input-field" rows="4" placeholder="Email message..."></textarea>
                    </div>
                  </>
                )}
                
                {showQuickAction === 'note' && (
                  <div>
                    <label className="label">Note</label>
                    <textarea className="input-field" rows="6" placeholder="Add patient note..."></textarea>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-corporate-200">
                <button onClick={() => setShowQuickAction(null)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={() => setShowQuickAction(null)} className="btn-primary">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

