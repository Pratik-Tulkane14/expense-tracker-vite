// src/types/index.ts
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

// src/App.tsx
import { useState, useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Modal from 'react-modal';
import { Expense } from './types';
import './App.css';
import Chart from './components/Chart';

function ExpenseTracker() {
  const { enqueueSnackbar } = useSnackbar();
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

  useEffect(() => {
    localStorage.setItem('walletBalance', balance.toString());
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [balance, expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    if (expense.amount > balance) {
      enqueueSnackbar('Insufficient balance!', { variant: 'error' });
      return;
    }

    const newExpense = {
      ...expense,
      id: crypto.randomUUID()
    };

    setExpenses(prev => [...prev, newExpense]);
    setBalance(prev => prev - expense.amount);
    enqueueSnackbar('Expense added successfully!', { variant: 'success' });
    setIsModalOpen(false);
  };

  const editExpense = (expense: Expense) => {
    const oldExpense = expenses.find(e => e.id === expense.id);
    if (!oldExpense) return;

    const balanceDiff = oldExpense.amount - expense.amount;
    if (balanceDiff < 0 && Math.abs(balanceDiff) > balance) {
      enqueueSnackbar('Insufficient balance!', { variant: 'error' });
      return;
    }

    setExpenses(prev =>
      prev.map(e => e.id === expense.id ? expense : e)
    );
    setBalance(prev => prev + balanceDiff);
    setEditingExpense(null);
    setIsModalOpen(false);
    enqueueSnackbar('Expense updated successfully!', { variant: 'success' });
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    setExpenses(prev => prev.filter(e => e.id !== id));
    setBalance(prev => prev + expense.amount);
    enqueueSnackbar('Expense deleted successfully!', { variant: 'success' });
  };

  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
    enqueueSnackbar('Balance added successfully!', { variant: 'success' });
  };

  return (
    <div className="app">
      <h1 className='heading'>Expense Tracker</h1>
      <header className="header">
        <div className="card-section">
          <div className="cards">
            <h2 className="card-heading">
              Wallet Balance:
              <span className="wallet-amt">₹{balance}</span>
            </h2>
            {/* <div className="balance">Wallet Balance: </div> */}
            <button onClick={() => setIsModalOpen(true)}>Add Expense</button>
          </div>
          <div className="cards">
            <div className="">
              <h2 className="card-heading">
                Expenses:
                <span className="expense-amt">{balance}</span>
              </h2>
            </div>
            <button
              className='add-balance'
              onClick={() => {
                const amount = Number(prompt('Enter amount to add:'));
                if (!isNaN(amount) && amount > 0) {
                  addBalance(amount);
                }
              }}>Add Balance</button>
          </div>
          <div className="chart">
            <Chart />
          </div>
        </div>

      </header>

      <main>
        {/* Expense List */}
        <div className="expense-list">
          <h2>Recent Transactions</h2>
          {expenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <h3>{expense.title}</h3>
                <p>₹{expense.amount} - {expense.category}</p>
                <p>{new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="expense-actions">
                <button onClick={() => {
                  setEditingExpense(expense);
                  setIsModalOpen(true);
                }}>Edit</button>
                <button onClick={() => deleteExpense(expense.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Expense Form Modal */}
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
      </main>
    </div>
  );
}

// ExpenseForm Component
interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
  initialData?: Expense | null;
  onClose: () => void;
}

function ExpenseForm({ onSubmit, initialData, onClose }: ExpenseFormProps) {
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

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ExpenseTracker />
    </SnackbarProvider>
  );
}

export default App;