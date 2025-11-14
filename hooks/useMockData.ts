import { useState, useCallback, useEffect } from 'react';
import { User, Lead, LeadStage, Contact, EmailSequence, Integrations, Task, Activity, ActivityType, ActivityChannel } from '../types';

const initialUsers: User[] = [
  { id: 1, name: 'Alex Johnson', avatarUrl: `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3crect width='100' height='100' rx='20' fill='%23f97316'/%3e%3ctext x='50' y='55' font-family='Arial' font-size='40' fill='white' text-anchor='middle'%3eAJ%3c/text%3e%3c/svg%3e` },
  { id: 2, name: 'Maria Garcia', avatarUrl: `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3crect width='100' height='100' rx='20' fill='%238b5cf6'/%3e%3ctext x='50' y='55' font-family='Arial' font-size='40' fill='white' text-anchor='middle'%3eMG%3c/text%3e%3c/svg%3e` },
  { id: 3, name: 'James Smith', avatarUrl: `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3crect width='100' height='100' rx='20' fill='%2322c55e'/%3e%3ctext x='50' y='55' font-family='Arial' font-size='40' fill='white' text-anchor='middle'%3eJS%3c/text%3e%3c/svg%3e` },
];

const initialLeads: Lead[] = [
    {
    id: 1,
    companyName: 'Innovate Corp',
    contactPerson: 'John Doe',
    email: 'john.doe@innovate.com',
    phone: '123-456-7890',
    stage: LeadStage.MeetingScheduled,
    source: 'LinkedIn',
    assignedTo: initialUsers[0],
    lastContacted: '2023-10-26',
    notes: 'Initial contact made. Expressed interest in our AI solutions. Scheduled a demo for next Tuesday. Key pain point is data integration. Follow up with case studies before the meeting.',
    value: 50000,
    activities: [
        { id: 1, type: ActivityType.Note, text: 'Sent initial outreach email.', timestamp: '2023-10-25T10:00:00Z', completed: false},
        { id: 2, type: ActivityType.Reminder, text: 'Follow up call about the demo.', channel: ActivityChannel.Call, reminderDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), timestamp: '2023-10-26T14:30:00Z', completed: false}
    ],
  },
  {
    id: 2,
    companyName: 'Tech Solutions Ltd.',
    contactPerson: 'Jane Smith',
    email: 'jane.s@techsolutions.com',
    phone: '987-654-3210',
    stage: LeadStage.ProposalSent,
    source: 'Referral',
    assignedTo: initialUsers[1],
    lastContacted: '2023-10-25',
    notes: 'Met Jane at a conference. Strong interest in the enterprise package. Sent over a detailed proposal. They are comparing our solution with two other vendors. Follow up EOD Friday.',
    value: 75000,
    activities: [],
  },
  {
    id: 3,
    companyName: 'Data Analytics Inc.',
    contactPerson: 'Peter Jones',
    email: 'peter.j@dataanalytics.com',
    phone: '555-123-4567',
    stage: LeadStage.Contacted,
    source: 'Website',
    assignedTo: initialUsers[0],
    lastContacted: '2023-10-27',
    notes: 'Downloaded our whitepaper. Sent a follow-up email. Needs some nurturing before they are ready for a demo. Main concern is pricing and ROI.',
    value: 30000,
    activities: [],
  },
   {
    id: 4,
    companyName: 'Global Exports',
    contactPerson: 'Susan Chen',
    email: 's.chen@globalexports.com',
    phone: '111-222-3333',
    stage: LeadStage.New,
    source: 'Cold Call',
    assignedTo: initialUsers[2],
    lastContacted: '2023-10-28',
    notes: 'New lead from the marketing campaign. Haven\'t been able to reach Susan yet. Left a voicemail. Will try again tomorrow morning.',
    value: 20000,
    activities: [],
  },
  {
    id: 5,
    companyName: 'Quantum Dynamics',
    contactPerson: 'Mike Williams',
    email: 'mike.w@quantum.com',
    phone: '222-333-4444',
    stage: LeadStage.Won,
    source: 'Partner',
    assignedTo: initialUsers[1],
    lastContacted: '2023-09-15',
    notes: 'Closed the deal after a long negotiation. They signed the annual contract. Onboarding process has started. Great win for the team!',
    value: 120000,
    activities: [],
  },
  {
    id: 6,
    companyName: 'Stellar Systems',
    contactPerson: 'Emily Brown',
    email: 'emily.b@stellar.com',
    phone: '444-555-6666',
    stage: LeadStage.Lost,
    source: 'Website',
    assignedTo: initialUsers[2],
    lastContacted: '2023-10-10',
    notes: 'Lost to a competitor due to pricing. Their budget was too tight for our premium features. Will keep them on the mailing list for future offers.',
    value: 45000,
    activities: [],
  }
];

const initialContacts: Contact[] = [
    { id: 1, name: 'Laura Wilson', email: 'laura.w@innovate.com', phone: '123-111-2222', company: 'Innovate Corp'},
    { id: 2, name: 'Robert Miller', email: 'rob.m@techsolutions.com', phone: '987-222-3333', company: 'Tech Solutions Ltd.'},
];

const initialEmailSequences: EmailSequence[] = [
    {
        id: 1,
        name: 'New Prospect Nurturing',
        steps: [
            { id: 1, delayDays: 0, subject: 'Following up on your interest', body: 'Hi {{contact.name}}, thanks for reaching out. I\'d love to schedule a brief call to discuss your needs. Are you free tomorrow at 2 PM?' },
            { id: 2, delayDays: 3, subject: 'Quick check-in', body: 'Hi {{contact.name}}, just wanted to follow up on my previous email. Let me know if you have any questions about our solutions.' },
            { id: 3, delayDays: 5, subject: 'Case study: How we helped Company X', body: 'Hi {{contact.name}}, thought you might find this case study interesting. It highlights how we helped a company similar to yours achieve a 50% increase in efficiency. [Link to case study]' },
        ]
    }
];

