import Expense from "./Expense";

interface AddExpenseForm {
  setExpenseAmt: Expense ;
  onClose: () => void;
}
export default AddExpenseForm;