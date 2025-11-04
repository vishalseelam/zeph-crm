export default function InformationTab({ patient, isEditing }) {
  const fields = [
    { label: 'Patient ID', value: patient.id, readonly: true },
    { label: 'MRN', value: patient.mrn, readonly: true },
    { label: 'Patient Name', value: patient.name, readonly: false },
    { label: 'State', value: patient.state, readonly: false },
    { label: 'Clinic ID', value: patient.clinicId, readonly: false },
    { label: 'Source', value: patient.source, readonly: true },
    { label: 'Current Stage', value: patient.currentStage, readonly: true },
    { label: 'Current Sub-Stage', value: patient.currentSubStage, readonly: true },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.label}>
              <label className="label">{field.label}</label>
              <input
                type="text"
                value={field.value || 'N/A'}
                className={field.readonly || !isEditing ? 'input-readonly' : 'input-field'}
                readOnly={field.readonly || !isEditing}
              />
              {field.readonly && (
                <p className="text-xs text-corporate-500 mt-1">Read-only field</p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-corporate-200 pt-6">
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Latest Risk Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Last Risk Stage</label>
            <input
              type="text"
              value={patient.lastRiskStage || 'None'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Last Risk Type</label>
            <input
              type="text"
              value={patient.lastRiskType || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Last Risk Triggered</label>
            <input
              type="date"
              value={patient.lastRiskTriggered || ''}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Last Risk Time</label>
            <input
              type="date"
              value={patient.lastRiskTime || ''}
              className="input-readonly"
              readOnly
            />
          </div>
        </div>
        <p className="text-xs text-corporate-500 mt-2">
          Risk information is read-only. Manage risks in the Risk Tickets tab.
        </p>
      </div>
      
      <div className="border-t border-corporate-200 pt-6">
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Latest Deferral Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Last Deferral Stage</label>
            <input
              type="text"
              value={patient.lastDeferralStage || 'None'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Last Deferral Category</label>
            <input
              type="text"
              value={patient.lastDeferralCategory || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Last Deferral Initiated</label>
            <input
              type="date"
              value={patient.lastDeferralInitiated || ''}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Last Deferral Ended</label>
            <input
              type="date"
              value={patient.lastDeferralEnded || ''}
              className="input-readonly"
              readOnly
            />
          </div>
        </div>
        <p className="text-xs text-corporate-500 mt-2">
          Deferral information is read-only. Manage deferrals in the Deferral Tickets tab.
        </p>
      </div>
    </div>
  );
}


