import React from 'react';
import { Icon } from './icons';
import { Lead, LeadStage, User, Activity } from '../types';
import LeadTable from './LeadTable';
import SimpleBarChart from './SimpleBarChart';

const MetricCard = ({ title, value, iconName, color }: { title: string; value: string; iconName: string; color: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: `${color}20`, color: color }}>
      <Icon name={iconName} className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

interface DashboardProps {
  leads: Lead[];
  users: User[];
  currentUser: User;
  onUpdateLead: (lead: Lead) => void;
  onAddActivity: (leadId: number, activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ leads, users, currentUser, onUpdateLead, onAddActivity }) => {
  const userLeads = leads.filter(lead => lead.assignedTo.id === currentUser.id);

  const totalLeads = userLeads.length;
  const convertedLeads = userLeads.filter(lead => lead.stage === LeadStage.Won).length;
  const activeOpportunities = userLeads.filter(lead => [LeadStage.Contacted, LeadStage.MeetingScheduled, LeadStage.ProposalSent].includes(lead.stage)).length;
  const meetingsScheduled = userLeads.filter(lead => lead.stage === LeadStage.MeetingScheduled).length;

  const pipelineData = Object.values(LeadStage).map(stage => {
    const leadsInStage = userLeads.filter(lead => lead.stage === stage);
    return {
      name: stage,
      count: leadsInStage.length,
      value: leadsInStage.reduce((sum, lead) => sum + lead.value, 0)
    };
  });
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome back, {currentUser.name.split(' ')[0]}!</h2>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="My Total Leads" value={totalLeads.toString()} iconName="Users" color="#3b82f6" />
        <MetricCard title="My Converted Leads" value={convertedLeads.toString()} iconName="CheckCircle" color="#22c55e" />
        <MetricCard title="My Active Opportunities" value={activeOpportunities.toString()} iconName="Briefcase" color="#f97316" />
        <MetricCard title="My Meetings Scheduled" value={meetingsScheduled.toString()} iconName="Calendar" color="#8b5cf6" />
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">My Sales Pipeline</h3>
        <SimpleBarChart data={pipelineData} />
      </div>
      
      {/* Recent Leads Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">My Recent Leads</h3>
        <LeadTable leads={userLeads.slice(0, 5)} users={users} onUpdateLead={onUpdateLead} onAddActivity={onAddActivity} />
      </div>
    </div>
  );
};

export default Dashboard;