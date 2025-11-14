import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from './components/icons';
import Dashboard from './components/Dashboard';
import LeadsPage from './components/LeadsPage';
import ContactsPage from './components/ContactsPage';
import EmailSequencesPage from './components/EmailSequencesPage';
import TasksPage from './components/TasksPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import ActivitiesPage from './components/ActivitiesPage';
import LoginPage from './components/LoginPage';
import { useMockData } from './hooks/useMockData';
import { Lead, Contact, EmailSequence, User, Activity } from './types';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [activeView, setActiveView] = useState('Dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
    updateLeadsStage,
    addActivityToLeads,
  } = useMockData();

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const item = window.sessionStorage.getItem('currentUser');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error parsing user from session storage", error);
      return null;
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = useCallback((email: string): User | null => {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
          window.sessionStorage.setItem('currentUser', JSON.stringify(user));
          setCurrentUser(user);
          return user;
      }
      return null;
  }, [users]);

  const handleLogout = useCallback(() => {
      window.sessionStorage.removeItem('currentUser');
      setCurrentUser(null);
      setIsProfileMenuOpen(false);
  }, []);


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
    if (!currentUser) return null;
    switch(activeView) {
      case 'Dashboard':
        return <Dashboard leads={leads} users={users} onUpdateLead={updateLead} onAddActivity={addLeadActivity} currentUser={currentUser} />;
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
                  updateLeadsStage={updateLeadsStage}
                  addActivityToLeads={addActivityToLeads}
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
        return <Dashboard leads={leads} users={users} onUpdateLead={updateLead} onAddActivity={addLeadActivity} currentUser={currentUser} />;
    }
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
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
            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="flex items-center space-x-2">
                <img
                  src={currentUser.avatarUrl}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">{currentUser.name}</span>
                <Icon name="ChevronDown" className="w-4 h-4 text-gray-500" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div className="font-medium">{currentUser.name}</div>
                    <div className="truncate text-gray-500 dark:text-gray-400">{currentUser.email}</div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Icon name="LogOut" className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
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