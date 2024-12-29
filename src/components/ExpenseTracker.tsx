import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Modal from 'react-modal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Expense {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
}

interface ExpenseFormData {
    title: string;
    amount: string;
    category: string;
    date: string;
}

export default function ExpenseTracker() {
    const { enqueueSnackbar } = useSnackbar();

    // State management
    const [balance, setBalance] = useState(() => {
        const saved = localStorage.getItem('walletBalance');
        return saved ? Number(saved) : 5000;
    });

    const [expenses, setExpenses] = useState<Expense[]>(() => {
        const saved = localStorage.getItem('expenses');
        return saved ? JSON.parse(saved) : [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    // Persist data in localStorage
    useEffect(() => {
        localStorage.setItem('walletBalance', balance.toString());
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [balance, expenses]);

    // Expense management functions
    const addExpense = (formData: ExpenseFormData) => {
        const amount = Number(formData.amount);

        if (amount > balance) {
            enqueueSnackbar('Insufficient balance!', { variant: 'error' });
            return;
        }

        const newExpense: Expense = {
            id: crypto.randomUUID(),
            title: formData.title,
            amount: amount,
            category: formData.category,
            date: formData.date
        };

        setExpenses(prev => [...prev, newExpense]);
        setBalance(prev => prev - amount);
        enqueueSnackbar('Expense added successfully!', { variant: 'success' });
        setIsModalOpen(false);
    };

    const editExpense = (formData: ExpenseFormData & { id: string }) => {
        const oldExpense = expenses.find(e => e.id === formData.id);
        if (!oldExpense) return;

        const newAmount = Number(formData.amount);
        const balanceDiff = oldExpense.amount - newAmount;

        if (balanceDiff < 0 && Math.abs(balanceDiff) > balance) {
            enqueueSnackbar('Insufficient balance!', { variant: 'error' });
            return;
        }

        const updatedExpense: Expense = {
            id: formData.id,
            title: formData.title,
            amount: newAmount,
            category: formData.category,
            date: formData.date
        };

        setExpenses(prev => prev.map(e => e.id === formData.id ? updatedExpense : e));
        setBalance(prev => prev + balanceDiff);
        enqueueSnackbar('Expense updated successfully!', { variant: 'success' });
        setIsModalOpen(false);
        setEditingExpense(null);
    };

    const deleteExpense = (expense: Expense) => {
        setExpenses(prev => prev.filter(e => e.id !== expense.id));
        setBalance(prev => prev + expense.amount);
        enqueueSnackbar('Expense deleted successfully!', { variant: 'success' });
    };

    const addToWallet = () => {
        const amount = prompt('Enter amount to add:');
        if (!amount) return;

        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            enqueueSnackbar('Please enter a valid amount', { variant: 'error' });
            return;
        }

        setBalance(prev => prev + numAmount);
        enqueueSnackbar('Balance added successfully!', { variant: 'success' });
    };

    // Calculate data for charts
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="expense-tracker">
            <header className="header">
                <h1>Expense Tracker</h1>
                <div className="wallet-info">
                    <div className="balance">Balance: ₹{balance.toFixed(2)}</div>
                    <button onClick={() => setIsModalOpen(true)}>Add Expense</button>
                    <button onClick={addToWallet}>Add Balance</button>
                </div>
            </header>

            <main className="main-content">
                <div className="expenses-section">
                    <h2>Recent Expenses</h2>
                    <div className="expense-list">
                        {expenses.map(expense => (
                            <div key={expense.id} className="expense-item">
                                <div className="expense-details">
                                    <h3>{expense.title}</h3>
                                    <p className="category">{expense.category}</p>
                                    <p className="date">{new Date(expense.date).toLocaleDateString()}</p>
                                </div>
                                <div className="amount">₹{expense.amount.toFixed(2)}</div>
                                <div className="actions">
                                    <button
                                        onClick={() => {
                                            setEditingExpense(expense);
                                            setIsModalOpen(true);
                                        }}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteExpense(expense)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="charts-section">
                    <div className="chart-container">
                        <h2>Expense Summary</h2>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {pieChartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>
            </main>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => {
                    setIsModalOpen(false);
                    setEditingExpense(null);
                }}
                className="modal"
                overlayClassName="overlay"
            >
                <ExpenseForm
                    onSubmit={editingExpense ? editExpense : addExpense}
                    initialData={editingExpense}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingExpense(null);
                    }}
                />
            </Modal>
        </div>
    );
}

interface ExpenseFormProps {
    onSubmit: (expense: any) => void;
    initialData?: Expense | null;
    onClose: () => void;
}

function ExpenseForm({ onSubmit, initialData, onClose }: ExpenseFormProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        amount: initialData?.amount.toString() || '',
        category: initialData?.category || '',
        date: initialData?.date || new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            id: initialData?.id
        });
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <h2>{initialData ? 'Edit Expense' : 'Add Expense'}</h2>

            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    min="0"
                />
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
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
                <label htmlFor="date">Date</label>
                <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                />
            </div>

            <div className="form-actions">
                <button type="submit">{initialData ? 'Update' : 'Add'}</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
}