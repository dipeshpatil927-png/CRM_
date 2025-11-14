
import React, { useState } from 'react';
import { Contact } from '../types';
import { Icon } from './icons';

interface AddContactModalProps {
    onClose: () => void;
    onAddContact: (contactData: Omit<Contact, 'id'>) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onAddContact }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            onAddContact(formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Contact</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Icon name="X" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                        <InputField label="Company" name="company" value={formData.company} onChange={handleChange} />
                        <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Contact</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" {...props} />
    </div>
);

export default AddContactModal;
