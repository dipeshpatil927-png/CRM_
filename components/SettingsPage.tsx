import React, { useState } from 'react';
import { Icon } from './icons';
import { Integrations } from '../types';

interface SettingsPageProps {
    integrations: Integrations;
    onToggleIntegration: (name: keyof Integrations) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ integrations, onToggleIntegration }) => {
    const [successMessage, setSuccessMessage] = useState('');

    const handleToggle = (name: keyof Integrations) => {
        onToggleIntegration(name);
        const isConnecting = !integrations[name];
        // Fix: The type of `name` is `keyof Integrations` which resolves to `string | number`.
        // To use string methods safely, we convert it to a string first.
        const nameAsString = String(name);
        const capitalizedName = nameAsString.charAt(0).toUpperCase() + nameAsString.slice(1);
        setSuccessMessage(`${capitalizedName} ${isConnecting ? 'connected' : 'disconnected'} successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const IntegrationCard = ({ name, icon, connected }: { name: string; icon: string; connected: boolean }) => (
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center">
                <Icon name={icon} className="w-8 h-8 mr-4" />
                <span className="font-medium text-gray-800 dark:text-white">{name}</span>
            </div>
            <button
                onClick={() => handleToggle(name.toLowerCase() as keyof Integrations)}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                    connected
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900'
                }`}
            >
                {connected ? 'Disconnect' : 'Connect'}
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h2>

            {successMessage && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-900/50 dark:border-green-600 dark:text-green-300" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Integrations</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Connect your favorite apps to streamline your workflow.
                </p>
                <div className="space-y-4">
                    <IntegrationCard name="WhatsApp" icon="Mail" connected={integrations.whatsapp} />
                    <IntegrationCard name="LinkedIn" icon="Link" connected={integrations.linkedin} />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;