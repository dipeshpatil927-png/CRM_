export enum LeadStage {
  New = 'New',
  Contacted = 'Contacted',
  MeetingScheduled = 'Meeting Scheduled',
  ProposalSent = 'Proposal Sent',
  Won = 'Won',
  Lost = 'Lost',
}

export interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

export enum ActivityType {
  Note = 'Note',
  Reminder = 'Reminder',
}

export enum ActivityChannel {
  Email = 'Email',
  Call = 'Call',
  WhatsApp = 'WhatsApp',
  LinkedIn = 'LinkedIn',
}

export interface Activity {
  id: number;
  type: ActivityType;
  text: string;
  channel?: ActivityChannel;
  reminderDate?: string; // ISO string
  timestamp: string; // ISO string
  completed?: boolean;
}


export interface Lead {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  stage: LeadStage;
  source: string;
  assignedTo: User;
  lastContacted: string;
  notes: string;
  value: number;
  activities: Activity[];
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface EmailStep {
  id: number;
  delayDays: number; // Days to wait before sending this email
  subject: string;
  body: string;
}

export interface EmailSequence {
  id: number;
  name: string;
  steps: EmailStep[];
}

export interface Integrations {
    [key: string]: boolean;
    whatsapp: boolean;
    linkedin: boolean;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}