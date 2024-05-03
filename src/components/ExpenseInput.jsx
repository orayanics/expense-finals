import { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getUser } from "../utils/getUser";

export default function ExpenseInput() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  // TODO: Validate the expense amount to be a number
  // TODO: Validate the expense name to be a string
  // TODO: Add category (?)
  const handleExpenseSubmit = (event) => {
    event.preventDefault();

    const db = getDatabase();

    // Get USER ID
    const userId = getUser().userId; // Getting the user's UID from the getUser function

    // Unique ID new expense
    const newExpense = Math.random().toString(36).substr(2, 9);

    // Date
    const date = new Date();
    const formattedDate = date.toLocaleDateString("default", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    // Set expense data with server timestamp
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
