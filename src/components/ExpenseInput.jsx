import { useState } from "react";
import { getDatabase, ref, push, set, runTransaction } from "firebase/database";
import { getUser } from "../utils/getUser";
import { successAlert, errorAlert } from "../utils/toastAlert";

function validateInput(type, amount) {
  const typeRegex = /^[a-zA-Z0-9\s]+$/;
  const isTypeValid = typeRegex.test(type) && type.length <= 155;
  const isAmountValid = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
  return isTypeValid && isAmountValid;
}

export default function ExpenseInput() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const db = getDatabase();
  const userId = getUser().userId;

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    const amount = parseFloat(expenseAmount);

    if (!validateInput(expenseName, amount)) {
      errorAlert(
        "Invalid input. Please enter a valid expense name and amount."
      );
      return;
    }

    setIsLoading(true);

    const expenseListRef = ref(db, `users/${userId}/expenses`);
    const newExpenseRef = push(expenseListRef);

    try {
      await set(newExpenseRef, {
        date: new Date().toISOString(),
        type: expenseName,
        amount: amount,
      });

      // minus sa balance
      const balanceRef = ref(db, `users/${userId}/balance`);
      await runTransaction(balanceRef, (currentBalance) => {
        if (currentBalance === null) {
          return { amount: -amount }; // if balance is null, set to negative amount
        }
        return { amount: currentBalance.amount - amount };
      });

      successAlert("Expense added successfully");
      setExpenseName("");
      setExpenseAmount("");
    } catch (error) {
      errorAlert("Failed to add expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <h3>Bought something?</h3>
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
          <button
            type="submit"
            className="expense-add-btn-2"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "+"}
          </button>
        </form>
      </div>
    </>
  );
}
