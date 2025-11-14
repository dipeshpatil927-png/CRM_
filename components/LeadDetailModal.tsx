import React, { useState, useCallback, useEffect } from 'react';
import { Lead, User, LeadStage, Activity, ActivityType, ActivityChannel } from '../types';
import { Icon } from './icons';
import { summarizeLeadNotes } from '../services/geminiService';

interface LeadDetailModalProps {
    lead: Lead;
    onClose: () => void;
    users: User[];
    onUpdateLead: (lead: Lead) => void;
    onAddActivity: (leadId: number, activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, users, onUpdateLead, onAddActivity }) => {
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead>(lead);

  const [activityType, setActivityType] = useState<ActivityType>(ActivityType.Note);
  const [activityText, setActivityText] = useState('');
  const [reminderChannel, setReminderChannel] = useState<ActivityChannel>(ActivityChannel.Call);
  const [reminderDate, setReminderDate] = useState('');

  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  const handleGenerateSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    setError('');
    setAiSummary('');
    try {
      const summary = await summarizeLeadNotes(lead.notes);
      setAiSummary(summary);
    } catch (err) {
      setError('Failed to generate summary.');
      console.error(err);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [lead.notes]);
  
  const formattedSummary = aiSummary.split('*').map((item, index) => {
    if (!item.trim()) return null;
    return <li key={index} className="mb-1">{item.trim()}</li>;
  }).filter(Boolean);

  const handleSave = () => {
    onUpdateLead(editedLead);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLead(lead);
    setIsEditing(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'assignedTo') {
            const user = users.find(u => u.id === Number(value));
            if (user) {
                setEditedLead(prev => ({...prev, assignedTo: user}));
            }
        } else {
            setEditedLead(prev => ({ ...prev, [name]: name === 'value' ? Number(value) : value }));
        }
    };
    
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

    onAddActivity(lead.id, newActivity);
    
    // Reset form
    setActivityType(ActivityType.Note);
    setActivityText('');
    setReminderChannel(ActivityChannel.Call);
    setReminderDate('');
  };

  const activityIcon = (activity: Activity) => {
    if(activity.type === ActivityType.Reminder) {
        switch(activity.channel) {
            case ActivityChannel.Call: return <Icon name="PhoneCall" className="w-5 h-5 text-blue-500" />;
            case ActivityChannel.Email: return <Icon name="Mail" className="w-5 h-5 text-green-500" />;
            case ActivityChannel.WhatsApp: return <Icon name="MessageSquare" className="w-5 h-5 text-teal-500" />;
            case ActivityChannel.LinkedIn: return <Icon name="Link" className="w-5 h-5 text-indigo-500" />;
            default: return <Icon name="Clock" className="w-5 h-5 text-gray-500" />;
        }
    }
    return <Icon name="Edit3" className="w-5 h-5 text-gray-500" />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex justify-between items-center">
            {isEditing ? (
                <input type="text" name="companyName" value={editedLead.companyName} onChange={handleChange} className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white" />
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.companyName}</h2>
                    <p className="text-md text-gray-500 dark:text-gray-400">{lead.contactPerson}</p>
                </div>
            )}
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">Save</button>
                        <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center">Edit</button>
                )}
                <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Icon name="X" className="w-6 h-6" />
                </button>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Lead Details */}
              {isEditing ? (
                <div className="grid grid-cols-1 gap-4 text-sm">
                    <InputField label="Contact Person" name="contactPerson" value={editedLead.contactPerson} onChange={handleChange} />
                    <InputField label="Email" name="email" type="email" value={editedLead.email} onChange={handleChange} />
                    <InputField label="Phone" name="phone" value={editedLead.phone} onChange={handleChange} />
                    <InputField label="Source" name="source" value={editedLead.source} onChange={handleChange} />
                    <SelectField label="Stage" name="stage" value={editedLead.stage} onChange={handleChange} options={Object.values(LeadStage)} />
                    <InputField label="Value ($)" name="value" type="number" value={String(editedLead.value)} onChange={handleChange} />
                    <SelectField label="Assigned To" name="assignedTo" value={editedLead.assignedTo.id} onChange={handleChange} options={users.map(u => ({ value: u.id, label: u.name }))} />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex items-center"><Icon name="Mail" className="w-4 h-4 mr-2 text-gray-500"/> <span className="text-gray-500 dark:text-gray-400 font-medium mr-2">Email:</span> <span className="text-gray-800 dark:text-gray-200">{lead.email}</span></div>
                    <div className="flex items-center"><Icon name="Phone" className="w-4 h-4 mr-2 text-gray-500"/> <span className="text-gray-500 dark:text-gray-400 font-medium mr-2">Phone:</span> <span className="text-gray-800 dark:text-gray-200">{lead.phone}</span></div>
                    <div className="flex items-center"><Icon name="TrendingUp" className="w-4 h-4 mr-2 text-gray-500"/> <span className="text-gray-500 dark:text-gray-400 font-medium mr-2">Stage:</span> <span className="text-gray-800 dark:text-gray-200">{lead.stage}</span></div>
                    <div className="flex items-center"><Icon name="LogIn" className="w-4 h-4 mr-2 text-gray-500"/> <span className="text-gray-500 dark:text-gray-400 font-medium mr-2">Source:</span> <span className="text-gray-800 dark:text-gray-200">{lead.source}</span></div>
                    <div className="flex items-center col-span-1"><Icon name="User" className="w-4 h-4 mr-2 text-gray-500"/> <span className="text-gray-500 dark:text-gray-400 font-medium mr-2">Assigned To:</span> <span className="text-gray-800 dark:text-gray-200">{lead.assignedTo.name}</span></div>
                </div>
              )}
              
              {/* Notes Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Notes</h3>
                {isEditing ? (
                    <textarea name="notes" value={editedLead.notes} onChange={handleChange} rows={5} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                ) : (
                    <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-md whitespace-pre-wrap">{lead.notes}</p>
                )}
              </div>

              {/* AI Assistant */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                    <Icon name="Sparkles" className="w-5 h-5 mr-2 text-purple-500"/> AI Assistant
                 </h3>
                 <button
                    onClick={handleGenerateSummary}
                    disabled={isLoadingSummary}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition"
                  >
                    {isLoadingSummary ? <Icon name="Loader" className="w-5 h-5 animate-spin"/> : 'Generate Summary'}
                 </button>

                 {isLoadingSummary && <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Generating summary...</p>}
                 {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                 {aiSummary && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-md">
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                            {formattedSummary}
                        </ul>
                    </div>
                 )}
              </div>
            </div>

            {/* Right Column (Activity) */}
            <div className="space-y-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 mt-6 md:mt-0 pt-6 md:pt-0 md:pl-8">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Activity</h3>
                 {/* Add Activity Form */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <button onClick={() => setActivityType(ActivityType.Note)} className={`px-3 py-1 text-sm rounded-full ${activityType === ActivityType.Note ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Note</button>
                        <button onClick={() => setActivityType(ActivityType.Reminder)} className={`px-3 py-1 text-sm rounded-full ${activityType === ActivityType.Reminder ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Reminder</button>
                    </div>
                    <textarea
                        value={activityText}
                        onChange={(e) => setActivityText(e.target.value)}
                        placeholder={activityType === ActivityType.Note ? 'Add a note...' : 'Set a reminder...'}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {activityType === ActivityType.Reminder && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <select value={reminderChannel} onChange={(e) => setReminderChannel(e.target.value as ActivityChannel)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {Object.values(ActivityChannel).map(ch => <option key={ch} value={ch}>{ch}</option>)}
                            </select>
                            <input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    )}
                    <button onClick={handleAddActivity} className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400" disabled={!activityText.trim()}>Add Activity</button>
                </div>

                {/* Activity Feed */}
                <div className="space-y-4">
                    {editedLead.activities.map(activity => (
                        <div key={activity.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 pt-1">{activityIcon(activity)}</div>
                            <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">{activity.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(activity.timestamp).toLocaleString()}
                                    {activity.type === ActivityType.Reminder && activity.reminderDate && ` (Reminder for ${new Date(activity.reminderDate).toLocaleDateString()})`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

// Helper components for form fields
const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" {...props} />
    </div>
);

const SelectField = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <select className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" {...props}>
            {options.map(option => (
                typeof option === 'string'
                    ? <option key={option} value={option}>{option}</option>
                    : <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

export default LeadDetailModal;