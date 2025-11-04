// Health Score Calculation for Patient Assessment
// Score: 1-5 (1 = Critical, 5 = Healthy)

export const calculateHealthScore = (patient) => {
  let score = 5;
  let factors = [];
  
  // Factor 1: Active Risks (-2 points)
  if (patient.lastRiskStage === 'Active') {
    score -= 2;
    factors.push({ type: 'risk', impact: -2, reason: 'Active risk ticket' });
  }
  
  // Factor 2: Active Deferral (-1 point)
  if (patient.lastDeferralStage === 'Active') {
    score -= 1;
    factors.push({ type: 'deferral', impact: -1, reason: 'Active deferral' });
  }
  
  // Factor 3: Attendance (Program stage only)
  if (patient.programStage === 'Active') {
    const liveAttendance = parseInt(patient.liveSessionAttendance) || 0;
    const soloAttendance = parseInt(patient.soloSessionAttendance) || 0;
    const avgAttendance = (liveAttendance + soloAttendance) / 2;
    
    if (avgAttendance < 50) {
      score -= 2;
      factors.push({ type: 'attendance', impact: -2, reason: `Low attendance (${avgAttendance.toFixed(0)}%)` });
    } else if (avgAttendance < 75) {
      score -= 1;
      factors.push({ type: 'attendance', impact: -1, reason: `Below target attendance (${avgAttendance.toFixed(0)}%)` });
    }
  }
  
  // Factor 4: Payment Issues (Maintenance stage only)
  if (patient.maintenanceStage === 'Active' && patient.maintenancePayments) {
    const unpaidPayments = patient.maintenancePayments.filter(p => !p.paid);
    if (unpaidPayments.length > 0) {
      score -= 1;
      factors.push({ type: 'payment', impact: -1, reason: `${unpaidPayments.length} unpaid payment(s)` });
    }
  }
  
  // Factor 5: Kit Issues
  if (patient.kitStage === 'Delayed' || patient.kitStage === 'Lost') {
    score -= 1;
    factors.push({ type: 'kit', impact: -1, reason: 'Kit delivery issue' });
  }
  
  // Ensure score stays in range 1-5
  score = Math.max(1, Math.min(5, score));
  
  return {
    score,
    level: getHealthLevel(score),
    color: getHealthColor(score),
    factors
  };
};

const getHealthLevel = (score) => {
  if (score >= 4) return 'Healthy';
  if (score >= 3) return 'Needs Attention';
  if (score >= 2) return 'At Risk';
  return 'Critical';
};

const getHealthColor = (score) => {
  if (score >= 4) return 'green';
  if (score >= 3) return 'yellow';
  if (score >= 2) return 'orange';
  return 'red';
};

export const getHealthIcon = (score) => {
  const icons = {
    5: '●●●●●',
    4: '●●●●○',
    3: '●●●○○',
    2: '●●○○○',
    1: '●○○○○'
  };
  return icons[score] || '○○○○○';
};

export const getUrgentActions = (patients, riskTickets, deferralTickets) => {
  const actions = [];
  
  patients.forEach(patient => {
    // Active risks
    if (patient.lastRiskStage === 'Active') {
      const ticket = riskTickets.find(r => 
        r.patientId === patient.id && r.stage === 'Active'
      );
      
      const daysSinceAttempt = ticket?.mitigationAttempted 
        ? Math.floor((new Date() - new Date(ticket.mitigationAttempted)) / (1000 * 60 * 60 * 24))
        : 999;
      
      actions.push({
        type: 'risk',
        priority: daysSinceAttempt > 3 ? 'critical' : 'high',
        patient,
        message: `Active ${patient.lastRiskType} Risk`,
        detail: `Last contact: ${daysSinceAttempt > 10 ? '10+ days ago' : daysSinceAttempt + ' days ago'}`,
        action: 'Take Action',
        link: `/patient/${patient.id}?tab=risk`
      });
    }
    
    // Active deferrals with upcoming return
    if (patient.lastDeferralStage === 'Active') {
      const ticket = deferralTickets.find(d => 
        d.patientId === patient.id && d.stage === 'Active'
      );
      
      actions.push({
        type: 'deferral',
        priority: 'medium',
        patient,
        message: `Active Deferral (${patient.lastDeferralCategory})`,
        detail: ticket?.notes?.includes('Nov 15') ? 'Return date: Nov 15' : 'Return date TBD',
        action: 'Schedule Return',
        link: `/patient/${patient.id}?tab=deferral`
      });
    }
    
    // Kit not delivered (7+ days)
    if (patient.outboundShipped && !patient.outboundDelivered) {
      const daysSinceShipped = Math.floor((new Date() - new Date(patient.outboundShipped)) / (1000 * 60 * 60 * 24));
      
      if (daysSinceShipped > 7) {
        actions.push({
          type: 'kit',
          priority: 'high',
          patient,
          message: 'Kit Not Delivered',
          detail: `${daysSinceShipped} days since shipped`,
          action: 'Track Shipment',
          link: `/patient/${patient.id}?tab=kit`
        });
      }
    }
    
    // Unpaid maintenance
    if (patient.maintenanceStage === 'Active' && patient.maintenancePayments) {
      const unpaid = patient.maintenancePayments.filter(p => !p.paid);
      if (unpaid.length > 0) {
        actions.push({
          type: 'payment',
          priority: 'high',
          patient,
          message: `${unpaid.length} Unpaid Payment(s)`,
          detail: `Month ${unpaid[0].month} - $${unpaid[0].amount}`,
          action: 'Send Reminder',
          link: `/patient/${patient.id}?tab=maintenance`
        });
      }
    }
    
    // Low attendance (Program stage)
    if (patient.programStage === 'Active') {
      const liveAttendance = parseInt(patient.liveSessionAttendance) || 0;
      const soloAttendance = parseInt(patient.soloSessionAttendance) || 0;
      const avgAttendance = (liveAttendance + soloAttendance) / 2;
      
      if (avgAttendance < 50 && !patient.lastRiskStage) {
        actions.push({
          type: 'attendance',
          priority: 'medium',
          patient,
          message: 'Low Attendance',
          detail: `Average: ${avgAttendance.toFixed(0)}%`,
          action: 'Create Risk Ticket',
          link: `/patient/${patient.id}?tab=program`
        });
      }
    }
  });
  
  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

export const getUpcomingEvents = (patients, cohorts) => {
  const events = [];
  
  // Patients completing soon
  patients.forEach(patient => {
    if (patient.programStage === 'Active') {
      const attended = patient.liveSessionsAttended || 0;
      const available = patient.liveSessionsAvailable || 18;
      const remaining = available - attended;
      
      if (remaining <= 3 && remaining > 0) {
        events.push({
          type: 'completion',
          date: 'This week',
          message: `${patient.name} completing program`,
          detail: `${remaining} sessions remaining`
        });
      }
    }
    
    // Kits to be returned
    if (patient.kitStage === 'Delivered' && patient.programStage === 'Completed') {
      events.push({
        type: 'kit_return',
        date: 'Pending',
        message: `${patient.name} - Kit return needed`,
        detail: patient.kitId
      });
    }
    
    // Upcoming payments
    if (patient.maintenanceStage === 'Active' && patient.maintenancePayments) {
      const nextUnpaid = patient.maintenancePayments.find(p => !p.paid);
      if (nextUnpaid) {
        events.push({
          type: 'payment',
          date: nextUnpaid.started,
          message: `Payment due - ${patient.name}`,
          detail: `$${nextUnpaid.amount}`
        });
      }
    }
  });
  
  return events;
};

