import React, { useState } from 'react'
import { enqueueSnackbar } from 'notistack';
import AddExpenseForm from '../interface/AddExpenseProps';
const AddBalanceForm = ({ setBalance, onClose }: AddExpenseForm) => {
    const [amount, setAmount] = useState<number>(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBalance((prev: number) => prev + amount);
        onClose();
        enqueueSnackbar('Balance added successfully!', { variant: 'success' });
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="add-heading">
                <h2>Add Balance</h2>
            </div>
            <div className="form-group">
                <input
                    placeholder='Income Amount'
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                />
                <button type="submit" className='primary'>Add Balance</button>
                <button type="button" className='secondary' onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
}

export default AddBalanceForm