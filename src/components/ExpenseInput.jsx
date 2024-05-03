import { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getUser } from "../utils/getUser";

function validateInput(type, amount) {
  const typeRegex = /^[a-zA-Z0-9\s]*$/;
  const isType = typeRegex.test(type);

  // Check if the type is a string and the amount is a number
  if (!type.trim() || !amount.trim()) {
    return false;
  }
  if (!isType) {
    return false;
  }
  if (amount <= 0) {
    return false;
  }
  return true;
}

export default function ExpenseInput() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  // TODO: Add category (?)
  const handleExpenseSubmit = (event) => {
    event.preventDefault();

    // Validate the input
    if (!validateInput(expenseName, expenseAmount)) {
      alert("Invalid input. Please enter a valid expense name and amount.");
      setExpenseName("");
      setExpenseAmount("");
      return;
    }
    const db = getDatabase();

    // Get USER ID
    const userId = getUser().userId;

    // Unique ID new expense
    const newExpense = Math.random().toString(36).substr(2, 9);

    // Date
    const date = new Date();
    const formattedDate = date.toLocaleDateString("default", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const newExpenseData = {
      date: formattedDate,
      type: expenseName,
      amount: parseFloat(expenseAmount),
    };

    // Insert to db
    set(ref(db, `users/${userId}/expenses/${newExpense}`), newExpenseData);
  };

  return (
    <>
      <div>
        <form onSubmit={handleExpenseSubmit}>
          <input
            type="text"
            placeholder="Enter Expense"
            value={expenseName}
            onChange={(event) => setExpenseName(event.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter Amount"
            value={expenseAmount}
            onChange={(event) => setExpenseAmount(event.target.value)}
            required
          />
          <button type="submit">Add Expense</button>
        </form>
      </div>
    </>
  );
}
