
import React, { useState } from 'react';
import { Lead, User, Activity } from '../types';
import LeadDetailModal from './LeadDetailModal';

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  users: User[];
  onUpdateLead: (lead: Lead) => void;
  onAddActivity: (leadId: number, activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onDragStart, onDragEnd, isDragging, users, onUpdateLead, onAddActivity }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={() => setIsModalOpen(true)}
        className={`bg-white dark:bg-gray-700 rounded-md p-4 shadow-sm cursor-pointer border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all ${isDragging ? 'opacity-50 ring-2 ring-blue-500 scale-105 shadow-xl' : ''}`}
      >
        <h4 className="font-semibold text-sm text-gray-800 dark:text-white">{lead.companyName}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{lead.contactPerson}</p>
        <p className="text-sm font-bold text-green-600 dark:text-green-400">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(lead.value)}
        </p>
        <div className="flex items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
           <img className="h-6 w-6 rounded-full" src={lead.assignedTo.avatarUrl} alt={lead.assignedTo.name} title={lead.assignedTo.name} />
           <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{lead.assignedTo.name}</span>
        </div>
      </div>
      {isModalOpen && <LeadDetailModal lead={lead} onClose={() => setIsModalOpen(false)} users={users} onUpdateLead={onUpdateLead} onAddActivity={onAddActivity} />}
    </>
  );
};

export default LeadCard;