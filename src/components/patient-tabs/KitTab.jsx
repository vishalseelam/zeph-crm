import { Package, TruckIcon, Home, AlertTriangle, ExternalLink } from 'lucide-react';
import { kitLocations } from '../../data';

export default function KitTab({ patient, isEditing }) {
  const getStatusColor = (stage) => {
    const colors = {
      'Delivered': 'text-green-600 bg-green-50',
      'In Transit': 'text-yellow-600 bg-yellow-50',
      'Returned': 'text-corporate-600 bg-corporate-100',
      'Pending': 'text-blue-600 bg-blue-50',
      'Delayed': 'text-red-600 bg-red-50',
    };
    return colors[stage] || 'text-corporate-600 bg-corporate-100';
  };
  
  const getDaysSinceShipped = () => {
    if (!patient.outboundShipped) return null;
    const shipped = new Date(patient.outboundShipped);
    const now = new Date();
    return Math.floor((now - shipped) / (1000 * 60 * 60 * 24));
  };
  
  const daysSinceShipped = getDaysSinceShipped();
  const isDelayed = patient.outboundShipped && !patient.outboundDelivered && daysSinceShipped > 7;
  
  return (
    <div className="space-y-4">
      {/* Kit Status Overview */}
      <div className="flex items-center justify-between p-3 bg-corporate-50 rounded">
        <div className="flex items-center space-x-3">
          <Package className="w-7 h-7 text-primary-600" />
          <div>
            <div className="text-xs text-corporate-600">Kit Status</div>
            <div className="text-lg font-bold text-corporate-900">{patient.kitStage}</div>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded font-medium text-sm ${getStatusColor(patient.kitStage)}`}>
          {patient.kitLocation}
        </div>
      </div>
      
      {/* Delivery Alert */}
      {isDelayed && (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-red-900 text-sm">Kit Not Delivered</div>
              <div className="text-sm text-red-700 mt-0.5">
                {daysSinceShipped} days since shipped (expected: 3-5 days)
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <button className="btn-primary text-xs py-1 px-2">Track Shipment</button>
                <button className="btn-secondary text-xs py-1 px-2">Contact Patient</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tracking Information */}
      {patient.outboundShipped && !patient.outboundDelivered && (
        <div className="card bg-blue-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-blue-900 text-sm">Shipment Tracking</div>
            <button className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 text-xs">
              <ExternalLink className="w-3 h-3" />
              <span>Track</span>
            </button>
          </div>
          <div className="text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-blue-700">Tracking #:</span>
              <span className="font-mono text-blue-900">1Z999AA10123456784</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Expected:</span>
              <span className="text-blue-900 font-medium">Tomorrow</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Kit Information - Matching Excel Layout */}
      <div>
        <h3 className="text-base font-semibold text-corporate-900 mb-3">Kit Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Row 1: Kit Stage (R), Kit Time (R) */}
          <div>
            <label className="label">Kit Stage</label>
            <input
              type="text"
              value={patient.kitStage || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Kit Time</label>
            <input
              type="date"
              value={patient.kitTime || ''}
              className="input-readonly"
              readOnly
            />
          </div>
          
          {/* Row 2: Kit Location (R), Kit ID (W) */}
          <div>
            <label className="label">Kit Location</label>
            <input
              type="text"
              value={patient.kitLocation || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Kit ID</label>
            <input
              type="text"
              value={patient.kitId || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
              placeholder={isEditing ? 'Enter Kit ID' : 'N/A'}
            />
          </div>
        </div>
      </div>
      
      {/* Outbound Shipping */}
      <div className="border-t border-corporate-200 pt-4">
        <div className="flex items-center space-x-2 mb-3">
          <TruckIcon className="w-5 h-5 text-primary-600" />
          <h3 className="text-base font-semibold text-corporate-900">Outbound Shipping</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Shipped From (W) */}
          <div>
            <label className="label">Shipped From</label>
            {isEditing ? (
              <select className="input-field" defaultValue={patient.shippedFrom || ''}>
                <option value="">Select warehouse...</option>
                <option value="IMPILO AZ">IMPILO AZ</option>
                <option value="IMPILO PA">IMPILO PA</option>
              </select>
            ) : (
              <input
                type="text"
                value={patient.shippedFrom || 'N/A'}
                className="input-readonly"
                readOnly
              />
            )}
          </div>
          
          {/* Outbound Shipped (W) */}
          <div>
            <label className="label">Outbound Shipped</label>
            <input
              type="date"
              value={patient.outboundShipped || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          
          {/* Outbound Delivered (W) */}
          <div>
            <label className="label">Outbound Delivered</label>
            <input
              type="date"
              value={patient.outboundDelivered || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
      
      {/* Inbound Shipping */}
      <div className="border-t border-corporate-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-primary-600" />
            <h3 className="text-base font-semibold text-corporate-900">Inbound Return</h3>
          </div>
          {isEditing && patient.programStage === 'Completed' && !patient.inboundRequestAttempted && (
            <button className="btn-primary text-xs py-1 px-2">Schedule Return</button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Inbound Request Attempted (W) */}
          <div>
            <label className="label">Inbound Request Attempted</label>
            <input
              type="date"
              value={patient.inboundRequestAttempted || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
              placeholder={isEditing ? 'Select date' : 'Not requested'}
            />
          </div>
          
          {/* Inbound Shipped (W) */}
          <div>
            <label className="label">Inbound Shipped</label>
            <input
              type="date"
              value={patient.inboundShipped || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
              placeholder={isEditing ? 'Select date' : 'Not shipped'}
            />
          </div>
          
          {/* Inbound Delivered (W) */}
          <div>
            <label className="label">Inbound Delivered</label>
            <input
              type="date"
              value={patient.inboundDelivered || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
              placeholder={isEditing ? 'Select date' : 'Not delivered'}
            />
          </div>
        </div>
        
        {patient.kitStage === 'Delivered' && patient.programStage === 'Completed' && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center space-x-2 text-yellow-800 text-xs">
              <Package className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Kit return needed - program completed</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Kit Journey Timeline */}
      <div className="border-t border-corporate-200 pt-4">
        <h3 className="text-base font-semibold text-corporate-900 mb-3">Kit Journey</h3>
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-corporate-200"></div>
          <div className="space-y-3">
            {patient.outboundShipped && (
              <div className="relative flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <TruckIcon className="w-3 h-3 text-primary-600" />
                </div>
                <div className="flex-1 pb-2">
                  <div className="font-medium text-corporate-900 text-sm">Outbound Shipped</div>
                  <div className="text-xs text-corporate-600">{patient.outboundShipped}</div>
                  <div className="text-xs text-corporate-500">From {patient.shippedFrom}</div>
                  {!patient.outboundDelivered && (
                    <div className="text-xs text-yellow-600 mt-0.5">In transit ({daysSinceShipped} days)</div>
                  )}
                </div>
              </div>
            )}
            {patient.outboundDelivered && (
              <div className="relative flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <Package className="w-3 h-3 text-green-600" />
                </div>
                <div className="pb-2">
                  <div className="font-medium text-corporate-900 text-sm">Delivered to Patient</div>
                  <div className="text-xs text-corporate-600">{patient.outboundDelivered}</div>
                  <div className="text-xs text-green-600 mt-0.5">Active use</div>
                </div>
              </div>
            )}
            {patient.inboundRequestAttempted && (
              <div className="relative flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <Home className="w-3 h-3 text-yellow-600" />
                </div>
                <div className="pb-2">
                  <div className="font-medium text-corporate-900 text-sm">Return Requested</div>
                  <div className="text-xs text-corporate-600">{patient.inboundRequestAttempted}</div>
                </div>
              </div>
            )}
            {patient.inboundShipped && (
              <div className="relative flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <TruckIcon className="w-3 h-3 text-blue-600" />
                </div>
                <div className="pb-2">
                  <div className="font-medium text-corporate-900 text-sm">Return Shipped</div>
                  <div className="text-xs text-corporate-600">{patient.inboundShipped}</div>
                </div>
              </div>
            )}
            {patient.inboundDelivered && (
              <div className="relative flex items-start space-x-3">
                <div className="w-6 h-6 bg-corporate-200 rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <Package className="w-3 h-3 text-corporate-600" />
                </div>
                <div>
                  <div className="font-medium text-corporate-900 text-sm">Returned to Warehouse</div>
                  <div className="text-xs text-corporate-600">{patient.inboundDelivered}</div>
                  <div className="text-xs text-corporate-500 mt-0.5">Kit available for reassignment</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

