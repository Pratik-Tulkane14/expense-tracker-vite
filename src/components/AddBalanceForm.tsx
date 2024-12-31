import React, { useState } from 'react'
import ExpenseFormProps from '../interface/ExpenseFormProps';

const AddBalanceForm = ({ onSubmit, onClose }: ExpenseFormProps) => {
    const [formData, setFormData] = useState({
        amount: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: Number(formData.amount),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="heading">
                <h2>Add Balance</h2>
            </div>
            <div className="form-group">
                <input
                    placeholder='Income Amount'
                    type="text"
                    value={formData.amount}
                    onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                />
            </div>
            <div className="form-actions">
                <button type="submit" className='primary'>Add Balance</button>
                <button type="button" className='secondary' onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
}

export default AddBalanceForm