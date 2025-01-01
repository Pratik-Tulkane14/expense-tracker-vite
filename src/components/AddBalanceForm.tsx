import React, { useState } from 'react'
import { enqueueSnackbar } from 'notistack';
import AddExpenseForm from '../interface/AddExpenseProps';

const AddBalanceForm = ({ setBalance, onClose }: AddExpenseForm) => {
    const [formData, setFormData] = useState({
        amount: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBalance(prev => prev + Number(formData.amount));
        onClose();
        enqueueSnackbar('Balance added successfully!', { variant: 'success' });
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="add-bal-heading">
                <h2>Add Balance</h2>
            </div>
            <div className="form-group">
                <input
                    placeholder='Income Amount'
                    type="number"
                    value={formData.amount}
                    onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                />
                <button type="submit" className='primary'>Add Balance</button>
                <button type="button" className='secondary' onClick={onClose}>Cancel</button>
            </div>
            {/* <div className="form-actions">
            </div> */}
        </form>
    );
}

export default AddBalanceForm