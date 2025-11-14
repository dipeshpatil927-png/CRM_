import React, { useState, useRef, useEffect } from 'react';
import { Lead, User, LeadStage, Integrations, Activity, ActivityType, ActivityChannel } from '../types';
import LeadTable from './LeadTable';
import KanbanView from './KanbanView';
import { Icon } from './icons';
import AddLeadModal from './AddLeadModal';
import UploadLeadsModal from './UploadLeadsModal';
import BulkMessageModal from './BulkMessageModal';
import IntegrationPromptModal from './IntegrationPromptModal';

// Modal for Bulk Stage Change
const BulkChangeStageModal: React.FC<{
    selectedCount: number;
    onClose: () => void;
    onConfirm: (newStage: LeadStage) => void;
}> = ({ selectedCount, onClose, onConfirm }) => {
    const [newStage, setNewStage] = useState<LeadStage>(LeadStage.New);

    const handleConfirm = () => {
        onConfirm(newStage);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Stage for Leads</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="X" className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">Change stage for <span className="font-bold">{selectedCount}</span> selected lead(s).</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Stage</label>
                        <select value={newStage} onChange={(e) => setNewStage(e.target.value as LeadStage)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {Object.values(LeadStage).map(stage => <option key={stage} value={stage}>{stage}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-2 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">Confirm</button>
                </div>
            </div>
        </div>
    );
};

// Modal for Bulk Add Activity
const BulkAddActivityModal: React.FC<{
    selectedCount: number;
    onClose: () => void;
    onAddActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}> = ({ selectedCount, onClose, onAddActivity }) => {
    const [activityType, setActivityType] = useState<ActivityType>(ActivityType.Note);
    const [activityText, setActivityText] = useState('');
    const [reminderChannel, setReminderChannel] = useState<ActivityChannel>(ActivityChannel.Call);
    const [reminderDate, setReminderDate] = useState('');

    const handleAddActivity = () => {
        if (!activityText.trim()) return;
        const newActivity: Omit<Activity, 'id' | 'timestamp'> = {
            type: activityType,
            text: activityText,
        };
        if (activityType === ActivityType.Reminder) {
            newActivity.channel = reminderChannel;
            newActivity.reminderDate = reminderDate ? new Date(reminderDate).toISOString() : undefined;
        }
        onAddActivity(newActivity);
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                 <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Activity to {selectedCount} Leads</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="X" className="w-5 h-5" /></button>
                </div>
                 <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <button onClick={() => setActivityType(ActivityType.Note)} className={`px-3 py-1 text-sm rounded-full ${activityType === ActivityType.Note ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Note</button>
                        <button onClick={() => setActivityType(ActivityType.Reminder)} className={`px-3 py-1 text-sm rounded-full ${activityType === ActivityType.Reminder ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Reminder</button>
                    </div>
                    <textarea value={activityText} onChange={(e) => setActivityText(e.target.value)} placeholder={activityType === ActivityType.Note ? 'Add a note...' : 'Set a reminder...'} rows={3} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    {activityType === ActivityType.Reminder && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <select value={reminderChannel} onChange={(e) => setReminderChannel(e.target.value as ActivityChannel)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {Object.values(ActivityChannel).map(ch => <option key={ch} value={ch}>{ch}</option>)}
                            </select>
                            <input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    )}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end space-x-2 rounded-b-lg">
                     <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleAddActivity} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-400" disabled={!activityText.trim()}>Add Activity</button>
                </div>
            </div>
         </div>
    );
};

interface LeadsPageProps {
  leads: Lead[];
  users: User[];
  integrations: Integrations;
  updateLeadStage: (leadId: number, newStage: LeadStage) => void;
  addLead: (leadData: Omit<Lead, 'id' | 'assignedTo' | 'lastContacted' | 'activities'> & { assignedToId: number }) => void;
  deleteLeads: (leadIds: number[]) => void;
  onUpdateLead: (lead: Lead) => void;
  setActiveView: (view: string) => void;
  onAddActivity: (leadId: number, activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  updateLeadsStage: (leadIds: number[], newStage: LeadStage) => void;
  addActivityToLeads: (leadIds: number[], activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const LeadsPage: React.FC<LeadsPageProps> = ({ leads, users, updateLeadStage, addLead, deleteLeads, integrations, onUpdateLead, setActiveView, onAddActivity, updateLeadsStage, addActivityToLeads }) => {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const [isBulkMessageModalOpen, setIsBulkMessageModalOpen] = useState(false);
  const [messagingPlatform, setMessagingPlatform] = useState<'WhatsApp' | 'LinkedIn' | null>(null);
  const [integrationPrompt, setIntegrationPrompt] = useState<{ isOpen: boolean; platform: 'WhatsApp' | 'LinkedIn' | null }>({ isOpen: false, platform: null });
  const [isChangeStageModalOpen, setIsChangeStageModalOpen] = useState(false);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.size} lead(s)?`)) {
        deleteLeads(Array.from(selectedLeads));
        setSelectedLeads(new Set());
    }
    setIsActionsMenuOpen(false);
  }

  const handleBulkMessage = (platform: 'WhatsApp' | 'LinkedIn') => {
    const isConnected = platform.toLowerCase() === 'whatsapp' ? integrations.whatsapp : integrations.linkedin;
    if (!isConnected) {
        setIntegrationPrompt({ isOpen: true, platform });
        return;
    }
    setMessagingPlatform(platform);
    setIsBulkMessageModalOpen(true);
    setIsActionsMenuOpen(false);
  }
  
  const handleBulkChangeStage = (newStage: LeadStage) => {
    updateLeadsStage(Array.from(selectedLeads), newStage);
    setSelectedLeads(new Set());
  };
  
  const handleBulkAddActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    addActivityToLeads(Array.from(selectedLeads), activity);
    setSelectedLeads(new Set());
  };
  
  const handleSendPersonalizedMessages = (messageTemplate: string) => {
    const selectedLeadDetails = leads.filter(lead => selectedLeads.has(lead.id));
    // Simulate sending
    selectedLeadDetails.forEach(lead => {
      const personalizedMessage = messageTemplate
        .replace(/{{contactPerson}}/g, lead.contactPerson)
        .replace(/{{companyName}}/g, lead.companyName);
      console.log(`Sending to ${lead.email} via ${messagingPlatform}: "${personalizedMessage}"`);
    });
    alert(`Personalized messages have been sent to ${selectedLeads.size} lead(s) via ${messagingPlatform}. Check the console for details.`);
    setIsBulkMessageModalOpen(false);
    setMessagingPlatform(null);
  };

  const handleGoToSettings = () => {
    setIntegrationPrompt({ isOpen: false, platform: null });
    setActiveView('Settings');
  };

  const handleCSVUpload = (parsedLeads: Omit<Lead, 'id' | 'assignedTo' | 'lastContacted' | 'stage' | 'activities'>[]) => {
     parsedLeads.forEach(leadData => {
       addLead({
         ...leadData,
         stage: LeadStage.New, // Default stage for uploaded leads
         assignedToId: users[0]?.id || 1, // Default assignment
       });
     });
     setIsUploadModalOpen(false);
     alert(`${parsedLeads.length} leads successfully uploaded!`);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Leads</h2>
        <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <button
                    onClick={() => setView('table')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    view === 'table' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-300'
                    }`}
                    aria-pressed={view === 'table'}
                >
                    <Icon name="List" className="w-5 h-5 inline-block sm:mr-2" />
                    <span className="hidden sm:inline">Table</span>
                </button>
                <button
                    onClick={() => setView('kanban')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    view === 'kanban' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-300'
                    }`}
                    aria-pressed={view === 'kanban'}
                >
                    <Icon name="LayoutGrid" className="w-5 h-5 inline-block sm:mr-2" />
                    <span className="hidden sm:inline">Kanban</span>
                </button>
            </div>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center" onClick={() => setIsUploadModalOpen(true)}>
                <Icon name="Upload" className="w-4 h-4 mr-2" /> Upload
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center" onClick={() => setIsAddModalOpen(true)}>
                <Icon name="PlusCircle" className="w-5 h-5 mr-2" /> Add Lead
            </button>
        </div>
      </div>
      
      {view === 'table' ? (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Manage Your Leads</h3>
                {selectedLeads.size > 0 && (
                    <div className="relative" ref={actionsMenuRef}>
                        <button onClick={() => setIsActionsMenuOpen(prev => !prev)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center">
                            Actions ({selectedLeads.size}) <Icon name="ChevronDown" className="w-4 h-4 ml-2" />
                        </button>
                        {isActionsMenuOpen && (
                             <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700">
                                <button onClick={() => {setIsChangeStageModalOpen(true); setIsActionsMenuOpen(false);}} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"><Icon name="TrendingUp" className="w-4 h-4 mr-2" />Change Stage</button>
                                <button onClick={() => {setIsAddActivityModalOpen(true); setIsActionsMenuOpen(false);}} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"><Icon name="PlusCircle" className="w-4 h-4 mr-2" />Add Activity</button>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <button onClick={() => handleBulkMessage('WhatsApp')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"><Icon name="MessageSquare" className="w-4 h-4 mr-2"/>Send WhatsApp</button>
                                <button onClick={() => handleBulkMessage('LinkedIn')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"><Icon name="Link" className="w-4 h-4 mr-2"/>Send LinkedIn Msg</button>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <button onClick={handleBulkDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"><Icon name="Trash2" className="w-4 h-4 mr-2" />Delete Selected</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <LeadTable leads={leads} selectedLeads={selectedLeads} setSelectedLeads={setSelectedLeads} users={users} onUpdateLead={onUpdateLead} onAddActivity={onAddActivity} />
        </div>
      ) : (
        <KanbanView leads={leads} updateLeadStage={updateLeadStage} users={users} onUpdateLead={onUpdateLead} onAddActivity={onAddActivity} />
      )}
      {isAddModalOpen && <AddLeadModal users={users} onClose={() => setIsAddModalOpen(false)} onAddLead={addLead} />}
      {isUploadModalOpen && <UploadLeadsModal onClose={() => setIsUploadModalOpen(false)} onUpload={handleCSVUpload} />}
      {isBulkMessageModalOpen && messagingPlatform && (
        <BulkMessageModal 
          platform={messagingPlatform}
          selectedCount={selectedLeads.size}
          onClose={() => setIsBulkMessageModalOpen(false)}
          onSend={handleSendPersonalizedMessages}
        />
      )}
      {integrationPrompt.isOpen && integrationPrompt.platform && (
        <IntegrationPromptModal
            platform={integrationPrompt.platform}
            onClose={() => setIntegrationPrompt({ isOpen: false, platform: null })}
            onGoToSettings={handleGoToSettings}
        />
      )}
      {isChangeStageModalOpen && (
        <BulkChangeStageModal 
            selectedCount={selectedLeads.size}
            onClose={() => setIsChangeStageModalOpen(false)}
            onConfirm={handleBulkChangeStage}
        />
      )}
      {isAddActivityModalOpen && (
        <BulkAddActivityModal
            selectedCount={selectedLeads.size}
            onClose={() => setIsAddActivityModalOpen(false)}
            onAddActivity={handleBulkAddActivity}
        />
      )}
    </div>
  );
};

export default LeadsPage;