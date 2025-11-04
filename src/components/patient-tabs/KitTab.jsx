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
  
  // Calculate days since shipped
  const getDaysSinceShipped = () => {
    if (!patient.outboundShipped) return null;
    const shipped = new Date(patient.outboundShipped);
    const now = new Date();
    return Math.floor((now - shipped) / (1000 * 60 * 60 * 24));
  };
  
  const daysSinceShipped = getDaysSinceShipped();
  const isDelayed = patient.outboundShipped && !patient.outboundDelivered && daysSinceShipped > 7;
  
  return (
    <div className="space-y-6">
      {/* Kit Status Overview with Alert */}
      <div className="flex items-center justify-between p-4 bg-corporate-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-primary-600" />
          <div>
            <div className="text-sm text-corporate-600">Kit Status</div>
            <div className="text-xl font-bold text-corporate-900">{patient.kitStage}</div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg font-medium ${getStatusColor(patient.kitStage)}`}>
          {patient.kitLocation}
        </div>
      </div>
      
      {/* Delivery Alert */}
      {isDelayed && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-red-900">Kit Not Delivered</div>
              <div className="text-sm text-red-700 mt-1">
                {daysSinceShipped} days since shipped (expected: 3-5 days)
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <button className="btn-primary text-sm py-1">Track Shipment</button>
                <button className="btn-secondary text-sm py-1">Contact Patient</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tracking Information */}
      {patient.outboundShipped && !patient.outboundDelivered && (
        <div className="card bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-blue-900">Shipment Tracking</div>
            <button className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 text-sm">
              <ExternalLink className="w-4 h-4" />
              <span>Track with UPS</span>
            </button>
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-700">Tracking Number:</span>
              <span className="font-mono text-blue-900">1Z999AA10123456784</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Expected Delivery:</span>
              <span className="text-blue-900 font-medium">Tomorrow</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Current Location:</span>
              <span className="text-blue-900">In Transit - Phoenix, AZ</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Kit Information */}
      <div>
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Kit Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Kit ID</label>
            <input
              type="text"
              value={patient.kitId || 'N/A'}
              className="input-readonly"
              readOnly
            />
          </div>
          <div>
            <label className="label">Kit Stage</label>
            <input
              type="text"
              value={patient.kitStage || 'N/A'}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Kit Time</label>
            <input
              type="date"
              value={patient.kitTime || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Kit Location</label>
            {isEditing ? (
              <select className="input-field" defaultValue={patient.kitLocation || ''}>
                <option value="">Select location...</option>
                {kitLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={patient.kitLocation || 'N/A'}
                className="input-readonly"
                readOnly
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Outbound Shipping */}
      <div className="border-t border-corporate-200 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <TruckIcon className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-corporate-900">Outbound Shipping</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="label">Outbound Shipped Date</label>
            <input
              type="date"
              value={patient.outboundShipped || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="label">Outbound Delivered Date</label>
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
      <div className="border-t border-corporate-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-corporate-900">Inbound Return</h3>
          </div>
          {patient.programStage === 'Completed' && !patient.inboundRequestAttempted && (
            <button className="btn-primary text-sm">Schedule Return</button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Inbound Request Attempted</label>
            <input
              type="date"
              value={patient.inboundRequestAttempted || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
              placeholder="Not requested"
            />
          </div>
          <div>
            <label className="label">Inbound Shipped Date</label>
            <input
              type="date"
              value={patient.inboundShipped || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
              placeholder="Not shipped"
            />
          </div>
          <div>
            <label className="label">Inbound Delivered Date</label>
            <input
              type="date"
              value={patient.inboundDelivered || ''}
              className={isEditing ? 'input-field' : 'input-readonly'}
              readOnly={!isEditing}
              placeholder="Not delivered"
            />
          </div>
        </div>
        
        {patient.kitStage === 'Delivered' && patient.programStage === 'Completed' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800 text-sm">
              <Package className="w-4 h-4" />
              <span className="font-medium">Kit return needed - program completed</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Timeline Visualization */}
      <div className="border-t border-corporate-200 pt-6">
        <h3 className="text-lg font-semibold text-corporate-900 mb-4">Kit Journey</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-corporate-200"></div>
          <div className="space-y-4">
            {patient.outboundShipped && (
              <div className="relative flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center z-10">
                  <TruckIcon className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-corporate-900">Outbound Shipped</div>
                  <div className="text-sm text-corporate-600">{patient.outboundShipped}</div>
                  <div className="text-xs text-corporate-500">From {patient.shippedFrom}</div>
                  {!patient.outboundDelivered && (
                    <div className="text-xs text-yellow-600 mt-1">In transit ({daysSinceShipped} days)</div>
                  )}
                </div>
              </div>
            )}
            {patient.outboundDelivered && (
              <div className="relative flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center z-10">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-corporate-900">Delivered to Patient</div>
                  <div className="text-sm text-corporate-600">{patient.outboundDelivered}</div>
                  <div className="text-xs text-green-600 mt-1">Active use</div>
                </div>
              </div>
            )}
            {patient.inboundRequestAttempted && (
              <div className="relative flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center z-10">
                  <Home className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-corporate-900">Return Requested</div>
                  <div className="text-sm text-corporate-600">{patient.inboundRequestAttempted}</div>
                </div>
              </div>
            )}
            {patient.inboundShipped && (
              <div className="relative flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center z-10">
                  <TruckIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-corporate-900">Return Shipped</div>
                  <div className="text-sm text-corporate-600">{patient.inboundShipped}</div>
                </div>
              </div>
            )}
            {patient.inboundDelivered && (
              <div className="relative flex items-start space-x-4">
                <div className="w-8 h-8 bg-corporate-200 rounded-full flex items-center justify-center z-10">
                  <Package className="w-4 h-4 text-corporate-600" />
                </div>
                <div>
                  <div className="font-medium text-corporate-900">Returned to Warehouse</div>
                  <div className="text-sm text-corporate-600">{patient.inboundDelivered}</div>
                  <div className="text-xs text-corporate-500 mt-1">Kit available for reassignment</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

