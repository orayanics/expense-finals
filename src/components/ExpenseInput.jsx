import { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import { getUser } from "../utils/getUser";

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
      alert("Invalid input. Please enter a valid expense name and amount.");
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
        alert("Expense added successfully!");
        setExpenseName("");
        setExpenseAmount("");
      })
      .catch((error) => {
        console.error("Error saving expense: ", error);
        alert("Failed to add expense. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form onSubmit={handleExpenseSubmit}>
        <input
          type="text"
          placeholder="Enter Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </>
  );
}
