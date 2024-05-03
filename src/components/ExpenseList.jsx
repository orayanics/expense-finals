import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getUser } from "../utils/getUser";
export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const { userId } = getUser();

  useEffect(() => {
    const db = getDatabase();
    // filter only the expenses of the current user
    const userRef = ref(db, `users/${userId}/expenses`);

    const fetchData = () => {
      const unsubscribe = onValue(userRef, (snapshot) => {
        const userExpenses = snapshot.val();
        if (userExpenses) {
          const allExpenses = Object.entries(userExpenses).map(
            ([expenseId, expense]) => ({
              userId,
              expenseId,
              ...expense,
            })
          );
          setExpenses(allExpenses);
        } else {
          console.log("No expenses found for the user.");
        }
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <h2>Expense List</h2>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            User ID: {expense.userId}, Expense ID: {expense.expenseId}, Date:{" "}
            {expense.date}, Type: {expense.type}, Amount: {expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
