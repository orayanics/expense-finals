import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, update, set } from "firebase/database";
import { getUser } from "../utils/getUser";

export default function ExpenseList({ totalAmount, setTotalAmount}) {
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = getUser();

  const db = getDatabase();

  // THIS IS FOR FETCHING WOOF
  useEffect(() => {
    const fetchData = () => {
      const unsubscribe = onValue(
        ref(db, `users/${userId}/expenses`),
        (snapshot) => {
          const userExpenses = snapshot.val();
          if (userExpenses) {
            const allExpenses = Object.entries(userExpenses).map(
              ([expenseId, expense]) => ({
                expenseId,
                ...expense,
              })
            );

            // sort by date
            const sortedExpenses = allExpenses.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });

            // total amount
            const totalAmount = sortedExpenses.reduce((total, expense) => {
              return total + parseFloat(expense.amount);
            }, 0);

            setTotalAmount(totalAmount);
            setExpenses(sortedExpenses);
          } else {
            setExpenses([]);
            setTotalAmount(0);
            console.log("No expenses found for the user.");
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    };

    fetchData();
  }, [userId, db]);

  // THIS IS FOR DELETING WOOF
  // TODO: Add a confirmation dialog before deleting
  const handleDelete = (expenseId) => {
    remove(ref(db, `users/${userId}/expenses/${expenseId}`));
  };

  // THIS IS FOR EDITING WOOF
  const handleEdit = (updatedExpense, expenseId) => {
    // Validate the input
    if (!validateInput(updatedExpense.type, updatedExpense.amount)) {
      alert("Invalid input. Please enter a valid expense name and amount.");
      return;
    }

    const { expenseId: _, ...updatedData } = updatedExpense;
    update(ref(db, `users/${userId}/expenses/${expenseId}`), updatedData)
      .then(() => {
        setEditExpense(null);
      })
      .catch((error) => {
        console.error("Error updating expense: ", error);
      });
  };

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
