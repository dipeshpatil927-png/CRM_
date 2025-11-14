
import React, { useState } from 'react';
import { EmailSequence, EmailStep } from '../types';
import { Icon } from './icons';

interface EmailSequencesPageProps {
    sequences: EmailSequence[];
    onUpdateSequence: (sequence: EmailSequence) => void;
}

const EmailSequencesPage: React.FC<EmailSequencesPageProps> = ({ sequences, onUpdateSequence }) => {
    const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(sequences[0] || null);
    
    const handleUpdateStep = (stepId: number, field: keyof EmailStep, value: string | number) => {
        if (!selectedSequence) return;
        const updatedSteps = selectedSequence.steps.map(step =>
            step.id === stepId ? { ...step, [field]: value } : step
        );
        onUpdateSequence({ ...selectedSequence, steps: updatedSteps });
    };
    
    const addStep = () => {
        if (!selectedSequence) return;
        const newStep: EmailStep = {
            id: Date.now(),
            delayDays: 1,
            subject: 'New Email Subject',
            body: 'Email content goes here...'
        };
        const updatedSequence = { ...selectedSequence, steps: [...selectedSequence.steps, newStep]};
        onUpdateSequence(updatedSequence);
        setSelectedSequence(updatedSequence);
    }

    return (
        <div className="flex h-full">
            {/* Sequence List Sidebar */}
            <aside className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Email Sequences</h2>
                <ul className="space-y-2">
                    {sequences.map(seq => (
                        <li key={seq.id}>
                            <a
                                href="#"
                                onClick={(e) => {e.preventDefault(); setSelectedSequence(seq);}}
                                className={`block p-3 rounded-lg text-left ${selectedSequence?.id === seq.id ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                {seq.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Sequence Editor */}
            <main className="flex-1 p-6">
                {selectedSequence ? (
                    <div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{selectedSequence.name}</h3>
                        <div className="space-y-8">
                            {selectedSequence.steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    {index > 0 && (
                                        <div className="flex items-center my-4">
                                            <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 h-px w-full"></div>
                                            <div className="mx-4 flex items-center">
                                                <Icon name="Calendar" className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="text-sm text-gray-500">Wait</span>
                                                <input
                                                  type="number"
                                                  min="0"
                                                  value={step.delayDays}
                                                  onChange={e => handleUpdateStep(step.id, 'delayDays', parseInt(e.target.value, 10))}
                                                  className="w-16 mx-2 text-center bg-transparent border-b border-gray-300 dark:border-gray-500 focus:outline-none focus:border-blue-500"
                                                />
                                                <span className="text-sm text-gray-500">days</span>
                                            </div>
                                            <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 h-px w-full"></div>
                                        </div>
                                    )}
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                        <div className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Step {index + 1}: Email</div>
                                        <input
                                            type="text"
                                            value={step.subject}
                                            onChange={e => handleUpdateStep(step.id, 'subject', e.target.value)}
                                            placeholder="Email Subject"
                                            className="w-full p-2 mb-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <textarea
                                            value={step.body}
                                            onChange={e => handleUpdateStep(step.id, 'body', e.target.value)}
                                            placeholder="Email body..."
                                            rows={5}
                                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </React.Fragment>
                            ))}
                            <button onClick={addStep} className="mt-4 flex items-center px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                               <Icon name="PlusCircle" className="w-5 h-5 mr-2" /> Add Step
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center h-full flex flex-col justify-center items-center">
                        <Icon name="Mail" className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-lg text-gray-500 dark:text-gray-400">Select a sequence to start editing.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default EmailSequencesPage;
