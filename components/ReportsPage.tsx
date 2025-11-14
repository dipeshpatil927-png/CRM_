
import React from 'react';
import { Lead, LeadStage } from '../types';
import SimpleBarChart from './SimpleBarChart';
import { Icon } from './icons';

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

const ReportsPage: React.FC<{ leads: Lead[] }> = ({ leads }) => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter(l => l.stage === LeadStage.Won).length;
    const lostLeads = leads.filter(l => l.stage === LeadStage.Lost).length;
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

    const leadsBySource = leads.reduce((acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sourceData = Object.entries(leadsBySource).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Conversion Rate" value={`${conversionRate}%`} iconName="TrendingUp" color="#22c55e" />
            <MetricCard title="Total Pipeline Value" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(totalValue)} iconName="Briefcase" color="#3b82f6" />
            <MetricCard title="Leads Won" value={wonLeads.toString()} iconName="CheckCircle" color="#8b5cf6" />
            <MetricCard title="Leads Lost" value={lostLeads.toString()} iconName="X" color="#ef4444" />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Leads by Source</h3>
            <SimpleBarChart data={sourceData} />
        </div>
        
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Icon name="BarChart" className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">More Advanced Reporting Available</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                Upgrade to our Enterprise plan for customizable dashboards, team performance analytics, and revenue forecasting.
            </p>
        </div>
    </div>
  );
};

export default ReportsPage;
