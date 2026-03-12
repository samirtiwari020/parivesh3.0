import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, MapPin, Building, Calendar } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import StatusTimeline from '@/components/dashboard/StatusTimeline';
import { mockApplications } from '@/data/mockData';

export default function ProposalDetails() {
  const { id } = useParams();
  const app = mockApplications.find(a => a.id === id) || mockApplications[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/app/applications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} /> Back to Applications
      </Link>

      <div className="gov-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-2">{app.projectName}</h1>
            <p className="text-sm text-muted-foreground tabular-data">Proposal ID: {app.id}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <Building size={18} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Proponent</p>
              <p className="text-sm font-medium">{app.proponent}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <MapPin size={18} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">State</p>
              <p className="text-sm font-medium">{app.state}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <Calendar size={18} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="text-sm font-medium tabular-data">{app.submissionDate}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <div className="space-y-3">
              {[
                ['Clearance Type', app.clearanceType],
                ['Sector', app.sector],
                ['Estimated Cost', app.estimatedCost],
                ['Category', 'Category A'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold mt-8 mb-4">Documents</h2>
            <div className="space-y-2">
              {['EIA Report.pdf', 'Project Map.pdf', 'Compliance Certificate.pdf'].map(doc => (
                <div key={doc} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">{doc}</span>
                  <button className="text-primary hover:text-primary/80 transition-colors"><Download size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
            <StatusTimeline currentStatus={app.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
