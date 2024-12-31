import Expense from "./Expense";

interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
  initialData?: Expense | null;
  onClose: () => void;
}
export default ExpenseFormProps;
