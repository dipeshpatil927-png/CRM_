import React, { useState, useMemo, useEffect } from 'react';
import { Lead, LeadStage, User, Activity } from '../types';
import LeadDetailModal from './LeadDetailModal';
import { Icon } from './icons';

const STAGE_COLORS: Record<LeadStage, string> = {
  [LeadStage.New]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [LeadStage.Contacted]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [LeadStage.MeetingScheduled]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [LeadStage.ProposalSent]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  [LeadStage.Won]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [LeadStage.Lost]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

interface LeadTableProps {
    leads: Lead[];
    users: User[];
    onUpdateLead: (lead: Lead) => void;
    onAddActivity: (leadId: number, activity: Omit<Activity, 'id' | 'timestamp'>) => void;
    selectedLeads?: Set<number>;
    setSelectedLeads?: React.Dispatch<React.SetStateAction<Set<number>>>;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, selectedLeads, setSelectedLeads, users, onUpdateLead, onAddActivity }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState('');
  const [stageFilter, setStageFilter] = useState<LeadStage | 'all'>('all');
  const [userFilter, setUserFilter] = useState<number | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead | null; direction: 'ascending' | 'descending' }>({
    key: 'lastContacted',
    direction: 'descending',
  });

  const sortedAndFilteredLeads = useMemo(() => {
    let filteredLeads = leads
      .filter(lead =>
        lead.companyName.toLowerCase().includes(filter.toLowerCase()) ||
        lead.contactPerson.toLowerCase().includes(filter.toLowerCase()) ||
        lead.email.toLowerCase().includes(filter.toLowerCase())
      )
      .filter(lead => stageFilter === 'all' || lead.stage === stageFilter)
      .filter(lead => userFilter === 'all' || lead.assignedTo.id === userFilter)
      .filter(lead => {
          if (!startDate && !endDate) return true;
          try {
            const leadDate = new Date(lead.lastContacted);
            if (startDate && leadDate < new Date(startDate)) return false;
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                if (leadDate > endOfDay) return false;
            }
            return true;
          } catch(e) {
              return true; // if date is invalid, don't filter it out
          }
      });

    if (sortConfig.key) {
      filteredLeads.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredLeads;
  }, [leads, filter, sortConfig, stageFilter, userFilter, startDate, endDate]);

  const requestSort = (key: keyof Lead) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Lead) => {
    if (sortConfig.key !== key) {
        return <Icon name="ChevronsUpDown" className="w-4 h-4 ml-2 opacity-30" />;
    }
    if (sortConfig.direction === 'ascending') {
        return <Icon name="ChevronUp" className="w-4 h-4 ml-2" />;
    }
    return <Icon name="ChevronDown" className="w-4 h-4 ml-2" />;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setSelectedLeads) return;
    if (e.target.checked) {
      setSelectedLeads(new Set(sortedAndFilteredLeads.map(l => l.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleSelectOne = (leadId: number) => {
    if (!setSelectedLeads) return;
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };
  
  // Clear selection when the list of leads changes
  useEffect(() => {
    setSelectedLeads?.(new Set());
  }, [leads, setSelectedLeads]);

  const isAllSelected = !!selectedLeads && sortedAndFilteredLeads.length > 0 && selectedLeads.size === sortedAndFilteredLeads.length;
  
  const resetFilters = () => {
    setFilter('');
    setStageFilter('all');
    setUserFilter('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <input
          type="text"
          placeholder="Search leads..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="lg:col-span-2 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value as LeadStage | 'all')} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="all">All Stages</option>
            {Object.values(LeadStage).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={userFilter} onChange={e => setUserFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="all">All Users</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
         <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Reset</button>
        <div className="lg:col-span-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">Last Contacted:</label>
            <div className="flex items-center space-x-2">
                 <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                 <span className="text-gray-500 dark:text-gray-400">to</span>
                 <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="p-4">
                 {setSelectedLeads && (
                    <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all leads"
                    />
                 )}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('companyName')}>
                <div className="flex items-center">Company {getSortIcon('companyName')}</div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('stage')}>
                <div className="flex items-center">Stage {getSortIcon('stage')}</div>
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('value')}>
                <div className="flex items-center">Value {getSortIcon('value')}</div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Assigned To
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('lastContacted')}>
                <div className="flex items-center">Last Contacted {getSortIcon('lastContacted')}</div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedAndFilteredLeads.map((lead) => (
              <tr 
                key={lead.id} 
                className={`transition-colors ${selectedLeads?.has(lead.id) ? 'bg-blue-50 dark:bg-blue-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <td className="p-4">
                   {setSelectedLeads && (
                    <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedLeads?.has(lead.id) || false}
                        onChange={() => handleSelectOne(lead.id)}
                        aria-label={`Select lead ${lead.companyName}`}
                    />
                   )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.companyName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{lead.contactPerson}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STAGE_COLORS[lead.stage]}`}>
                    {lead.stage}
                  </span>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                   {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lead.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full" src={lead.assignedTo.avatarUrl} alt={lead.assignedTo.name} />
                    <div className="ml-3 text-sm text-gray-900 dark:text-white">{lead.assignedTo.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => setSelectedLead(lead)}>{lead.lastContacted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} users={users} onUpdateLead={onUpdateLead} onAddActivity={onAddActivity} />}
    </div>
  );
};

export default LeadTable;