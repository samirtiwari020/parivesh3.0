import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Default center coordinates set to India
const defaultCenter: [number, number] = [20.5937, 78.9629];

interface ProposalMapVisualizationProps {
  className?: string; 
  proposals?: any[]; 
  role?: 'central' | 'state'; // Pass role to know where to route
  showListOverlay?: boolean;
}

// Function to get marker color based on status
const getMarkerColor = (status: string) => {
  const s = (status || '').toUpperCase();
  if (s === 'APPROVED') return '#10b981'; // Green
  if (s === 'REJECTED') return '#ef4444'; // Red
  if (['UNDER_SCRUTINY', 'UNDER REVIEW', 'IN_MEETING', 'REFERRED_TO_MEETING', 'COMMITTEE', 'CENTRAL', 'STATE'].includes(s)) {
    return '#f59e0b'; // Yellow/Amber
  }
  return '#6b7280'; // Default gray
};

const getStatusColorInfo = (status: string) => {
  const color = getMarkerColor(status);
  if (color === '#10b981') return { hex: color, tw: 'bg-emerald-500' };
  if (color === '#ef4444') return { hex: color, tw: 'bg-red-500' };
  if (color === '#f59e0b') return { hex: color, tw: 'bg-amber-500' };
  return { hex: color, tw: 'bg-slate-500' };
};

export default function ProposalMapVisualization({ className, proposals = [], role = 'central', showListOverlay = false }: ProposalMapVisualizationProps) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-inner ${className || 'h-[500px] w-full'}`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {proposals.map((proposal) => {
          const key = proposal.id || proposal._id || Math.random().toString();
          const lat = Number(proposal?.coordinates?.latitude || proposal?.latitude);
          const lng = Number(proposal?.coordinates?.longitude || proposal?.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            const color = getMarkerColor(proposal.status);
            
            return (
              <CircleMarker
                key={key}
                center={[lat, lng]}
                radius={8}
                fillColor={color}
                color="#333"
                weight={1}
                opacity={1}
                fillOpacity={0.8}
              >
                <Popup className="proposal-popup">
                  <div className="font-sans min-w-[220px] p-1">
                    <div className="flex flex-col gap-1 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Name</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${getStatusColorInfo(proposal.status).tw}`} />
                          <span className={`text-[10px] font-bold tracking-wide uppercase ${
                            proposal.status?.toUpperCase() === 'APPROVED' ? 'text-emerald-700' : 
                            proposal.status?.toUpperCase() === 'REJECTED' ? 'text-red-700' : 
                            'text-amber-700'
                          }`}>
                            {proposal.status?.replace(/_/g, ' ') || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 leading-tight">{proposal.projectName || 'Proposal'}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                        <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                          {proposal.sector || proposal.clearanceType || 'General'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                        <span className="text-[11px] font-semibold text-slate-700 leading-tight truncate" title={proposal.state}>
                          {proposal.district ? `${proposal.district}, ` : ''}{proposal.state || 'India'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-400 uppercase">Proposal ID</span>
                        <span className="font-mono text-slate-600 font-bold">{(proposal.id || proposal._id)?.toString().toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/${role}/applications/${proposal.id || proposal._id}`} 
                      className="group flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-emerald-600 text-white text-[11px] font-bold py-2.5 rounded-xl transition-all shadow-md hover:shadow-emerald-900/20 active:scale-[0.98]"
                    >
                      View Full Details
                      <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            );
          }
          return null;
        })}
      </MapContainer>

      {/* Legend Box */}
      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white shadow-xl z-[1000] flex flex-col gap-2 min-w-[160px]">
        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Legend</h5>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
          <span className="text-xs font-bold text-slate-700">Approved Projects</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/20" />
          <span className="text-xs font-bold text-slate-700">Under Review</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/20" />
          <span className="text-xs font-bold text-slate-700">Rejected Projects</span>
        </div>
      </div>


      
      {/* Optional Overlay List */}
      {showListOverlay && proposals.length > 0 && (
        <div className="absolute top-4 right-4 bottom-4 w-72 md:w-80 bg-white/80 backdrop-blur-2xl border border-white rounded-2xl shadow-2xl z-[1000] overflow-hidden flex flex-col pointer-events-auto transition-all">
          <div className="p-4 border-b border-white bg-gradient-to-r from-emerald-50/80 to-teal-50/80 shadow-sm shrink-0">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              Application List
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{proposals.length} active proposals mapped</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 relative" style={{ scrollbarWidth: 'thin' }}>
            {proposals.map(proposal => {
              const colorInfo = getStatusColorInfo(proposal.status);
              return (
                <div key={proposal.id} className="group p-3 rounded-xl bg-white/60 border border-white hover:bg-white hover:shadow-lg hover:shadow-emerald-900/5 transition-all w-full text-left relative overflow-hidden flex flex-col gap-1">
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${colorInfo.tw}`} />
                  <div className="flex justify-between items-start gap-2 pl-2">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                      {proposal.projectName || 'Proposal'}
                    </h4>
                    <span className={`w-3 h-3 rounded-full shrink-0 shadow-sm border border-white mt-0.5 ${colorInfo.tw}`} title={proposal.status} />
                  </div>
                  <div className="pl-2 mt-1 flex justify-between items-center w-full">
                     <div className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold tracking-wider">
                       {proposal.id.substring(proposal.id.length - 6).toUpperCase()}
                     </div>
                     <Link to={`/${role}/applications/${proposal.id}`} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
                       Review \u2192
                     </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
