import React, { useState } from 'react'
import ExpenseFormProps from '../interface/ExpenseFormProps';

const ExpenseForm = ({ onSubmit, initialData, onClose }: ExpenseFormProps) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        amount: initialData?.amount || '',
        category: initialData?.category || '',
        date: initialData?.date || new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: Number(formData.amount),
            id: initialData?.id
        });
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="heading">

                <h2>{initialData ? 'Edit Expense' : 'Add Expense'}</h2>
            </div>
            <div className="first-section">

                <div className="form-group">
                    <input
                        id="title"
                        placeholder='Title'
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        id="amount"
                        placeholder='Amount'
                        type="number"
                        value={formData.amount}
                        onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                        min="0"
                    />
                </div>
            </div>
            <div className="second-section">

                <div className="form-group">
                    <select
                        id="category"
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div className="form-group">
                    <input
                        id="date"
                        placeholder='Date'
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className='primary'>{initialData ? 'Update' : 'Add'}</button>
                <button type="button" className='secondary' onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
}

export default ExpenseForm