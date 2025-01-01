import Expense from "./Expense";

interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
  initialData?: Expense | null;
  // setExpenseAmt: (value:number|string) => void;
  onClose: () => void;
}
export default ExpenseFormProps;
