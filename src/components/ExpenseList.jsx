import { useEffect, useState, useCallback } from "react";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  update,
} from "firebase/database";
import { getUser } from "../utils/getUser";

export default function ExpenseList({ setTotalAmount, setIsLoading }) {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = getUser();

  const db = getDatabase();

  // THIS IS FOR FETCHING WOOF
  const fetchData = useCallback(() => {
    const unsubscribe = onValue(
      ref(db, `users/${userId}/expenses`),
      (snapshot) => {
        const userExpenses = snapshot.val() || {};
        const allExpenses = Object.entries(userExpenses)
          .map(([expenseId, expense]) => ({
            expenseId,
            ...expense,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        const totalAmount = allExpenses.reduce(
          (total, expense) => total + Number(expense.amount),
          0
        );

        setTotalAmount(totalAmount);
        setExpenses(allExpenses);
        setLoading(false);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, db, setTotalAmount, setLoading, setIsLoading]);

  useEffect(() => fetchData(), [fetchData]);

  // THIS IS FOR DELETING WOOF
  // TODO: Add a confirmation dialog before deleting
  const handleDelete = useCallback(
    (expenseId) => {
      remove(ref(db, `users/${userId}/expenses/${expenseId}`));
    },
    [db, userId]
  );

  // THIS IS FOR EDITING WOOF
  const handleEdit = useCallback(
    (updatedExpense, expenseId) => {
      if (!validateInput(updatedExpense.type, updatedExpense.amount)) {
        alert("Invalid input. Please enter a valid expense name and amount.");
        return;
      }
      update(ref(db, `users/${userId}/expenses/${expenseId}`), {
        type: updatedExpense.type,
        amount: updatedExpense.amount,
      })
        .then(() => setEditExpense(null))
        .catch((error) => console.error("Error updating expense: ", error));
    },
    [db, userId]
  );

  return (
    <div>
      <h2>Expense List</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.expenseId}>
              {editExpense === expense.expenseId ? (
                <div>
                  <input
                    type="text"
                    value={expense.type}
                    onChange={(e) =>
                      setExpenses((prevExpenses) =>
                        prevExpenses.map((prevExpense) =>
                          prevExpense.expenseId === expense.expenseId
                            ? { ...prevExpense, type: e.target.value }
                            : prevExpense
                        )
                      )
                    }
                  />
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) =>
                      setExpenses((prevExpenses) =>
                        prevExpenses.map((prevExpense) =>
                          prevExpense.expenseId === expense.expenseId
                            ? { ...prevExpense, amount: e.target.value }
                            : prevExpense
                        )
                      )
                    }
                  />
                  <button
                    onClick={() => handleEdit(expense, expense.expenseId)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  Type: {expense.type}, Amount: {expense.amount}
                  <button onClick={() => setEditExpense(expense.expenseId)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(expense.expenseId)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function validateInput(type, amount) {
  const typeRegex = /^[a-zA-Z0-9\s]*$/;
  const isType = typeRegex.test(type);

  // Check if the type is a string and the amount is a number
  if (!type || !amount) {
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
