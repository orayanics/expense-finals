import { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import { getUser } from "../utils/getUser";
import { successAlert, errorAlert } from "../utils/toastAlert";

function validateInput(type, amount) {
  const typeRegex = /^[a-zA-Z0-9\s]+$/;
  const isTypeValid = typeRegex.test(type);
  const isAmountValid = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
  return isTypeValid && isAmountValid;
}

export default function ExpenseInput() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    const amount = parseFloat(expenseAmount);

    if (!validateInput(expenseName, amount)) {
      errorAlert("Invalid input. Please enter a valid expense name and amount.")
      return;
    }

    setIsLoading(true);

    const db = getDatabase();
    const userId = getUser().userId;

    // unique id for new expense
    const expenseListRef = ref(db, `users/${userId}/expenses`);
    const newExpenseRef = push(expenseListRef);

    set(newExpenseRef, {
      date: new Date().toISOString(),
      type: expenseName,
      amount: amount,
    })
      .then(() => {
        successAlert("Added successfully")
        setExpenseName("");
        setExpenseAmount("");
      })
      .catch((error) => {
        errorAlert("Failed to add expense. Please try again.")
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form onSubmit={handleExpenseSubmit}>
        <input
          type="text"
          placeholder="ENTER DESCRIPTION"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          className="expense-input"
          required
        />
        <input
          type="number"
          placeholder="ENTER AMOUNT"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="expense-input"
          required
        />
        <button type="submit" className="expense-add-btn" disabled={isLoading}>
          {isLoading ? "Adding..." : "+"}
        </button>
      </form>
    </>
  );
}
