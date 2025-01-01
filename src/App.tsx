// src/types/index.ts
// export interface Expense {
//   id: string;
//   title: string;
//   amount: number;
//   category: string;
//   date: string;
// }

// src/App.tsx
import { useState, useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Modal from 'react-modal';
// import { Expense } from './types';
import './App.css';
import Chart from './components/Chart';
import Expense from './interface/Expense';
import ExpenseForm from './components/ExpenseForm';
import { FaPlus } from 'react-icons/fa';
import Barchart from './components/Barchart';
import AddBalanceForm from './components/AddBalanceForm';

function ExpenseTracker() {
  const { enqueueSnackbar } = useSnackbar();
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('walletBalance');
    return saved ? Number(saved) : 5000;
  });
  const [expenseAmt, setExpenseAmt] = useState(() => {
    const amt = localStorage.getItem("expenseAmt");;
    return amt ? Number(amt) : 0;
  })
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    localStorage.setItem('walletBalance', balance.toString());
    localStorage.setItem('expenseAmt', expenseAmt.toString());
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
    setExpenseAmt(prev => prev + expense.amount);
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

    const expenseAmtDiff = expenseAmt - oldExpense.amount
    console.log(expenseAmtDiff, "expenseAmtDiff");
    if (oldExpense.amount > expense.amount) {
      setExpenseAmt(expenseAmtDiff + expense.amount);
    } else {
      setExpenseAmt(expenseAmtDiff - expense.amount);
    }
    setEditingExpense(null);
    setIsModalOpen(false);
    enqueueSnackbar('Expense updated successfully!', { variant: 'success' });
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    setExpenseAmt((prev) => prev - Number(expense?.amount))
    if (!expense) return;

    setExpenses(prev => prev.filter(e => e.id !== id));
    setBalance(prev => prev + expense.amount);
    enqueueSnackbar('Expense deleted successfully!', { variant: 'success' });
  };
  return (
    <div className="app">
      <h1 className='heading'>Expense Tracker</h1>
      <header className="header">
        <div className="card-section">
          <div className="cards">
            <h2 className="card-heading">
              Wallet Balance:
              <span className="wallet-amt"> ₹{balance}</span>
            </h2>
            <button onClick={() => setIsModalOpen(true)} className='add-expense'>
              <FaPlus />
              Add Expense</button>
          </div>
          <div className="cards">
            <div className="">
              <h2 className="card-heading">
                Expenses:
                <span className="expense-amt"> ₹{expenseAmt}</span>
              </h2>
            </div>
            <button
              className='add-balance'
              onClick={() => {
                setIsAddModalOpen(true)
              }}>Add Balance</button>
          </div>
          <div className="chart">
            <Chart />
          </div>
        </div>

      </header>

      <main>
        {/* Expense List */}
        <div className="wrapper">

          <div className="left-section">
            <div className="wrapper-heading">

              <h2 className='heading'>Recent Transactions</h2>
            </div>
            <div className="expense-list">
              {expenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <div className="item-img">
                      <img src={`/${expense.category}.svg`} alt="icon" />
                    </div>
                    <div className="exp-details">

                      <div className="title">
                        <h3>{expense.title}</h3>
                      </div>
                      <div className="date-section">
                        <p className='date'>{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="expense-actions">
                    <p className='price'>₹{expense.amount}</p>
                    <span
                      className='edit-btn'
                      onClick={() => {
                        setEditingExpense(expense);
                        setIsModalOpen(true);
                      }}>
                      <img src="/edit.png" alt="edit" />
                    </span>
                    <span onClick={() => deleteExpense(expense.id)}>
                      <img src="/cancel.svg" alt="delete" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
              // setExpenseAmt={setExpenseAmt}
              onClose={() => {
                setIsModalOpen(false);
                setEditingExpense(null);
              }}
            />
          </Modal>
          <Modal
            isOpen={isAddModalOpen}
            onRequestClose={() => {
              setIsAddModalOpen(false)
            }}
            className="modal"
            overlayClassName="overlay"

          >
            <AddBalanceForm setBalance={setBalance} onClose={() => setIsAddModalOpen(false)} />
          </Modal>
          <div className="right-section">
            <h2 className="heading">Top Expenses</h2>
            <div className="chart-section">
              <Barchart />
            </div>
          </div>
        </div>
      </main>
    </div>
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