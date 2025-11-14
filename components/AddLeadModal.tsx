
import React, { useState } from 'react';
import { Lead, LeadStage, User } from '../types';
import { Icon } from './icons';

interface AddLeadModalProps {
    users: User[];
    onClose: () => void;
    onAddLead: (leadData: Omit<Lead, 'id' | 'assignedTo' | 'lastContacted' | 'activities'> & { assignedToId: number }) => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ users, onClose, onAddLead }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        stage: LeadStage.New,
        source: '',
        value: 0,
        notes: '',
        assignedToId: users[0]?.id || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'value' || name === 'assignedToId' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.companyName && formData.contactPerson) {
            onAddLead(formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Lead</h2>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Icon name="X" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Form fields */}
                        <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
                        <InputField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
                        <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                        <InputField label="Value ($)" name="value" type="number" value={String(formData.value)} onChange={handleChange} />
                        <SelectField label="Stage" name="stage" value={formData.stage} onChange={handleChange} options={Object.values(LeadStage)} />
                        <SelectField label="Assigned To" name="assignedToId" value={String(formData.assignedToId)} onChange={handleChange} options={users.map(u => ({ value: u.id, label: u.name }))} />
                        <InputField label="Source" name="source" value={formData.source} onChange={handleChange} />
                        <TextAreaField label="Notes" name="notes" value={formData.notes} onChange={handleChange} />
                    </div>
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Lead</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper components for form fields
const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" {...props} />
    </div>
);

const SelectField = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <select className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" {...props}>
            {options.map(option => (
                typeof option === 'string'
                    ? <option key={option} value={option}>{option}</option>
                    : <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

const TextAreaField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea rows={4} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" {...props}></textarea>
    </div>
);

export default AddLeadModal;