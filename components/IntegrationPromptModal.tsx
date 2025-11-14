
import React from 'react';
import { Icon } from './icons';

interface IntegrationPromptModalProps {
    platform: 'WhatsApp' | 'LinkedIn';
    onClose: () => void;
    onGoToSettings: () => void;
}

const IntegrationPromptModal: React.FC<IntegrationPromptModalProps> = ({ platform, onClose, onGoToSettings }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <Icon name={platform === 'WhatsApp' ? 'Mail' : 'Link'} className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connect to {platform}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        To send messages via {platform}, you need to connect your account from the Settings page first.
                    </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-2 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={onGoToSettings} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Go to Settings</button>
                </div>
            </div>
        </div>
    );
};

export default IntegrationPromptModal;
