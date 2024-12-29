import { useEffect, useState } from 'react';
import './App.css'
import { useSnackbar } from 'notistack';
import ButtonUI from './components/ButtonUi';
import Chart from './components/Chart';
import Modal from './components/Modal';
import ExpenseForm from './utils/interface';
import AddBalanceModal from './components/AddBalanceModal';
import Barchart from './components/Barchart';
import ConfirmationModal from './components/ConfirmationModal';
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}
function App() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('walletBalance');
    return saved ? Number(saved) : 5000;
  });
  const [modalName, setModalName] = useState<string>("Add Expenses");

  const [expenses, setExpenses] = useState<ExpenseForm[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] =
    useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const handleDelete = () => {
    const expensesListString = localStorage.getItem("expensesList");
    const walletBalance = localStorage.getItem("balance");
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const expensesList: ExpenseForm[] = expensesListString ? JSON.parse(expensesListString) : [];
    const updatedData = expensesList.filter(item =>
      !(item.title === selectedData.title &&
        item.price === selectedData.price &&
        item.category === selectedData.category &&
        item.date === selectedData.date)
    );
  }
  useEffect(() => {
    localStorage.setItem('walletBalance', balance.toString());
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [balance, expenses]);

  // New code start 
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
  const addBalance = (amount: number) => {
    setIsModalOpen(true)
    // setBalance(prev => prev + amount);
    // enqueueSnackbar('Balance added successfully!', { variant: 'success' });
  };
  return (
    <>

      <div className="main">
        <h2 className="heading">Expense Tracker</h2>
        <div className="section">
          <div className="card-section">

            <div className="cards">
              <div className="">
                <h2 className="card-heading">
                  Wallet Balance:
                  <span className="wallet-amt">&#x20b9;
                    {/* {walletBalance} */}
                  </span>
                </h2>
              </div>
              <div className="">
                <ButtonUI
                  name="Add Income"
                  handleClick={addBalance}
                  btnType="primary"
                />
              </div>
            </div>
            <div className="cards">
              <div className="">
                <h2 className="card-heading">
                  Expenses:
                  <span className="expense-amt">&#x20b9;
                    {/* {expenses} */}
                  </span>
                </h2>
              </div>
              <div className="">
                <ButtonUI
                  name="Add Expense"
                  handleClick={addExpense}
                  btnType="secondary"
                />
              </div>
            </div>
          </div>

          <div className="chart">
            <Chart />
          </div>
        </div>

        {isModalOpen && (
          <Modal modalName={modalName} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} formData={editingExpense} />
        )}
        {isAddBalanceModalOpen && (
          <AddBalanceModal
            isAddBalanceModalOpen={isAddBalanceModalOpen}
            setIsAddBalanceModalOpen={setIsAddBalanceModalOpen}
          />
        )}
        <div className="wrapper">
          <div className="left-section">
            <h2 className="heading">Recent Transactions</h2>
            <div className="table">
              {/* <div className="table-details">
                {expenses.map((item, index) => {
                  return (
                    <div className="details-wrapper" key={index}>
                      <div className="left-side">

                        <div className="item-img">
                          <img src={`/${item.category}.svg`} alt="icon" />
                        </div>
                        <div className="details">
                          <p className="title">{item.title}</p>
                          <p className="transaction-date">
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                      <div className="right-side">
                        <div className="">
                          <p className="price">&#x20b9;{item.price}</p>
                        </div>
                        <div className="action-btns">
                          <div className="cancel-btn-wrapper"
                          onClick={() => handleEditModal(item)}
                          >
                            <img src="/cancel.svg" alt="delete" />
                          </div>
                          <div className="edit-btn-wrapper"
                          onClick={() => handleEdit(item)}
                          >
                            <img src="/edit.png" alt="edit" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

              </div> */}
            </div>
          </div>
          <div className="right-section">
            <h2 className="heading">Top Expenses</h2>
            <div className="chart-section">
              <Barchart />
            </div>
          </div>
        </div>

      </div >
      <ConfirmationModal isDeleteModalOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen((prev) => !prev)} handleDelete={handleDelete} />
    </>
  );
}

export default App
