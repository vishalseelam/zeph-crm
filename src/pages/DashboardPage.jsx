import { Link } from 'react-router-dom';
import { AlertCircle, Clock, Package, DollarSign, TrendingUp, Activity, Users, Calendar } from 'lucide-react';
import { patients, riskTickets, deferralTickets, cohorts } from '../data';
import { calculateHealthScore, getUrgentActions, getUpcomingEvents } from '../utils/healthScore';

export default function DashboardPage() {
  const urgentActions = getUrgentActions(patients, riskTickets, deferralTickets);
  const upcomingEvents = getUpcomingEvents(patients, cohorts);
  
  // Calculate stats
  const activePatients = patients.filter(p => 
    ['Ramp On', 'Program', 'Maintenance'].includes(p.currentStage)
  ).length;
  
  const atRiskPatients = patients.filter(p => {
    const health = calculateHealthScore(p);
    return health.score <= 2;
  }).length;
  
  const unpaidPayments = patients.reduce((count, p) => {
    const unpaid = (p.maintenancePayments || []).filter(pm => !pm.paid).length;
    return count + unpaid;
  }, 0);
  
  const todaySessions = 2; // Mock - would calculate based on cohort schedules
  
  // Stage distribution
  const stageDistribution = {
    'Kit': patients.filter(p => p.currentStage === 'Kit').length,
    'Ramp On': patients.filter(p => p.currentStage === 'Ramp On').length,
    'Program': patients.filter(p => p.currentStage === 'Program').length,
    'Maintenance': patients.filter(p => p.currentStage === 'Maintenance').length,
    'Ramp Off': patients.filter(p => p.currentStage === 'Ramp Off').length,
  };
  
  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-50 border-red-500 text-red-900',
      high: 'bg-orange-50 border-orange-500 text-orange-900',
      medium: 'bg-yellow-50 border-yellow-500 text-yellow-900',
      low: 'bg-blue-50 border-blue-500 text-blue-900'
    };
    return colors[priority] || colors.medium;
  };
  
  const getActionIcon = (type) => {
    const icons = {
      risk: AlertCircle,
      deferral: Clock,
      kit: Package,
      payment: DollarSign,
      attendance: Activity
    };
    return icons[type] || AlertCircle;
  };
  
  return (
    <div className="space-y-4">
      {/* Welcome Header - Branded */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">Operations Dashboard</h2>
          <p className="text-sm text-corporate-600 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      
      {/* Urgent Actions Section - Sleek */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-corporate-900 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>Urgent Actions</span>
            <span className="badge badge-danger ml-1">{urgentActions.length}</span>
          </h3>
          <Link to="/funnel?filter=urgent" className="text-primary-600 hover:text-primary-700 font-medium text-xs">
            View All →
          </Link>
        </div>
        
        {urgentActions.length === 0 ? (
          <div className="text-center py-6 bg-green-50 border border-green-200 rounded">
            <div className="text-green-700 font-semibold text-sm">✓ No urgent actions needed</div>
            <p className="text-xs text-green-600 mt-1">All patients are on track</p>
          </div>
        ) : (
          <div className="space-y-2">
            {urgentActions.slice(0, 5).map((action, index) => {
              const Icon = getActionIcon(action.type);
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 border-l-2 rounded ${getPriorityColor(action.priority)}`}
                >
                  <div className="flex items-center space-x-2.5 flex-1">
                    <Icon className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{action.patient.name} - {action.message}</div>
                      <div className="text-xs opacity-75 mt-0.5">{action.detail}</div>
                    </div>
                  </div>
                  <Link
                    to={action.link}
                    className="btn-primary ml-3"
                  >
                    {action.action}
                  </Link>
                </div>
              );
            })}
            {urgentActions.length > 5 && (
              <div className="text-center pt-2">
                <Link to="/funnel?filter=urgent" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  +{urgentActions.length - 5} more urgent actions
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Today's Overview Stats - Sleek */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="card p-3 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">Active</div>
              <div className="text-2xl font-bold text-blue-900">{activePatients}</div>
            </div>
            <Activity className="w-8 h-8 text-blue-600 opacity-40" />
          </div>
        </div>
        
        <div className="card p-3 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-red-700 font-semibold uppercase tracking-wide mb-1">At Risk</div>
              <div className="text-2xl font-bold text-red-900">{atRiskPatients}</div>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600 opacity-40" />
          </div>
        </div>
        
        <div className="card p-3 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-yellow-700 font-semibold uppercase tracking-wide mb-1">Unpaid</div>
              <div className="text-2xl font-bold text-yellow-900">{unpaidPayments}</div>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600 opacity-40" />
          </div>
        </div>
        
        <div className="card p-3 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Today</div>
              <div className="text-2xl font-bold text-green-900">{todaySessions}</div>
            </div>
            <Calendar className="w-8 h-8 text-green-600 opacity-40" />
          </div>
        </div>
      </div>
      
      {/* Patient Flow Funnel */}
      <div className="card">
        <h3 className="text-xl font-bold text-corporate-900 mb-6">Patient Flow</h3>
        <div className="space-y-2">
          {Object.entries(stageDistribution).map(([stage, count]) => {
            const percentage = patients.length > 0 ? (count / patients.length) * 100 : 0;
            const colors = {
              'Kit': 'bg-purple-500',
              'Ramp On': 'bg-blue-500',
              'Program': 'bg-green-500',
              'Maintenance': 'bg-yellow-500',
              'Ramp Off': 'bg-gray-500'
            };
            
            return (
              <div key={stage}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-corporate-700">{stage}</span>
                  <span className="text-corporate-600">{count} patients ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-corporate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 ${colors[stage]} transition-all duration-500 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-corporate-200">
          <Link to="/funnel" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            View Full Funnel →
          </Link>
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-corporate-900 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-primary-600" />
            <span>Upcoming</span>
          </h3>
        </div>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 bg-corporate-50 rounded-lg">
            <p className="text-corporate-600">No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-corporate-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-corporate-900">{event.message}</div>
                    <div className="text-sm text-corporate-600">{event.detail}</div>
                  </div>
                </div>
                <div className="text-sm text-corporate-500">{event.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Active Cohorts Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cohorts.slice(0, 2).map(cohort => {
          const cohortPatients = patients.filter(p => p.cohortId === cohort.id);
          
          return (
            <div key={cohort.id} className="card border-l-4 border-l-primary-500">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-corporate-900">{cohort.id}</h4>
                  <p className="text-sm text-corporate-600">{cohort.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-corporate-500" />
                  <span className="text-sm font-medium text-corporate-700">
                    {cohortPatients.length}/{cohort.size}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-corporate-600">Next Live:</span>
                  <span className="font-medium text-corporate-900">{cohort.liveDays} at {cohort.liveTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-corporate-600">Next Solo:</span>
                  <span className="font-medium text-corporate-900">{cohort.soloDays} at {cohort.soloTime}</span>
                </div>
              </div>
              
              <Link
                to="/cohort"
                className="mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm inline-block"
              >
                Manage Cohort →
              </Link>
            </div>
          );
        })}
      </div>
      
      {/* Quick Access Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/funnel" className="card hover:shadow-md transition-shadow">
          <Activity className="w-8 h-8 text-primary-600 mb-2" />
          <div className="font-semibold text-corporate-900">Patient Funnel</div>
          <div className="text-sm text-corporate-600 mt-1">{patients.length} total patients</div>
        </Link>
        
        <Link to="/cohort" className="card hover:shadow-md transition-shadow">
          <Users className="w-8 h-8 text-primary-600 mb-2" />
          <div className="font-semibold text-corporate-900">Cohorts</div>
          <div className="text-sm text-corporate-600 mt-1">{cohorts.length} active cohorts</div>
        </Link>
        
        <Link to="/funnel?filter=risks" className="card hover:shadow-md transition-shadow">
          <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
          <div className="font-semibold text-corporate-900">Risk Tickets</div>
          <div className="text-sm text-corporate-600 mt-1">{riskTickets.length} total tickets</div>
        </Link>
        
        <Link to="/funnel?filter=payments" className="card hover:shadow-md transition-shadow">
          <DollarSign className="w-8 h-8 text-green-600 mb-2" />
          <div className="font-semibold text-corporate-900">Payments</div>
          <div className="text-sm text-corporate-600 mt-1">Track maintenance</div>
        </Link>
      </div>
    </div>
  );
}

