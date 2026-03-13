import { CheckCircle2, Circle, Clock } from 'lucide-react';
import type { ApplicationStatus } from '@/types';

interface TimelineProps {
  currentStatus: ApplicationStatus;
}

const stages = ['Submitted', 'Under Review', 'Committee Review', 'Recommended', 'Approved'];

function getStageState(stageIndex: number, currentStatus: ApplicationStatus) {
  if (currentStatus === 'Rejected') {
    if (stageIndex === 0) return 'completed';
    return 'inactive';
  }
  const currentIndex = stages.indexOf(currentStatus);
  if (currentIndex === -1) return 'inactive';
  if (stageIndex < currentIndex) return 'completed';
  if (stageIndex === currentIndex) return 'current';
  return 'inactive';
}

export default function StatusTimeline({ currentStatus }: TimelineProps) {
  const displayStages = currentStatus === 'Rejected'
    ? [...stages.slice(0, stages.indexOf('Recommended') + 1), 'Rejected']
    : stages;

  return (
    <div className="flex flex-col gap-0">
      {displayStages.map((stage, i) => {
        const state = currentStatus === 'Rejected' && stage === 'Rejected'
          ? 'rejected'
          : getStageState(i, currentStatus);

        return (
          <div key={stage} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              {state === 'completed' && <CheckCircle2 size={22} className="text-accent" />}
              {state === 'current' && <Clock size={22} className="text-status-review" />}
              {state === 'inactive' && <Circle size={22} className="text-muted-foreground/30" />}
              {state === 'rejected' && <Circle size={22} className="text-destructive" />}
              {i < displayStages.length - 1 && (
                <div className={`w-0.5 h-8 ${state === 'completed' ? 'bg-accent' : 'bg-border'}`} />
              )}
            </div>
            <div className="pb-8">
              <p className={`text-sm font-medium ${
                state === 'completed' ? 'text-foreground'
                : state === 'current' ? 'text-status-review'
                : state === 'rejected' ? 'text-destructive'
                : 'text-muted-foreground/50'
              }`}>
                {stage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
