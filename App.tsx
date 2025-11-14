import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from './components/icons';
import Dashboard from './components/Dashboard';
import LeadsPage from './components/LeadsPage';
import ContactsPage from './components/ContactsPage';
import EmailSequencesPage from './components/EmailSequencesPage';
import TasksPage from './components/TasksPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import ActivitiesPage from './components/ActivitiesPage';
import { useMockData } from './hooks/useMockData';
import { Lead, Contact, EmailSequence, User, Activity } from './types';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeView, setActiveView] = useState('Dashboard');
  const { 
    leads, 
    users, 
    contacts, 
    emailSequences,
    integrations,
    tasks,
    updateLeadStage, 
    addLead, 
    deleteLeads,
    addContact,
    updateSequence,
    toggleIntegration,
    addTask,
    toggleTask,
    deleteTask,
    updateLead,
    addLeadActivity,
    toggleActivityCompletion,
  } = useMockData();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const NavLink = useCallback(({ icon, label }: { icon: React.ReactNode; label: string; }) => {
    const isActive = activeView === label;
    return (
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); setActiveView(label); }}
          className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          } ${isSidebarCollapsed ? 'justify-center' : ''}`}
          aria-current={isActive ? 'page' : undefined}
        >
          {icon}
          {!isSidebarCollapsed && <span className="ml-3">{label}</span>}
        </a>
    );
  }, [isSidebarCollapsed, activeView]);


  const renderContent = () => {
    switch(activeView) {
      case 'Dashboard':
        return <Dashboard leads={leads} users={users} onUpdateLead={updateLead} onAddActivity={addLeadActivity} />;
      case 'Leads':
        return <LeadsPage 
                  leads={leads} 
                  users={users} 
                  updateLeadStage={updateLeadStage} 
                  addLead={addLead} 
                  deleteLeads={deleteLeads}
                  integrations={integrations}
                  onUpdateLead={updateLead}
                  setActiveView={setActiveView}
                  onAddActivity={addLeadActivity}
                />;
      case 'Contacts':
        return <ContactsPage contacts={contacts} addContact={addContact} />;
      case 'Email Sequences':
        return <EmailSequencesPage sequences={emailSequences} onUpdateSequence={updateSequence} />;
      case 'Tasks':
        return <TasksPage tasks={tasks} addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask}/>;
      case 'Reports':
        return <ReportsPage leads={leads} />;
      case 'Settings':
        return <SettingsPage integrations={integrations} onToggleIntegration={toggleIntegration} />;
      case 'Activities':
        return <ActivitiesPage leads={leads} onToggleActivity={toggleActivityCompletion} />;
      default:
        return <Dashboard leads={leads} users={users} onUpdateLead={updateLead} onAddActivity={addLeadActivity} />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-gray-700">
          {!isSidebarCollapsed && <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Apex</h1>}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={isSidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink icon={<Icon name="LayoutDashboard" className="w-6 h-6" />} label="Dashboard" />
          <NavLink icon={<Icon name="Target" className="w-6 h-6" />} label="Leads" />
          <NavLink icon={<Icon name="Users" className="w-6 h-6" />} label="Contacts" />
          <NavLink icon={<Icon name="Mail" className="w-6 h-6" />} label="Email Sequences" />
          <NavLink icon={<Icon name="CheckSquare" className="w-6 h-6" />} label="Tasks" />
          <NavLink icon={<Icon name="Bell" className="w-6 h-6" />} label="Activities" />
          <NavLink icon={<Icon name="BarChart" className="w-6 h-6" />} label="Reports" />
          <NavLink icon={<Icon name="Settings" className="w-6 h-6" />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
             {/* Global Search can be implemented here */}
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                <Icon name={theme === 'light' ? 'Moon' : 'Sun'} className="w-6 h-6"/>
            </button>
            <div className="relative">
              <img
                src={`data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ccircle cx='50' cy='50' r='50' fill='%2360a5fa'/%3e%3c/svg%3e`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;