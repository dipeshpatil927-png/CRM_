
import React, { useState } from 'react';
import { Lead, LeadStage, User, Activity } from '../types';
import LeadCard from './LeadCard';

interface KanbanViewProps {
  leads: Lead[];
  users: User[];
  updateLeadStage: (leadId: number, newStage: LeadStage) => void;
  onUpdateLead: (lead: Lead) => void;
  onAddActivity: (leadId: number, activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const STAGE_COLORS: Record<LeadStage, string> = {
  [LeadStage.New]: 'border-t-blue-500',
  [LeadStage.Contacted]: 'border-t-yellow-500',
  [LeadStage.MeetingScheduled]: 'border-t-purple-500',
  [LeadStage.ProposalSent]: 'border-t-orange-500',
  [LeadStage.Won]: 'border-t-green-500',
  [LeadStage.Lost]: 'border-t-red-500',
};

const KanbanView: React.FC<KanbanViewProps> = ({ leads, updateLeadStage, users, onUpdateLead, onAddActivity }) => {
  const [draggedLeadId, setDraggedLeadId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', leadId.toString());
    setDraggedLeadId(leadId);
  };
  
  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverStage(null);
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stage: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };
  
  const handleDragLeave = () => {
    setDragOverStage(null);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, stage: LeadStage) => {
    e.preventDefault();
    const leadIdStr = e.dataTransfer.getData('text/plain');
    if (!leadIdStr) {
      setDragOverStage(null);
      return;
    }
    const leadId = parseInt(leadIdStr, 10);
    if (leadId) {
      updateLeadStage(leadId, stage);
    }
    setDragOverStage(null);
  };

  const leadsByStage = Object.values(LeadStage).reduce((acc, stage) => {
    acc[stage] = leads.filter(lead => lead.stage === stage);
    return acc;
  }, {} as Record<LeadStage, Lead[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
      {Object.values(LeadStage).map((stage) => (
        <div
          key={stage}
          onDragOver={(e) => handleDragOver(e, stage)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, stage)}
          className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-3 transition-colors duration-200 min-h-[200px] ${dragOverStage === stage ? 'bg-blue-100 dark:bg-gray-900 ring-2 ring-blue-500 ring-dashed' : ''}`}
        >
          <h3 className={`font-semibold text-gray-700 dark:text-gray-200 mb-3 p-2 border-t-4 ${STAGE_COLORS[stage]} rounded-t-sm`}>
            {stage} ({leadsByStage[stage].length})
          </h3>
          <div className="space-y-3 min-h-[100px]">
            {leadsByStage[stage].map(lead => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onDragStart={(e) => handleDragStart(e, lead.id)}
                onDragEnd={handleDragEnd}
                isDragging={draggedLeadId === lead.id}
                users={users}
                onUpdateLead={onUpdateLead}
                onAddActivity={onAddActivity}
               />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;