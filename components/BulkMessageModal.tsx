
import React, { useState } from 'react';
import { Icon } from './icons';

interface BulkMessageModalProps {
    platform: 'WhatsApp' | 'LinkedIn';
    selectedCount: number;
    onClose: () => void;
    onSend: (messageTemplate: string) => void;
}

const BulkMessageModal: React.FC<BulkMessageModalProps> = ({ platform, selectedCount, onClose, onSend }) => {
    const [message, setMessage] = useState(
        `Hi {{contactPerson}},\n\nI noticed you're with {{companyName}}. I'd love to connect and discuss how we can help your team.\n\nBest regards.`
    );

    const handleSubmit = () => {
        if (message.trim()) {
            onSend(message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send Bulk {platform} Message</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Icon name="X" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-600 dark:text-gray-300">
                        You are about to send a message to <span className="font-bold">{selectedCount}</span> selected lead(s).
                    </p>
                    <div>
                        <label htmlFor="message-template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message Template
                        </label>
                        <textarea
                            id="message-template"
                            rows={8}
                            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-500 dark:text-gray-400">
                        <p className="font-semibold mb-1">Personalization tokens:</p>
                        <p>Use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded-sm">{'{{contactPerson}}'}</code> for the lead's name.</p>
                        <p>Use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded-sm">{'{{companyName}}'}</code> for the company name.</p>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={!message.trim()}>
                        Send Messages
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkMessageModal;
