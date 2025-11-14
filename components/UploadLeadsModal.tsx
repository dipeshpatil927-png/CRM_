
import React, { useState, useCallback } from 'react';
import { Icon } from './icons';
import { Lead } from '../types';

interface UploadLeadsModalProps {
    onClose: () => void;
    onUpload: (leads: Omit<Lead, 'id' | 'assignedTo' | 'lastContacted' | 'stage' | 'activities'>[]) => void;
}

const UploadLeadsModal: React.FC<UploadLeadsModalProps> = ({ onClose, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            setError('');
        }
    }, []);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleUpload = () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const lines = text.split('\n').filter(line => line.trim() !== '');
                const headers = lines[0].split(',').map(h => h.trim());
                const requiredHeaders = ['companyName', 'contactPerson', 'email', 'value'];
                const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));

                if (!hasRequiredHeaders) {
                    setError(`CSV must contain the following headers: ${requiredHeaders.join(', ')}`);
                    return;
                }
                
                const leads = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const leadData = headers.reduce((obj, header, index) => {
                        obj[header] = values[index]?.trim() || '';
                        return obj;
                    }, {} as any);
                    
                    return {
                        companyName: leadData.companyName,
                        contactPerson: leadData.contactPerson,
                        email: leadData.email,
                        phone: leadData.phone || '',
                        source: leadData.source || 'CSV Upload',
                        notes: leadData.notes || '',
                        value: Number(leadData.value) || 0,
                    };
                });
                
                onUpload(leads);

            } catch (err) {
                setError('Failed to parse CSV file. Please check the format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Leads via CSV</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><Icon name="X" className="w-6 h-6" /></button>
                </div>
                <div className="p-6">
                    <div 
                        onDrop={handleDrop} 
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center"
                    >
                        <Icon name="Upload" className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            {file ? `File selected: ${file.name}` : 'Drag & drop your CSV file here'}
                        </p>
                        <p className="text-sm text-gray-400">or</p>
                        <input type="file" id="file-upload" className="hidden" accept=".csv" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:underline">browse files</label>
                    </div>
                    {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Required columns: companyName, contactPerson, email, value. Optional: phone, source, notes.</p>
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                    <button onClick={handleUpload} disabled={!file} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">Upload</button>
                </div>
            </div>
        </div>
    );
};

export default UploadLeadsModal;