const initialTasks: Task[] = [
  { id: 1, text: 'Follow up with John Doe', completed: false },
  { id: 2, text: 'Prepare proposal for Tech Solutions', completed: false },
  { id: 3, text: 'Schedule demo with Data Analytics Inc.', completed: true },
];

const initialIntegrations: Integrations = { whatsapp: false, linkedin: false };

export const useMockData = () => {
    // Helper to get initial state from localStorage
    const getInitialState = <T,>(key: string, defaultValue: T): T => {
        try {
            const storedValue = localStorage.getItem(key);
            if (storedValue) {
                return JSON.parse(storedValue);
            }
        } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
        }
        return defaultValue;
    };

    const [leads, setLeads] = useState<Lead[]>(() => getInitialState('crm_leads', initialLeads));
    const [contacts, setContacts] = useState<Contact[]>(() => getInitialState('crm_contacts', initialContacts));
    const [emailSequences, setEmailSequences] = useState<EmailSequence[]>(() => getInitialState('crm_email_sequences', initialEmailSequences));
    const [integrations, setIntegrations] = useState<Integrations>(() => getInitialState('crm_integrations', initialIntegrations));
    const [tasks, setTasks] = useState<Task[]>(() => getInitialState('crm_tasks', initialTasks));
    const users = initialUsers;

    // Effects to save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('crm_leads', JSON.stringify(leads));
    }, [leads]);

    useEffect(() => {
        localStorage.setItem('crm_contacts', JSON.stringify(contacts));
    }, [contacts]);

    useEffect(() => {
        localStorage.setItem('crm_email_sequences', JSON.stringify(emailSequences));
    }, [emailSequences]);

    useEffect(() => {
        localStorage.setItem('crm_integrations', JSON.stringify(integrations));
    }, [integrations]);

    useEffect(() => {
        localStorage.setItem('crm_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const updateLeadStage = useCallback((leadId: number, newStage: LeadStage) => {
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, stage: newStage } : lead
        )
      );
    }, []);

    const updateLead = useCallback((updatedLead: Lead) => {
        setLeads(prevLeads =>
            prevLeads.map(lead =>
                lead.id === updatedLead.id ? updatedLead : lead
            )
        );
    }, []);

    const addLead = useCallback((newLeadData: Omit<Lead, 'id' | 'assignedTo' | 'lastContacted' | 'activities'> & { assignedToId: number }) => {
        setLeads(prevLeads => {
            const newId = prevLeads.length > 0 ? Math.max(...prevLeads.map(l => l.id)) + 1 : 1;
            const assignedUser = users.find(u => u.id === newLeadData.assignedToId) || users[0];
            const newLead: Lead = {
                ...newLeadData,
                id: newId,
                assignedTo: assignedUser,
                lastContacted: new Date().toISOString().split('T')[0],
                activities: [],
            };
            return [newLead, ...prevLeads];
        });
    }, [users]);

    const deleteLeads = useCallback((leadIds: number[]) => {
        setLeads(prevLeads => prevLeads.filter(lead => !leadIds.includes(lead.id)));
    }, []);

    const addContact = useCallback((newContactData: Omit<Contact, 'id'>) => {
        setContacts(prevContacts => {
            const newId = prevContacts.length > 0 ? Math.max(...prevContacts.map(c => c.id)) + 1 : 1;
            const newContact: Contact = { ...newContactData, id: newId };
            return [newContact, ...prevContacts];
        });
    }, []);

    const updateSequence = useCallback((sequence: EmailSequence) => {
        setEmailSequences(prev => prev.map(s => s.id === sequence.id ? sequence : s));
    }, []);

    const toggleIntegration = useCallback((integrationName: keyof Integrations) => {
        setIntegrations(prev => ({ ...prev, [integrationName]: !prev[integrationName] }));
    }, []);
    
    const addTask = useCallback((text: string) => {
      setTasks(prev => {
        const newId = prev.length > 0 ? Math.max(...prev.map(t => t.id)) + 1 : 1;
        return [...prev, {id: newId, text, completed: false}];
      });
    }, []);

    const toggleTask = useCallback((id: number) => {
      setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t));
    }, []);
    
    const deleteTask = useCallback((id: number) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    }, []);

    const addLeadActivity = useCallback((leadId: number, activity: Omit<Activity, 'id' | 'timestamp'>) => {
        setLeads(prevLeads => 
            prevLeads.map(lead => {
                if (lead.id === leadId) {
                    const newActivity: Activity = {
                        ...activity,
                        id: Date.now(),
                        timestamp: new Date().toISOString(),
                        completed: false,
                    };
                    return {
                        ...lead,
                        activities: [newActivity, ...lead.activities],
                    };
                }
                return lead;
            })
        );
    }, []);
    
    const toggleActivityCompletion = useCallback((leadId: number, activityId: number) => {
        setLeads(prevLeads =>
            prevLeads.map(lead => {
                if (lead.id === leadId) {
                    return {
                        ...lead,
                        activities: lead.activities.map(activity => {
                            if (activity.id === activityId) {
                                return { ...activity, completed: !activity.completed };
                            }
                            return activity;
                        }),
                    };
                }
                return lead;
            })
        );
    }, []);

    return { 
        users, 
        leads, 
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
    };
};