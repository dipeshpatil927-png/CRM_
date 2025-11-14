
import React, { useState, useMemo } from 'react';
import { Contact } from '../types';
import { Icon } from './icons';
import AddContactModal from './AddContactModal';

interface ContactsPageProps {
    contacts: Contact[];
    addContact: (contactData: Omit<Contact, 'id'>) => void;
}

const ContactsPage: React.FC<ContactsPageProps> = ({ contacts, addContact }) => {
    const [filter, setFilter] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(filter.toLowerCase()) ||
            contact.email.toLowerCase().includes(filter.toLowerCase()) ||
            contact.company.toLowerCase().includes(filter.toLowerCase())
        );
    }, [contacts, filter]);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Contacts</h2>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center" onClick={() => setIsAddModalOpen(true)}>
                <Icon name="PlusCircle" className="w-5 h-5 mr-2" /> Add Contact
            </button>
       </div>

       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredContacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{contact.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.company}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
       </div>
       {isAddModalOpen && <AddContactModal onClose={() => setIsAddModalOpen(false)} onAddContact={addContact} />}
    </div>
  );
};

export default ContactsPage;
