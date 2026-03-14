import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

// Function to generate a colored SVG map pin using Leaflet DivIcon
const getStatusColorInfo = (status: string) => {
  const s = (status || '').toUpperCase();
  if (['APPROVED'].includes(s)) return { hex: '#10b981', tw: 'bg-emerald-500' }; // Green
  if (['REJECTED'].includes(s)) return { hex: '#ef4444', tw: 'bg-red-500' }; // Red
  return { hex: '#f59e0b', tw: 'bg-amber-500' }; // Orange (Review, Hold, etc)
};
const createColoredIcon = (status: string) => {
  const { hex } = getStatusColorInfo(status);
  
  const markerHtmlStyles = `
    background-color: ${hex};
    width: 24px;
    height: 24px;
    display: block;
    left: -12px;
    top: -12px;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 2px solid #FFFFFF;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  `;
  
  return L.divIcon({
    className: 'custom-pin-icon',
    iconAnchor: [0, 24],
    popupAnchor: [0, -26],
    html: `<span style="${markerHtmlStyles}" />`
  });
};

export default function ProposalMapVisualization({ className, proposals = [], role = 'central', showListOverlay = false }: ProposalMapVisualizationProps) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-inner ${className || 'h-[500px] w-full'}`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        style={{ width: '100%', height: '100%' }}
      >
        {/* Using standard open-source map tiles instead of Google Maps */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {proposals.map((proposal) => {
          const key = proposal.id || proposal._id || Math.random().toString();
          const lat = Number(proposal?.coordinates?.latitude);
          const lng = Number(proposal?.coordinates?.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            return (
              <Marker
                key={key}
                position={[lat, lng]}
                icon={createColoredIcon(proposal.status)}
              >
                <Popup className="proposal-popup">
                  <div className="font-sans min-w-[200px] p-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm text-slate-800 leading-tight pr-4">{proposal.projectName || 'Proposal'}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                        proposal.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 
                        proposal.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {proposal.status || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <p className="text-[11px] text-slate-500 flex justify-between border-b border-slate-100 pb-1">
                        <span>ID:</span> <span className="font-mono text-slate-700">{proposal.id}</span>
                      </p>
                      {proposal.companyName && (
                        <p className="text-[11px] text-slate-500 flex justify-between border-b border-slate-100 pb-1">
                          <span>Applicant:</span> <span className="text-slate-700 truncate max-w-[120px]" title={proposal.companyName}>{proposal.companyName}</span>
                        </p>
                      )}
                    </div>
                    
                    <Link 
                      to={`/${role}/applications/${proposal.id}`} 
                      className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-1.5 rounded transition-colors shadow-sm"
                    >
                      View Full Details &rarr;
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
      
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
