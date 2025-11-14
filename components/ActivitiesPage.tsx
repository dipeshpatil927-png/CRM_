import React, { useMemo } from 'react';
import { Lead, ActivityType, ActivityChannel, Activity } from '../types';
import { Icon } from './icons';

interface ActivitiesPageProps {
  leads: Lead[];
  onToggleActivity: (leadId: number, activityId: number) => void;
}

type ActivityWithLeadInfo = Activity & {
  leadId: number;
  leadCompanyName: string;
  leadContactPerson: string;
};

const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ leads, onToggleActivity }) => {
  const upcomingReminders = useMemo(() => {
    const allReminders: ActivityWithLeadInfo[] = [];

    leads.forEach(lead => {
      lead.activities.forEach(activity => {
        if (activity.type === ActivityType.Reminder && activity.reminderDate && !activity.completed) {
          allReminders.push({
            ...activity,
            leadId: lead.id,
            leadCompanyName: lead.companyName,
            leadContactPerson: lead.contactPerson,
          });
        }
      });
    });

    return allReminders.sort((a, b) => new Date(a.reminderDate!).getTime() - new Date(b.reminderDate!).getTime());
  }, [leads]);

  const getUrgencyStyles = (reminderDateStr: string | undefined) => {
    if (!reminderDateStr) return { card: '', indicator: 'bg-gray-400', pulse: false };
    
    const reminderDate = new Date(reminderDateStr);
    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(now.getDate() + 5);

    if (reminderDate <= twoDaysFromNow) {
        // Red: Overdue or due within 2 days
        return { card: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', indicator: 'bg-red-500', pulse: true };
    } else if (reminderDate > twoDaysFromNow && reminderDate <= fiveDaysFromNow) {
        // Yellow: Due in 3-5 days
        return { card: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', indicator: 'bg-yellow-500', pulse: false };
    } else {
        // Green: Due in more than 5 days
        return { card: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', indicator: 'bg-green-500', pulse: false };
    }
  };
  
  const activityIcon = (channel?: ActivityChannel) => {
    switch(channel) {
        case ActivityChannel.Call: return <Icon name="PhoneCall" className="w-5 h-5 text-blue-500" />;
        case ActivityChannel.Email: return <Icon name="Mail" className="w-5 h-5 text-green-500" />;
        case ActivityChannel.WhatsApp: return <Icon name="MessageSquare" className="w-5 h-5 text-teal-500" />;
        case ActivityChannel.LinkedIn: return <Icon name="Link" className="w-5 h-5 text-indigo-500" />;
        default: return <Icon name="Clock" className="w-5 h-5 text-gray-500" />;
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Activities</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upcoming Reminders</h3>
        <div className="space-y-4">
            {upcomingReminders.length > 0 ? (
                upcomingReminders.map(activity => {
                    const { card, indicator, pulse } = getUrgencyStyles(activity.reminderDate);
                    return (
                        <div key={activity.id} className={`p-4 rounded-lg border flex items-start space-x-4 transition-all ${card}`}>
                            <div className="flex-none pt-1">
                                <span className={`block w-3 h-3 rounded-full ${indicator} ${pulse ? 'animate-pulse' : ''}`}></span>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{activity.text}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    For: <span className="font-medium text-gray-700 dark:text-gray-300">{activity.leadCompanyName}</span> ({activity.leadContactPerson})
                                </p>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <Icon name="Calendar" className="w-4 h-4 mr-1.5" />
                                        {new Date(activity.reminderDate!).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center">
                                        {activityIcon(activity.channel)}
                                        <span className="ml-1.5">{activity.channel}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-none flex items-center self-center">
                                <input
                                    type="checkbox"
                                    id={`activity-${activity.id}`}
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    onChange={() => onToggleActivity(activity.leadId, activity.id)}
                                />
                                 <label htmlFor={`activity-${activity.id}`} className="ml-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">Mark Complete</label>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-12">
                     <Icon name="Bell" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">No upcoming reminders. All caught up!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
